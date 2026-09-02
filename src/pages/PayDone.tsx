import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '@/components/Seo';
import Icon from '@/components/ui/icon';
import { GAME_PURCHASE_URL } from '@/data/company';

type State = 'checking' | 'paid' | 'pending' | 'error';

const PayDone = () => {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [state, setState] = useState<State>('checking');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!orderId) {
      setState('error');
      return;
    }

    let stop = false;
    let attempts = 0;

    const check = async () => {
      attempts += 1;
      try {
        const res = await fetch(GAME_PURCHASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });
        const data = await res.json();
        if (stop) return;

        if (data.status === 'paid') {
          setTitle(data.productId || '');
          setState('paid');
          return;
        }
        if (!res.ok) {
          setState('error');
          return;
        }
        if (attempts < 10) {
          setTimeout(check, 2000);
        } else {
          setState('pending');
        }
      } catch {
        if (!stop) setState('error');
      }
    };

    check();
    return () => {
      stop = true;
    };
  }, [orderId]);

  const view = {
    checking: {
      icon: 'LoaderCircle',
      spin: true,
      head: 'Проверяем оплату',
      text: 'Это займёт несколько секунд. Не закрывайте страницу.',
    },
    paid: {
      icon: 'CircleCheck',
      spin: false,
      head: 'Оплата прошла',
      text: 'Покупка зачислена. Вернитесь в игру — товар уже доступен.',
    },
    pending: {
      icon: 'Clock',
      spin: false,
      head: 'Платёж обрабатывается',
      text: 'Банк ещё не подтвердил оплату. Товар появится в игре автоматически в течение нескольких минут.',
    },
    error: {
      icon: 'TriangleAlert',
      spin: false,
      head: 'Не удалось проверить платёж',
      text: 'Вернитесь в игру и откройте магазин — статус обновится сам. Если деньги списаны, а товара нет, напишите нам.',
    },
  }[state];

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5">
      <Seo title="Оплата — FinGame" description="Статус оплаты покупки." path="/pay/done" noindex />
      <div className="w-full max-w-[420px] rounded-lg bg-secondary p-7 text-center">
        <Icon
          name={view.icon}
          size={40}
          className={`mx-auto ${view.spin ? 'animate-spin' : ''} ${
            state === 'paid' ? 'text-ok' : state === 'error' ? 'text-destructive' : ''
          }`}
        />
        <h1 className="mt-4 font-head text-[22px] font-bold leading-[1.15]">{view.head}</h1>
        <p className="mt-2 text-[15px] leading-[1.45] text-muted-foreground">{view.text}</p>
        {title && <p className="mt-3 text-[14px] text-muted-foreground">Товар: {title}</p>}
        {orderId && (
          <p className="mt-4 break-all text-[12px] text-muted-foreground">Заказ: {orderId}</p>
        )}
      </div>
    </div>
  );
};

export default PayDone;
