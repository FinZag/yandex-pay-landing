import json
import os
import time

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store',
}

PLACEHOLDERS = {'placeholder', 'changeme', 'todo', 'test', 'xxx', 'none', '-'}


def configured(name: str) -> bool:
    value = (os.environ.get(name) or '').strip()
    return bool(value) and value.lower() not in PLACEHOLDERS


def handler(event: dict, context) -> dict:
    '''
    Проверка доступности сервера и готовности платёжного шлюза для игрового приложения.
    Args: event с httpMethod, queryStringParameters (format=json для подробного ответа)
    Returns: текст OK либо JSON со статусом сервиса
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    params = event.get('queryStringParameters') or {}

    if str(params.get('format') or '').lower() == 'json':
        payload = {
            'status': 'ok',
            'payments': configured('YOOKASSA_SHOP_ID') and configured('YOOKASSA_SECRET_KEY'),
            'time': int(time.time()),
        }
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps(payload),
            'isBase64Encoded': False,
        }

    return {
        'statusCode': 200,
        'headers': {**CORS, 'Content-Type': 'text/plain; charset=utf-8'},
        'body': 'OK',
        'isBase64Encoded': False,
    }
