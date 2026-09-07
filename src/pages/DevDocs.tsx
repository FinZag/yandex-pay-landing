import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Seo from '@/components/Seo';
import Icon from '@/components/ui/icon';
import MailLink from '@/components/MailLink';
import { GAME_PURCHASE_URL, games } from '@/data/company';

type Product = { productId: string; title: string; amount: number; note?: string };

const nav = [
  { href: '#endpoint', label: 'Адрес проверки' },
  { href: '#products', label: 'Коды товаров' },
  { href: '#response', label: 'Пример ответа' },
  { href: '#flow', label: 'Как встроить' },
];

const Code = ({ children }: { children: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="relative mt-3 rounded-md bg-foreground/95 p-4 pr-14">
      <button
        type="button"
        onClick={copy}
        aria-label="Скопировать"
        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 text-background transition-colors hover:bg-background/30"
      >
        <Icon name={copied ? 'Check' : 'Copy'} size={16} />
      </button>
      <pre className="overflow-x-auto text-[13px] leading-[1.6] text-background">
        <code>{children}</code>
      </pre>
    </div>
  );
};

const DevDocsPage = () => {
  const { hash } = useLocation();
  const game = games.find((g) => g.gameId === 'butter-clicker');
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  useEffect(() => {
    let stop = false;
    fetch(`${GAME_PURCHASE_URL}?gameId=butter-clicker`)
      .then((r) => r.json())
      .then((d) => !stop && setProducts(Array.isArray(d.products) ? d.products : []))
      .catch(() => !stop && setProducts([]));
    return () => {
      stop = true;
    };
  }, []);

  const checkExample = `GET ${GAME_PURCHASE_URL}?gameId=butter-clicker&playerId=player-42`;

  const responseExample = `{
  "gameId": "butter-clicker",
  "playerId": "player-42",
  "products": ["coins-medium", "no-ads"],
  "orders": [
    { "orderId": "FG-7C31A9", "productId": "no-ads" },
    { "orderId": "FG-8B04E2", "productId": "coins-medium" }
  ],
  "noAds": true
}`;

  const emptyExample = `{
  "gameId": "butter-clicker",
  "playerId": "player-42",
  "products": [],
  "orders": [],
  "noAds": false
}`;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Инструкция для разработчика — покупки в играх FinGame"
        description="Техническая инструкция: адрес проверки покупок, коды товаров, пример ответа сервера и порядок начисления монет в игре Масло Кликер."
        path="/dev"
      />

      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 md:h-[92px] md:px-[76px]">
          <Link to="/" className="flex items-center gap-2.5" aria-label="FinGame — на главную">
            <img
              src="/logo-mark.jpg"
              alt=""
              className="h-[38px] w-[38px] rounded-[11px] object-cover"
            />
            <span className="font-head text-[24px] font-bold tracking-[-0.02em]">
              Fin<span className="cond">Game</span>
            </span>
          </Link>
          <Link
            to="/games/butter-clicker"
            className="inline-flex h-[46px] items-center gap-2 rounded-[23px] bg-secondary px-5 text-[15px] font-medium transition-colors hover:bg-border"
          >
            <Icon name="ArrowLeft" size={18} />
            Страница игры
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-5 pb-16 pt-6 md:px-[76px] md:pb-24">
        <span className="inline-flex h-8 items-center rounded-full bg-badge px-3.5 text-[13px] font-bold text-badge-foreground">
          Для разработчика
        </span>
        <h1 className="mt-3 font-head text-[30px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[42px]">
          Покупки в игре: подключение
        </h1>
        <p className="mt-3 max-w-[760px] text-[17px] leading-[1.45] text-muted-foreground">
          Покупки оформляются на сайте через ЮKassa. Игре нужно только спросить сервер, что
          у игрока уже оплачено, и выдать это внутри приложения. Никаких ключей и подписей
          не требуется.
        </p>

        <nav className="mt-6 flex flex-wrap gap-2">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="inline-flex h-10 items-center rounded-[20px] bg-secondary px-4 text-[14px] font-medium transition-colors hover:bg-border"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <article className="mt-10 space-y-8">
          <section id="endpoint" className="scroll-mt-28 rounded-lg bg-secondary p-6 md:p-8">
            <h2 className="font-head text-[22px] font-bold tracking-[-0.01em] md:text-[26px]">
              Адрес проверки покупок
            </h2>
            <p className="mt-2 text-[16px] leading-[1.45] text-muted-foreground">
              Один запрос без авторизации. Ответ приходит в формате JSON.
            </p>
            <Code>{checkExample}</Code>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md bg-background px-4 py-3">
                <dt className="text-[14px] text-muted-foreground">Идентификатор игры</dt>
                <dd className="mt-0.5 font-mono text-[15px] font-medium">butter-clicker</dd>
              </div>
              <div className="rounded-md bg-background px-4 py-3">
                <dt className="text-[14px] text-muted-foreground">ID игрока</dt>
                <dd className="mt-0.5 font-mono text-[15px] font-medium">playerId</dd>
              </div>
            </dl>
            <p className="mt-4 flex items-start gap-2.5 text-[15px] leading-[1.45] text-muted-foreground">
              <Icon name="Info" size={18} className="mt-0.5 shrink-0" />
              ID игрока — латиница, цифры, дефис и подчёркивание, до 64 символов. Он показан
              игроку на главном меню игры: именно по нему покупка попадает в профиль.
            </p>
          </section>

          <section id="products" className="scroll-mt-28">
            <h2 className="font-head text-[22px] font-bold tracking-[-0.01em] md:text-[26px]">
              Коды товаров
            </h2>
            <p className="mt-2 text-[16px] leading-[1.45] text-muted-foreground">
              Эти коды приходят в поле <span className="font-mono">products</span>. Список
              загружен с сервера, поэтому здесь всегда актуальные цены.
            </p>

            <div className="mt-4 overflow-x-auto rounded-lg bg-secondary">
              <table className="w-full min-w-[560px] text-left text-[15px]">
                <thead>
                  <tr className="text-[14px] text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Что покупают</th>
                    <th className="px-5 py-3 font-medium">Код товара</th>
                    <th className="px-5 py-3 font-medium">Что выдать в игре</th>
                    <th className="px-5 py-3 text-right font-medium">Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {products === null && (
                    <tr>
                      <td colSpan={4} className="px-5 py-5 text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Icon name="LoaderCircle" size={16} className="animate-spin" />
                          Загружаем список товаров
                        </span>
                      </td>
                    </tr>
                  )}
                  {products?.map((p) => (
                    <tr key={p.productId} className="border-t border-background">
                      <td className="px-5 py-3.5 font-medium">{p.title}</td>
                      <td className="px-5 py-3.5 font-mono text-[14px]">{p.productId}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {p.productId === 'no-ads' ? 'Отключить рекламу навсегда' : p.note}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold">{p.amount} ₽</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="response" className="scroll-mt-28">
            <h2 className="font-head text-[22px] font-bold tracking-[-0.01em] md:text-[26px]">
              Пример ответа сервера
            </h2>
            <p className="mt-2 text-[16px] leading-[1.45] text-muted-foreground">
              Игрок купил отключение рекламы и средний пак монет:
            </p>
            <Code>{responseExample}</Code>

            <p className="mt-6 text-[16px] leading-[1.45] text-muted-foreground">
              Покупок нет — те же поля, но пустые:
            </p>
            <Code>{emptyExample}</Code>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                {
                  field: 'products',
                  text: 'Коды всех оплаченных товаров без повторов. Удобно для рекламы: достаточно проверить наличие кода.',
                },
                {
                  field: 'noAds',
                  text: 'Короткий ответ на главный вопрос: отключать рекламу или нет.',
                },
                {
                  field: 'orders',
                  text: 'Каждая оплата отдельной строкой со своим номером заказа. По нему начисляются монеты.',
                },
                {
                  field: 'orderId',
                  text: 'Номер заказа. Сохраните выданные номера на устройстве, чтобы не начислить пак дважды.',
                },
              ].map((r) => (
                <div key={r.field} className="rounded-lg bg-secondary px-5 py-4">
                  <p className="font-mono text-[14px] font-bold">{r.field}</p>
                  <p className="mt-1 text-[15px] leading-[1.4] text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="flow" className="scroll-mt-28 rounded-lg bg-[linear-gradient(105deg,hsl(var(--banner-from))_0%,hsl(var(--banner-to))_100%)] p-6 md:p-8">
            <h2 className="font-head text-[22px] font-bold tracking-[-0.01em] md:text-[26px]">
              Как встроить в игру
            </h2>
            <ol className="mt-4 space-y-3.5 text-[16px] leading-[1.45]">
              {[
                'Показать ID игрока на главном меню и дать кнопку копирования.',
                'Запрашивать адрес проверки при запуске игры и при возврате из браузера.',
                'Есть код no-ads — отключить рекламу навсегда, сохранив признак на устройстве.',
                'Для монет пройти по orders: начислять пак только для тех номеров заказов, которых ещё нет в локальном списке выданных.',
                'Записать номер заказа в локальный список сразу после начисления.',
              ].map((t, n) => (
                <li key={t} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                    {n + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex items-start gap-2.5 text-[15px] leading-[1.45]">
              <Icon name="TriangleAlert" size={18} className="mt-0.5 shrink-0" />
              Отключение рекламы возвращается в ответе всегда, монеты — тоже. Поэтому монеты
              начисляются строго по номеру заказа, иначе при каждом запуске игрок будет
              получать пак заново.
            </p>
          </section>
        </article>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to={`/games/${game?.slug ?? 'butter-clicker'}`}
            className="inline-flex h-[56px] items-center gap-2.5 rounded-[28px] bg-primary px-[30px] text-[17px] font-bold tracking-[-0.01em] text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Страница игры
            <Icon name="ArrowRight" size={20} />
          </Link>
          <p className="text-[14px] text-muted-foreground">
            Вопросы по подключению — <MailLink subject="Подключение покупок в игре" />
          </p>
        </div>
      </main>
    </div>
  );
};

export default DevDocsPage;
