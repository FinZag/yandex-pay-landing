import json
import os
import re
import urllib.request
import urllib.error

SANDBOX_URL = 'https://sandbox.pay.yandex.ru/api/merchant/v1/orders'
PRODUCTION_URL = 'https://pay.yandex.ru/api/merchant/v1/orders'

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


def handler(event: dict, context) -> dict:
    '''
    Создаёт заказ на добровольный взнос в Яндекс Пэй и возвращает ссылку на оплату.
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

    api_key = os.environ.get('YANDEX_PAY_API_KEY')
    merchant_id = os.environ.get('YANDEX_PAY_MERCHANT_ID')

    if not api_key or not merchant_id:
        return reply(503, {'error': 'Приём оплаты пока не подключён'})

    env = (os.environ.get('YANDEX_PAY_ENV') or 'sandbox').strip().lower()
    api_url = PRODUCTION_URL if env == 'production' else SANDBOX_URL

    request_id = getattr(context, 'request_id', '') or 'order'
    order_id = f'donation-{request_id}'

    site_url = return_url.rstrip('/') if return_url.startswith('http') else 'https://fingame.ru'

    payload = {
        'availablePaymentMethods': ['CARD', 'SPLIT'],
        'cart': {
            'externalId': order_id,
            'items': [
                {
                    'productId': 'donation',
                    'title': 'Добровольный взнос на разработку игр FinGame',
                    'quantity': {'count': '1'},
                    'total': str(amount),
                    'unitPrice': str(amount),
                }
            ],
            'total': {'amount': str(amount)},
        },
        'currencyCode': 'RUB',
        'orderId': order_id,
        'orderSource': 'WEBSITE',
        'redirectUrls': {
            'onError': f'{site_url}/#payment',
            'onAbort': f'{site_url}/#payment',
            'onSuccess': f'{site_url}/thanks?orderId={order_id}',
        },
        'merchantId': merchant_id,
        'metadata': json.dumps({'email': email}, ensure_ascii=False),
    }

    req = urllib.request.Request(
        api_url,
        data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
        headers={
            'Authorization': f'Api-Key {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode('utf-8', errors='replace')[:500]
        print(f'YandexPay HTTP {exc.code}: {detail}')
        return reply(502, {'error': 'Платёжный сервис отклонил запрос. Попробуйте позже.'})
    except Exception as exc:
        print(f'YandexPay request failed: {exc}')
        return reply(502, {'error': 'Не удалось связаться с платёжным сервисом.'})

    payment_url = (data.get('data') or {}).get('paymentUrl')

    if not payment_url:
        print(f'YandexPay unexpected response: {json.dumps(data)[:500]}')
        return reply(502, {'error': 'Платёжный сервис не вернул ссылку на оплату.'})

    return reply(200, {'paymentUrl': payment_url, 'orderId': order_id, 'sandbox': env != 'production'})