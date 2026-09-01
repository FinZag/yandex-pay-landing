import json
import os
import re
import smtplib
from email.mime.text import MIMEText
from email.header import Header


def handler(event: dict, context) -> dict:
    '''
    Принимает заявку с формы обратной связи и отправляет её на почту студии.
    Args: event с httpMethod, body (name, email, message); context с request_id
    Returns: HTTP-ответ со статусом отправки
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': cors,
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False,
        }

    body = json.loads(event.get('body') or '{}')
    name = (body.get('name') or '').strip()
    email = (body.get('email') or '').strip()
    message = (body.get('message') or '').strip()

    if not name or not email or not message:
        return {
            'statusCode': 400,
            'headers': cors,
            'body': json.dumps({'error': 'Заполните имя, почту и сообщение'}),
            'isBase64Encoded': False,
        }

    if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
        return {
            'statusCode': 400,
            'headers': cors,
            'body': json.dumps({'error': 'Проверьте адрес электронной почты'}),
            'isBase64Encoded': False,
        }

    if len(message) > 4000 or len(name) > 200:
        return {
            'statusCode': 400,
            'headers': cors,
            'body': json.dumps({'error': 'Слишком длинное сообщение'}),
            'isBase64Encoded': False,
        }

    mailbox = 'game-fin-ip@yandex.ru'
    password = os.environ.get('YANDEX_MAIL_APP_PASSWORD')

    if not password:
        return {
            'statusCode': 503,
            'headers': cors,
            'body': json.dumps({'error': 'Почта пока не подключена'}),
            'isBase64Encoded': False,
        }

    text = f'Имя: {name}\nПочта: {email}\n\nСообщение:\n{message}'
    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = Header(f'Обращение с сайта FinGame — {name}', 'utf-8')
    msg['From'] = mailbox
    msg['To'] = mailbox
    msg['Reply-To'] = email

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465, timeout=10) as smtp:
        smtp.login(mailbox, password)
        smtp.sendmail(mailbox, [mailbox], msg.as_string())

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'ok': True}),
        'isBase64Encoded': False,
    }
