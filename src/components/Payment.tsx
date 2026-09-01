import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import MailLink from '@/components/MailLink';
import { PAYMENT_URL } from '@/data/company';
import { useToast } from '@/hooks/use-toast';

const presets = [100, 300, 500, 1000];

const Payment = () => {
  const [support, setSupport] = useState<number | null>(300);
  const [custom, setCustom] = useState('');
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const total = useMemo(() => {
    if (custom.trim()) {
      const n = Number(custom.replace(/[^\d]/g, ''));
      return Number.isFinite(n) ? n : 0;
    }
    return support ?? 0;
  }, [custom, support]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (total < 100) {
      setError('Минимальная сумма поддержки — 100 ₽.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Укажите корректный e-mail — на него придёт чек.');
      return;
    }
    if (!agree) {
      setError('Подтвердите согласие с офертой и политикой конфиденциальности.');
      return;
    }
    setError(null);
    setNotConfigured(false);
    setLoading(true);

    try {
      const res = await fetch(PAYMENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          email: email.trim(),
          returnUrl: window.location.origin,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.paymentUrl) {
        setError(data.error || 'Не удалось создать платёж. Попробуйте позже.');
        setNotConfigured(Boolean(data.notConfigured));
        return;
      }

      toast({
        title: 'Переходим к оплате',
        description: `Сумма ${total.toLocaleString('ru-RU')} ₽. Открывается защищённая страница Яндекс Пэй.`,
      });
      window.location.href = data.paymentUrl;
    } catch {
      setError('Нет связи с платёжным сервисом. Проверьте интернет и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="payment" className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
      <div className="flex items-baseline justify-between">
        <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
          Поддержать студию
        </h2>
        <span className="text-[15px] text-muted-foreground">Картой или через Яндекс Пэй</span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <form onSubmit={submit} className="rounded-lg bg-secondary p-6 md:p-8" noValidate>
          <h3 className="font-head text-[18px] font-bold">Добровольный взнос на разработку</h3>
          <p className="mt-1 text-[15px] leading-[1.35] text-muted-foreground">
            Игры доступны для бесплатного скачивания в RuStore. Взнос — по желанию, без подписки
            и автосписаний. Минимум 100 ₽.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setSupport(support === p ? null : p);
                  setCustom('');
                }}
                className={`h-11 rounded-[22px] px-5 text-[15px] font-medium transition-colors ${
                  support === p && !custom
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-foreground hover:bg-border'
                }`}
              >
                {p} ₽
              </button>
            ))}
            <input
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="Своя сумма"
              aria-label="Своя сумма поддержки"
              className="h-11 w-[140px] rounded-[22px] bg-background px-5 text-[15px] outline-none ring-ring/40 placeholder:text-muted-foreground focus:ring-2"
            />
          </div>

          <label className="mt-7 block text-[15px] font-medium" htmlFor="pay-email">
            E-mail для чека
          </label>
          <input
            id="pay-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 h-[52px] w-full rounded-[26px] bg-background px-5 text-[16px] outline-none ring-ring/40 placeholder:text-muted-foreground focus:ring-2"
          />

          <label className="mt-4 flex cursor-pointer items-start gap-3 text-[14px] leading-[1.4] text-muted-foreground">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[hsl(var(--primary))]"
            />
            <span>
              Согласен с{' '}
              <a href="#legal" className="text-foreground underline underline-offset-2">
                договором оферты
              </a>{' '}
              и{' '}
              <a href="#legal" className="text-foreground underline underline-offset-2">
                политикой конфиденциальности
              </a>
              , даю согласие на обработку персональных данных.
            </span>
          </label>

          {error && (
            <p
              className={`mt-4 flex items-start gap-2 text-[14px] ${
                notConfigured ? 'text-muted-foreground' : 'text-destructive'
              }`}
            >
              <Icon
                name={notConfigured ? 'Info' : 'TriangleAlert'}
                size={16}
                className="mt-0.5 shrink-0"
              />
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <span className="font-head text-[24px] font-bold">
              Итого: {total.toLocaleString('ru-RU')} ₽
            </span>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-[56px] items-center gap-2.5 rounded-[28px] bg-primary px-[30px] text-[17px] font-bold tracking-[-0.01em] text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Icon name="LoaderCircle" size={18} className="animate-spin" />
                  Создаём платёж
                </>
              ) : (
                <>
                  Оплатить <span className="cond">Пэй</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-lg bg-[linear-gradient(105deg,hsl(var(--banner-from))_0%,hsl(var(--banner-to))_100%)] p-6 md:p-8">
            <span className="inline-flex h-8 items-center rounded-full bg-badge px-3.5 text-[13px] font-bold text-badge-foreground">
              Яндекс Пэй
            </span>
            <h3 className="mt-4 font-head text-[20px] font-bold leading-[1.15] tracking-[-0.02em]">
              Как проходит оплата
            </h3>
            <ol className="mt-4 space-y-3 text-[15px] leading-[1.4]">
              {[
                'Выбираете сумму поддержки и указываете e-mail.',
                'Нажимаете «Оплатить» — открывается защищённая форма Яндекс Пэй.',
                'Платите картой, СБП или балансом Яндекс Пэй. Данные карты остаются у банка.',
                'Чек приходит на e-mail в течение 15 минут.',
              ].map((t, n) => (
                <li key={t} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                    {n + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg bg-secondary p-6 md:p-8">
            <h3 className="font-head text-[18px] font-bold">Условия оплаты и возврата</h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-[1.4] text-muted-foreground">
              <li className="flex gap-2.5">
                <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-ok" />
                Скачивание игр бесплатно — сайт не продаёт товары, взнос является добровольным.
              </li>
              <li className="flex gap-2.5">
                <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-ok" />
                Валюта расчётов — российский рубль. Сумму плательщик определяет сам.
              </li>
              <li className="flex gap-2.5">
                <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-ok" />
                Ошибочный платёж возвращается в течение 14 дней по заявке на{' '}
                <MailLink subject="Заявление на возврат платежа" />, срок
                зачисления — 3–10 рабочих дней.
              </li>
              <li className="flex gap-2.5">
                <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-ok" />
                Подписки и регулярные списания не оформляются.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;