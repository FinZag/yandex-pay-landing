import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GAME_PURCHASE_URL } from '@/data/company';

type Product = { productId: string; title: string; amount: number; note?: string };
type Owned = { products: string[]; orders: { orderId: string; productId: string }[]; noAds: boolean };

const DEV_KEY = 'fingame-dev-access';

const TestPurchase = ({ gameId, products }: { gameId: string; products: Product[] }) => {
  const [playerId, setPlayerId] = useState('test-player');
  const [productId, setProductId] = useState('');
  const [busy, setBusy] = useState<'buy' | 'check' | 'clear' | null>(null);
  const [owned, setOwned] = useState<Owned | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const code = typeof window === 'undefined' ? '' : localStorage.getItem(DEV_KEY) || '';
  const selected = productId || products[0]?.productId || '';
  const validPlayer = /^[A-Za-z0-9_-]{1,64}$/.test(playerId.trim());

  const call = async (body: Record<string, string>) => {
    const res = await fetch(GAME_PURCHASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, playerId: playerId.trim(), code, ...body }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
    return data;
  };

  const run = async (mode: 'buy' | 'check' | 'clear') => {
    setBusy(mode);
    setError(null);
    setResult(null);
    try {
      if (mode === 'buy') {
        const data = await call({ action: 'test-purchase', productId: selected });
        const title = products.find((p) => p.productId === selected)?.title ?? selected;
        setResult(`Тестовая покупка «${title}» выдана. Заказ ${data.orderId}`);
      }
      if (mode === 'clear') {
        const data = await call({ action: 'test-clear' });
        setResult(`Удалено тестовых покупок: ${data.removed}`);
      }
      setOwned(await call({ action: 'purchases' }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Нет связи с сервером.');
    } finally {
      setBusy(null);
    }
  };

  const titleOf = (id: string) => products.find((p) => p.productId === id)?.title ?? id;

  return (
    <section id="test-purchase" className="scroll-mt-28 rounded-lg bg-secondary p-6 md:p-8">
      <h2 className="font-head text-[22px] font-bold tracking-[-0.01em] md:text-[26px]">
        Тестовая покупка
      </h2>
      <p className="mt-2 text-[16px] leading-[1.45] text-muted-foreground">
        Выдаёт товар игроку без оплаты — так же, как после настоящей покупки. Запустите игру с
        этим ID игрока и проверьте, что отключилась реклама или начислилась валюта. Деньги не
        списываются, в отчётах ЮKassa такие заказы не появляются.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-[15px] font-medium" htmlFor="tp-player">
            ID игрока
          </label>
          <input
            id="tp-player"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            placeholder="ID с главного меню игры"
            className="mt-2 h-[52px] w-full rounded-[26px] bg-background px-5 font-mono text-[15px] outline-none ring-ring/40 placeholder:font-sans placeholder:text-muted-foreground focus:ring-2"
          />
        </div>
        <div>
          <label className="block text-[15px] font-medium" htmlFor="tp-product">
            Товар
          </label>
          <select
            id="tp-product"
            value={selected}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-2 h-[52px] w-full rounded-[26px] bg-background px-5 text-[15px] outline-none ring-ring/40 focus:ring-2"
          >
            {products.map((p) => (
              <option key={p.productId} value={p.productId}>
                {p.title}
                {p.note ? ` — ${p.note}` : ''} ({p.amount} ₽)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy !== null || !validPlayer || !selected}
          onClick={() => run('buy')}
          className="inline-flex h-[52px] items-center gap-2 rounded-[26px] bg-primary px-6 text-[16px] font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-50"
        >
          <Icon name={busy === 'buy' ? 'LoaderCircle' : 'FlaskConical'} size={17} className={busy === 'buy' ? 'animate-spin' : ''} />
          Выдать тестовую покупку
        </button>
        <button
          type="button"
          disabled={busy !== null || !validPlayer}
          onClick={() => run('check')}
          className="inline-flex h-[52px] items-center gap-2 rounded-[26px] bg-background px-6 text-[16px] font-medium transition-colors hover:bg-border disabled:pointer-events-none disabled:opacity-50"
        >
          <Icon name={busy === 'check' ? 'LoaderCircle' : 'Search'} size={17} className={busy === 'check' ? 'animate-spin' : ''} />
          Что видит игра
        </button>
        <button
          type="button"
          disabled={busy !== null || !validPlayer}
          onClick={() => run('clear')}
          className="inline-flex h-[52px] items-center gap-2 rounded-[26px] bg-background px-6 text-[16px] font-medium text-destructive transition-colors hover:bg-border disabled:pointer-events-none disabled:opacity-50"
        >
          <Icon name={busy === 'clear' ? 'LoaderCircle' : 'Trash2'} size={17} className={busy === 'clear' ? 'animate-spin' : ''} />
          Удалить тестовые
        </button>
      </div>

      {!validPlayer && playerId && (
        <p className="mt-3 text-[14px] text-muted-foreground">
          ID игрока: латиница, цифры, дефис и подчёркивание.
        </p>
      )}

      {error && (
        <p className="mt-5 flex items-start gap-2 text-[15px] text-destructive">
          <Icon name="TriangleAlert" size={17} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      {result && (
        <p className="mt-5 flex items-start gap-2 text-[15px] text-ok">
          <Icon name="CircleCheck" size={17} className="mt-0.5 shrink-0" />
          {result}
        </p>
      )}

      {owned && (
        <div className="mt-5 rounded-lg bg-background p-5">
          <p className="text-[15px] font-medium">
            Ответ сервера для игрока <span className="font-mono">{playerId.trim()}</span>
          </p>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Реклама: {owned.noAds ? 'отключена' : 'показывается'}
          </p>
          {owned.orders.length === 0 ? (
            <p className="mt-2 text-[15px] text-muted-foreground">Покупок нет.</p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {owned.orders.map((o) => (
                <li key={o.orderId} className="flex flex-wrap items-center gap-x-3 text-[15px]">
                  <span className="font-medium">{titleOf(o.productId)}</span>
                  <span className="font-mono text-[13px] text-muted-foreground">{o.orderId}</span>
                  {o.orderId.startsWith('game-test-') && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[12px]">тест</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};

export default TestPurchase;
