import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';
import MailLink from '@/components/MailLink';
import { PAYMENT_CONFIRM_URL, company, games } from '@/data/company';

const ThankYou = () => {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const game = games[0];

  useEffect(() => {
    if (!orderId) return;
    fetch(PAYMENT_CONFIRM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    }).catch(() => undefined);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1280px] px-5 pt-2 md:px-[76px]">
        <section className="flex animate-rise flex-col overflow-hidden rounded-lg bg-[linear-gradient(105deg,hsl(var(--banner-from))_0%,hsl(var(--banner-from))_42%,hsl(var(--banner-to))_100%)] px-6 py-10 md:px-10 md:py-[46px]">
          <span className="inline-flex h-8 w-fit items-center gap-2 rounded-full bg-badge px-3.5 text-[13px] font-bold text-badge-foreground">
            <Icon name="Check" size={15} />
            Платёж принят
          </span>

          <h1 className="mt-6 max-w-[18ch] font-head text-[30px] font-bold leading-[1.08] tracking-[-0.025em] md:text-[34px]">
            Спасибо за поддержку!
          </h1>

          <p className="mt-4 max-w-[46ch] text-[17px] font-medium leading-[1.4] text-muted-foreground">
            Взнос получен и пойдёт на разработку игр {company.brand}: новые уровни, исправление
            ошибок и оплату аккаунтов разработчика. Чек придёт на указанную почту в течение 15
            минут.
          </p>

          {orderId && (
            <p className="mt-4 text-[14px] text-muted-foreground">
              Номер платежа: <span className="font-mono text-foreground">{orderId}</span>
            </p>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex h-[56px] items-center gap-2.5 rounded-[28px] bg-primary px-[30px] text-[17px] font-bold tracking-[-0.01em] text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              <Icon name="ArrowLeft" size={18} />
              На главную
            </Link>
            {game?.rustore && (
              <a
                href={game.rustore}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[56px] items-center gap-2.5 rounded-[28px] bg-background px-[30px] text-[17px] font-bold tracking-[-0.01em] text-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
              >
                <Icon name="Download" size={18} />
                {game.title} в RuStore
              </a>
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-3 pb-4 sm:grid-cols-3">
          {[
            {
              icon: 'Receipt',
              title: 'Чек об оплате',
              text: 'Придёт на почту, которую вы указали при переводе. Если через 15 минут его нет — проверьте папку «Спам».',
            },
            {
              icon: 'ShieldCheck',
              title: 'Данные карты в безопасности',
              text: 'Реквизиты карты вводятся на стороне Яндекс Пэй, сайт их не получает и не хранит.',
            },
            {
              icon: 'CalendarOff',
              title: 'Без автосписаний',
              text: 'Это разовый взнос. Подписка не оформляется, повторный платёж возможен только по вашей инициативе.',
            },
          ].map((c) => (
            <div key={c.title} className="rounded-lg bg-secondary p-5 md:p-6">
              <Icon name={c.icon} size={22} />
              <h2 className="mt-3 font-head text-[17px] font-bold">{c.title}</h2>
              <p className="mt-1 text-[15px] leading-[1.45] text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>

        <p className="pb-4 text-[15px] leading-[1.45] text-muted-foreground">
          Возникли вопросы по платежу? Напишите на <MailLink subject="Вопрос по платежу" /> —{' '}
          {company.answerTime.toLowerCase()}.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
