import base64
import json
import os
import re
import urllib.request
import urllib.error
import uuid

import psycopg2

API_URL = 'https://api.yookassa.ru/v3/payments'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}

PLACEHOLDERS = {'placeholder', 'changeme', 'todo', 'test', 'xxx', 'none', '-'}

PRODUCTS = {
    'coins-100': {'title': '100 монет', 'amount': 100},
    'coins-500': {'title': '500 монет', 'amount': 400},
    'coins-1200': {'title': '1200 монет', 'amount': 800},
    'no-ads': {'title': 'Отключение рекламы', 'amount': 200},
    'premium': {'title': 'Премиум-доступ', 'amount': 500},
}


def clean_secret(value: str | None) -> str:
    value = (value or '').strip()
    return '' if value.lower() in PLACEHOLDERS else value


def reply(status: int, payload: dict) -> dict:
    return {
        'statusCode': status,
        'headers': CORS,
        'body': json.dumps(payload, ensure_ascii=False),
        'isBase64Encoded': False,
    }


def fetch_payment_status(payment_id: str) -> str:
    shop_id = clean_secret(os.environ.get('YOOKASSA_SHOP_ID'))
    secret_key = clean_secret(os.environ.get('YOOKASSA_SECRET_KEY'))

    if not shop_id or not secret_key or not payment_id:
        return 'unknown'

    auth = base64.b64encode(f'{shop_id}:{secret_key}'.encode('utf-8')).decode('ascii')
    req = urllib.request.Request(
        f'{API_URL}/{payment_id}',
        headers={'Authorization': f'Basic {auth}'},
        method='GET',
    )

    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as exc:
        print(f'YooKassa status HTTP {exc.code}: {exc.read().decode("utf-8", "replace")[:300]}')
        return 'unknown'
    except Exception as exc:
        print(f'YooKassa status failed: {exc}')
        return 'unknown'

    if data.get('paid') is True and str(data.get('status')) == 'succeeded':
        return 'succeeded'

    return str(data.get('status') or 'unknown')


def check_order(order_id: str) -> dict:
    if not re.match(r'^game-[a-zA-Z0-9\-]{4,80}$', order_id):
        return reply(400, {'error': 'Некорректный номер заказа'})

    dsn = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA') or 'public'

    if not dsn:
        return reply(503, {'error': 'Хранилище платежей недоступно'})

    safe_order = order_id.replace("'", "''")
    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT product_id, player_id, amount, status, payment_id, delivered_at "
                f"FROM {schema}.game_purchases WHERE order_id = '{safe_order}'"
            )
            row = cur.fetchone()

        if not row:
            return reply(404, {'error': 'Заказ не найден'})

        product_id, player_id, amount, status, payment_id, delivered_at = row

        if status == 'paid':
            return reply(200, {
                'status': 'paid',
                'orderId': order_id,
                'productId': product_id,
                'playerId': player_id,
                'amount': amount,
                'alreadyDelivered': delivered_at is not None,
            })

        if fetch_payment_status(payment_id or '') != 'succeeded':
            return reply(200, {
                'status': 'pending',
                'orderId': order_id,
                'productId': product_id,
                'playerId': player_id,
            })

        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE {schema}.game_purchases SET status = 'paid', delivered_at = now() "
                f"WHERE order_id = '{safe_order}'"
            )
        conn.commit()
    finally:
        conn.close()

    return reply(200, {
        'status': 'paid',
        'orderId': order_id,
        'productId': product_id,
        'playerId': player_id,
        'amount': amount,
        'alreadyDelivered': False,
    })


