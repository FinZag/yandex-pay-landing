import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { GAME_PURCHASE_URL } from '@/data/company';
import { reachGoal } from '@/lib/metrika';

const ReleaseNotify = ({ gameId, gameTitle }: { gameId: string; gameTitle: string }) => {
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Укажите корректный e-mail — на него придёт письмо о выходе игры.');
      return;
    }
    if (!agree) {
      setError('Подтвердите согласие на обработку персональных данных.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(GAME_PURCHASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'notify-release', gameId, email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || 'Не удалось сохранить адрес. Попробуйте позже.');
        return;
      }

      reachGoal('release_notify', { gameId });
      setDone(true);
    } catch {
      setError('Нет связи с сервером. Проверьте интернет и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="notify"
      className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24"
    >
      <div className="rounded-lg bg-secondary p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex h-8 items-center gap-2 rounded-full bg-badge px-3.5 text-[13px] font-bold text-badge-foreground">
              <Icon name="Hammer" size={14} />
              Игра в разработке
            </span>
            <h2 className="mt-4 font-head text-[24px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[30px]">
              Сообщить, когда выйдет
            </h2>
            <p className="mt-2 max-w-[520px] text-[16px] leading-[1.45] text-muted-foreground">
              Оставьте почту — напишем один раз, в день выхода «{gameTitle}» в RuStore
              и AppGallery. Никакой рассылки и рекламы.
            </p>
          </div>

          {done ? (
            <div className="rounded-lg bg-background p-6 md:p-8">
              <Icon name="CircleCheck" size={30} className="text-ok" />
              <h3 className="mt-3 font-head text-[20px] font-bold leading-[1.15]">
                Записали вашу почту
              </h3>
              <p className="mt-2 text-[15px] leading-[1.45] text-muted-foreground">
                Как только бокс №6 откроется, письмо придёт на {email}. До встречи в гараже.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-lg bg-background p-6 md:p-8" noValidate>
              <label className="block text-[15px] font-medium" htmlFor="notify-email">
                E-mail
              </label>
              <input
                id="notify-email"
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="you@example.com"
                className="mt-2 h-[52px] w-full rounded-[26px] bg-secondary px-5 text-[16px] outline-none ring-ring/40 placeholder:text-muted-foreground focus:ring-2"
              />

              <label className="mt-4 flex cursor-pointer items-start gap-3 text-[14px] leading-[1.4] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(ev) => setAgree(ev.target.checked)}
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[hsl(var(--primary))]"
                />
                <span>
                  Даю согласие на обработку персональных данных согласно{' '}
                  <Link
                    to="/legal#privacy"
                    className="text-foreground underline underline-offset-2"
                  >
                    политике конфиденциальности
                  </Link>
                  .
                </span>
              </label>

              {error && (
                <p className="mt-4 flex items-start gap-2 text-[14px] text-destructive">
                  <Icon name="TriangleAlert" size={16} className="mt-0.5 shrink-0" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex h-[56px] w-full items-center justify-center gap-2.5 rounded-[28px] bg-primary px-[30px] text-[17px] font-bold tracking-[-0.01em] text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Icon name="LoaderCircle" size={18} className="animate-spin" />
                    Сохраняем
                  </>
                ) : (
                  <>
                    <Icon name="BellRing" size={18} />
                    Сообщить о выходе
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReleaseNotify;
