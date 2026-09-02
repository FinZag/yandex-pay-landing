import base64
import json
import os
import re
import smtplib
import urllib.request
import urllib.error
from email.mime.text import MIMEText
from email.header import Header

import psycopg2

API_URL = 'https://api.yookassa.ru/v3/payments'
MAILBOX = 'game-fin-ip@yandex.ru'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}


def reply(status: int, payload: dict) -> dict:
    return {
        'statusCode': status,
        'headers': CORS,
        'body': json.dumps(payload, ensure_ascii=False),
        'isBase64Encoded': False,
    }


PLACEHOLDERS = {'placeholder', 'changeme', 'todo', 'test', 'xxx', 'none', '-'}


def clean_secret(value: str | None) -> str:
    value = (value or '').strip()
    return '' if value.lower() in PLACEHOLDERS else value


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


def send_email(amount: int, email: str, order_id: str) -> None:
    password = clean_secret(os.environ.get('YANDEX_MAIL_APP_PASSWORD'))
    if not password:
        print('Mail password missing, notification skipped')
        return

    text = (
        f'Поступил добровольный взнос на разработку.\n\n'
        f'Сумма: {amount} руб.\n'
        f'E-mail плательщика: {email}\n'
        f'Номер платежа: {order_id}\n'
    )

    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = Header(f'Взнос {amount} \u20bd — FinGame', 'utf-8')
    msg['From'] = MAILBOX
    msg['To'] = MAILBOX
    msg['Reply-To'] = email

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465, timeout=10) as smtp:
        smtp.login(MAILBOX, password)
        smtp.sendmail(MAILBOX, [MAILBOX], msg.as_string())


def handler(event: dict, context) -> dict:
    '''
    Проверяет статус платежа в ЮKassa и отправляет уведомление о взносе на почту студии.
    Args: event с httpMethod, body (orderId); context с request_id
    Returns: HTTP-ответ со статусом платежа
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if method != 'POST':
        return reply(405, {'error': 'Method not allowed'})

    body = json.loads(event.get('body') or '{}')
    notification = (body.get('object') or {})
    meta = notification.get('metadata') or {}
    order_id = (body.get('orderId') or meta.get('order_id') or '').strip()

    if not re.match(r'^donation-[a-zA-Z0-9\-]{4,80}$', order_id):
        return reply(400, {'error': 'Некорректный номер платежа'})

    dsn = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA') or 'public'

    if not dsn:
        return reply(503, {'error': 'Хранилище платежей недоступно'})

    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT amount, email, status, notified_at, payment_id "
                f"FROM {schema}.donations WHERE order_id = '{order_id}'"
            )
            row = cur.fetchone()

        if not row:
            return reply(404, {'error': 'Платёж не найден'})

        amount, email, status, notified_at, payment_id = row

        if notified_at is not None:
            return reply(200, {'status': 'paid', 'amount': amount, 'alreadyNotified': True})

        pay_status = fetch_payment_status(payment_id or '')

        if pay_status != 'succeeded':
            print(f'Order {order_id} not paid yet: {pay_status}')
            return reply(200, {'status': 'pending', 'amount': amount})

        send_email(amount, email, order_id)

        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE {schema}.donations SET status = 'paid', notified_at = now() "
                f"WHERE order_id = '{order_id}'"
            )
        conn.commit()
    finally:
        conn.close()

    return reply(200, {'status': 'paid', 'amount': amount})
