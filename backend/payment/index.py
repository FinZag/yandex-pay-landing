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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}


PLACEHOLDERS = {'placeholder', 'changeme', 'todo', 'test', 'xxx', 'none', '-'}


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


def handler(event: dict, context) -> dict:
    '''
    Создаёт платёж на добровольный взнос в ЮKassa и возвращает ссылку на оплату.
    Args: event с httpMethod, body (amount, email, returnUrl); context с request_id
    Returns: HTTP-ответ со ссылкой на оплату либо описанием ошибки
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if method != 'POST':
        return reply(405, {'error': 'Method not allowed'})

    body = json.loads(event.get('body') or '{}')
    amount = body.get('amount')
    email = (body.get('email') or '').strip()
    return_url = (body.get('returnUrl') or '').strip()

    try:
        amount = int(amount)
    except (TypeError, ValueError):
        return reply(400, {'error': 'Укажите сумму взноса'})

    if amount < 100 or amount > 300000:
        return reply(400, {'error': 'Сумма взноса — от 100 до 300 000 рублей'})

    if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
        return reply(400, {'error': 'Проверьте адрес электронной почты'})

    shop_id = clean_secret(os.environ.get('YOOKASSA_SHOP_ID'))
    secret_key = clean_secret(os.environ.get('YOOKASSA_SECRET_KEY'))

    if not shop_id or not secret_key:
        return reply(503, {
            'error': 'Приём взносов сейчас настраивается — магазин проходит регистрацию в ЮKassa. '
                     'Напишите нам, и мы сообщим, когда оплата заработает.',
            'notConfigured': True,
        })

    order_id = f'donation-{uuid.uuid4().hex}'
    site_url = return_url.rstrip('/') if return_url.startswith('http') else 'https://fingame-coder.ru'
    value = f'{amount}.00'

    payload = {
        'amount': {'value': value, 'currency': 'RUB'},
        'capture': True,
        'confirmation': {
            'type': 'redirect',
            'return_url': f'{site_url}/thanks?orderId={order_id}',
        },
        'description': f'Добровольный взнос на разработку игр FinGame ({amount} руб.)',
        'metadata': {'order_id': order_id, 'email': email},
        'receipt': {
            'customer': {'email': email},
            'items': [
                {
                    'description': 'Добровольный взнос на разработку игр FinGame',
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
        detail = exc.read().decode('utf-8', errors='replace')[:500]
        print(f'YooKassa HTTP {exc.code}: {detail}')
        return reply(502, {'error': 'Платёжный сервис отклонил запрос. Попробуйте позже.', 'debug': detail, 'code': exc.code})
    except Exception as exc:
        print(f'YooKassa request failed: {exc}')
        return reply(502, {'error': 'Не удалось связаться с платёжным сервисом.'})

    payment_url = (data.get('confirmation') or {}).get('confirmation_url')
    payment_id = data.get('id') or ''
    test_mode = not bool(data.get('test') is False)

    if not payment_url:
        print(f'YooKassa unexpected response: {json.dumps(data)[:500]}')
        return reply(502, {'error': 'Платёжный сервис не вернул ссылку на оплату.'})

    dsn = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA') or 'public'

    if dsn:
        safe_email = email.replace("'", "''")
        safe_payment = payment_id.replace("'", "''")
        with psycopg2.connect(dsn) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    f"INSERT INTO {schema}.donations (order_id, amount, email, status, payment_id) "
                    f"VALUES ('{order_id}', {amount}, '{safe_email}', 'pending', '{safe_payment}') "
                    f"ON CONFLICT (order_id) DO NOTHING"
                )

    return reply(200, {'paymentUrl': payment_url, 'orderId': order_id, 'sandbox': test_mode})