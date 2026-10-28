type Product = { productId: string; title: string; amount: number; note?: string };

type Params = {
  gameTitle: string;
  gameId: string;
  pageUrl: string;
  products: Product[];
  checkExample: string;
  responseExample: string;
  emptyExample: string;
  steps: string[];
  warning: string;
  responseIntro: string;
};

export const buildDevInstruction = (p: Params) => {
  const rows = p.products.length
    ? p.products
        .map(
          (x) =>
            `| ${x.title} | \`${x.productId}\` | ${x.productId === 'no-ads' ? 'Отключить рекламу навсегда' : x.note || ''} | ${x.amount} ₽ |`,
        )
        .join('\n')
    : '| — | — | Товары пока не заведены | — |';

  return `# ${p.gameTitle}: подключение покупок

Инструкция для разработчика FinGame. Актуальная версия: ${p.pageUrl}

Покупки оформляются на сайте через ЮKassa. Игре нужно только спросить сервер, что у игрока уже оплачено, и выдать это внутри приложения. Никаких ключей и подписей не требуется.

## 1. Адрес проверки покупок

Один запрос без авторизации. Ответ приходит в формате JSON.

\`\`\`
${p.checkExample}
\`\`\`

- Идентификатор игры: \`${p.gameId}\`
- ID игрока: \`playerId\` — латиница, цифры, дефис и подчёркивание, до 64 символов. Он показан игроку на главном меню игры: именно по нему покупка попадает в профиль.

## 2. Коды товаров

Эти коды приходят в поле \`products\`.

| Что покупают | Код товара | Что выдать в игре | Цена |
|---|---|---|---|
${rows}

## 3. Пример ответа сервера

${p.responseIntro}

\`\`\`json
${p.responseExample}
\`\`\`

Покупок нет — те же поля, но пустые:

\`\`\`json
${p.emptyExample}
\`\`\`

- \`products\` — коды всех оплаченных товаров без повторов. Удобно для рекламы: достаточно проверить наличие кода.
- \`noAds\` — короткий ответ на главный вопрос: отключать рекламу или нет.
- \`orders\` — каждая оплата отдельной строкой со своим номером заказа.
- \`orderId\` — номер заказа. Сохраните выданные номера на устройстве, чтобы не выдать товар дважды.

## 4. Как встроить в игру

${p.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

> Важно: ${p.warning}
`;
};

export const downloadTextFile = (fileName: string, content: string) => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
