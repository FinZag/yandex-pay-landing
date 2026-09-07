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

GAMES = {
    'bytetrace': {
        'title': 'ByteTrace',
        'products': {
            'no-ads': {'title': 'Отключение рекламы', 'amount': 199},
        },
    },
    'butter-clicker': {
        'title': 'Масло Кликер: Антистресс ASMR',
        'products': {
            'no-ads': {'title': 'Отключение рекламы', 'amount': 199},
            'coins-small': {'title': 'Маленький пак — 5 000 монет', 'amount': 99},
            'coins-medium': {'title': 'Средний пак — 25 000 монет', 'amount': 349},
            'coins-large': {'title': 'Крупный пак — 100 000 монет', 'amount': 999},
        },
    },
}

DEFAULT_GAME = 'bytetrace'


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
                f"SELECT game_id, product_id, player_id, amount, status, payment_id, delivered_at "
                f"FROM {schema}.game_purchases WHERE order_id = '{safe_order}'"
            )
            row = cur.fetchone()

        if not row:
            return reply(404, {'error': 'Заказ не найден'})

        game_id, product_id, player_id, amount, status, payment_id, delivered_at = row

        if status == 'paid':
            return reply(200, {
                'status': 'paid',
                'orderId': order_id,
                'gameId': game_id,
                'productId': product_id,
                'playerId': player_id,
                'amount': amount,
                'alreadyDelivered': delivered_at is not None,
            })

        if fetch_payment_status(payment_id or '') != 'succeeded':
            return reply(200, {
                'status': 'pending',
                'orderId': order_id,
                'gameId': game_id,
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
        'gameId': game_id,
        'productId': product_id,
        'playerId': player_id,
        'amount': amount,
        'alreadyDelivered': False,
    })


def check_player(game_id: str, player_id: str) -> dict:
    if not re.match(r'^[A-Za-z0-9_\-]{1,64}$', player_id):
        return reply(400, {'error': 'Некорректный идентификатор игрока'})

    game = GAMES.get(game_id)
    if not game:
        return reply(404, {'error': 'Неизвестная игра', 'games': list(GAMES.keys())})

    dsn = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA') or 'public'

    if not dsn:
        return reply(503, {'error': 'Хранилище платежей недоступно'})

    safe_game = game_id.replace("'", "''")
    safe_player = player_id.replace("'", "''")

    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT order_id, payment_id FROM {schema}.game_purchases "
                f"WHERE game_id = '{safe_game}' AND player_id = '{safe_player}' "
                f"AND status = 'pending'"
            )
            pending = cur.fetchall()

        for order_id, payment_id in pending:
            if fetch_payment_status(payment_id or '') == 'succeeded':
                safe_order = order_id.replace("'", "''")
                with conn.cursor() as cur:
                    cur.execute(
                        f"UPDATE {schema}.game_purchases SET status = 'paid', "
                        f"delivered_at = COALESCE(delivered_at, now()) "
                        f"WHERE order_id = '{safe_order}'"
                    )
                conn.commit()

        with conn.cursor() as cur:
            cur.execute(
                f"SELECT DISTINCT product_id FROM {schema}.game_purchases "
                f"WHERE game_id = '{safe_game}' AND player_id = '{safe_player}' "
                f"AND status = 'paid'"
            )
            owned = sorted({r[0] for r in cur.fetchall()})
    finally:
        conn.close()

    return reply(200, {
        'gameId': game_id,
        'playerId': player_id,
        'products': owned,
        'noAds': 'no-ads' in owned,
    })


def handler(event: dict, context) -> dict:
    '''
    Приём оплаты внутриигровых товаров из приложения через ЮKassa и проверка статуса заказа.
    Args: event с httpMethod, body (productId, playerId, email) для покупки, (orderId) для статуса заказа
          либо GET с playerId для списка купленных товаров игрока
    Returns: список товаров, ссылка на оплату, статус заказа или покупки игрока
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        game_id = (params.get('gameId') or DEFAULT_GAME).strip().lower()
        player_id = (params.get('playerId') or '').strip()

        if player_id:
            return check_player(game_id, player_id)

        game = GAMES.get(game_id)

        if not game:
            return reply(404, {'error': 'Неизвестная игра', 'games': list(GAMES.keys())})

        items = [
            {'productId': k, 'title': v['title'], 'amount': v['amount']}
            for k, v in game['products'].items()
        ]
        return reply(200, {'gameId': game_id, 'game': game['title'], 'products': items})

    if method != 'POST':
        return reply(405, {'error': 'Method not allowed'})

    body = json.loads(event.get('body') or '{}')

    notification = body.get('object') or {}
    meta = notification.get('metadata') or {}
    check_id = (body.get('orderId') or meta.get('order_id') or '').strip()

    if check_id:
        return check_order(check_id)

    if body.get('action') == 'purchases':
        return check_player(
            (body.get('gameId') or DEFAULT_GAME).strip().lower(),
            (body.get('playerId') or '').strip(),
        )

    game_id = (body.get('gameId') or DEFAULT_GAME).strip().lower()
    product_id = (body.get('productId') or '').strip()
    player_id = (body.get('playerId') or '').strip()
    email = (body.get('email') or '').strip()
    return_url = (body.get('returnUrl') or '').strip()

    game = GAMES.get(game_id)
    if not game:
        return reply(400, {'error': 'Неизвестная игра', 'games': list(GAMES.keys())})

    product = game['products'].get(product_id)
    if not product:
        return reply(400, {
            'error': 'Неизвестный товар',
            'products': list(game['products'].keys()),
        })

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
        'description': f"{product['title']} — {game['title']}",
        'metadata': {
            'order_id': order_id,
            'game_id': game_id,
            'product_id': product_id,
            'player_id': player_id,
        },
        'receipt': {
            'customer': {'email': email},
            'items': [
                {
                    'description': f"{product['title']} — {game['title']}",
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
                    f"(order_id, game_id, product_id, player_id, amount, email, status, payment_id) "
                    f"VALUES ('{safe(order_id)}', '{safe(game_id)}', '{safe(product_id)}', '{safe(player_id)}', "
                    f"{amount}, '{safe(email)}', 'pending', '{safe(payment_id)}') "
                    f"ON CONFLICT (order_id) DO NOTHING"
                )

    return reply(200, {
        'paymentUrl': payment_url,
        'orderId': order_id,
        'gameId': game_id,
        'productId': product_id,
        'amount': amount,
        'title': product['title'],
    })