def handler(event: dict, context) -> dict:
    '''
    Приём оплаты внутриигровых товаров из приложения через ЮKassa и проверка статуса заказа.
    Args: event с httpMethod, body (productId, playerId, email) для покупки либо (orderId) для проверки
    Returns: список товаров, ссылка на оплату или статус заказа
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if method == 'GET':
        items = [{'productId': k, 'title': v['title'], 'amount': v['amount']} for k, v in PRODUCTS.items()]
        return reply(200, {'products': items})

    if method != 'POST':
        return reply(405, {'error': 'Method not allowed'})

    body = json.loads(event.get('body') or '{}')

    notification = body.get('object') or {}
    meta = notification.get('metadata') or {}
    check_id = (body.get('orderId') or meta.get('order_id') or '').strip()

    if check_id:
        return check_order(check_id)

    product_id = (body.get('productId') or '').strip()
    player_id = (body.get('playerId') or '').strip()
    email = (body.get('email') or '').strip()
    return_url = (body.get('returnUrl') or '').strip()

    product = PRODUCTS.get(product_id)
    if not product:
        return reply(400, {'error': 'Неизвестный товар'})

    if not re.match(r'^[A-Za-z0-9_\-]{1,64}$', player_id):
        return reply(400, {'error': 'Некорректный идентификатор игрока'})

    if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
        return reply(400, {'error': 'Проверьте адрес электронной почты'})

    shop_id = clean_secret(os.environ.get('YOOKASSA_SHOP_ID'))
    secret_key = clean_secret(os.environ.get('YOOKASSA_SECRET_KEY'))

    if not shop_id or not secret_key:
        return reply(503, {'error': 'Приём платежей настраивается', 'notConfigured': True})

    amount = product['amount']
    value = f'{amount}.00'
    order_id = f'game-{uuid.uuid4().hex}'
    site_url = return_url.rstrip('/') if return_url.startswith('http') else 'https://fingame-coder.ru'

    payload = {
        'amount': {'value': value, 'currency': 'RUB'},
        'capture': True,
        'confirmation': {
            'type': 'redirect',
            'return_url': f'{site_url}/pay/done?orderId={order_id}',
        },
        'description': f"{product['title']} — FinGame",
        'metadata': {'order_id': order_id, 'product_id': product_id, 'player_id': player_id},
        'receipt': {
            'customer': {'email': email},
            'items': [
                {
                    'description': product['title'],
                    'quantity': '1.00',
                    'amount': {'value': value, 'currency': 'RUB'},
                    'vat_code': 1,
                    'payment_mode': 'full_payment',
                    'payment_subject': 'service',
                }
            ],
        },
    }

    auth = base64.b64encode(f'{shop_id}:{secret_key}'.encode('utf-8')).decode('ascii')
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
        headers={
            'Authorization': f'Basic {auth}',
            'Idempotence-Key': order_id,
            'Content-Type': 'application/json',
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode('utf-8', errors='replace')[:300]
        print(f'YooKassa HTTP {exc.code}: {detail}')
        return reply(502, {'error': 'Платёжный сервис отклонил запрос'})
    except Exception as exc:
        print(f'YooKassa request failed: {exc}')
        return reply(502, {'error': 'Не удалось связаться с платёжным сервисом'})

    payment_url = (data.get('confirmation') or {}).get('confirmation_url')
    payment_id = data.get('id') or ''

    if not payment_url:
        print(f'YooKassa unexpected response: {json.dumps(data)[:300]}')
        return reply(502, {'error': 'Платёжный сервис не вернул ссылку на оплату'})

    dsn = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA') or 'public'

    if dsn:
        safe = lambda s: str(s).replace("'", "''")
        with psycopg2.connect(dsn) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    f"INSERT INTO {schema}.game_purchases "
                    f"(order_id, product_id, player_id, amount, email, status, payment_id) "
                    f"VALUES ('{safe(order_id)}', '{safe(product_id)}', '{safe(player_id)}', "
                    f"{amount}, '{safe(email)}', 'pending', '{safe(payment_id)}') "
                    f"ON CONFLICT (order_id) DO NOTHING"
                )

    return reply(200, {
        'paymentUrl': payment_url,
        'orderId': order_id,
        'amount': amount,
        'title': product['title'],
    })