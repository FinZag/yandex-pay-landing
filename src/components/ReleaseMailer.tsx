import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { GAME_PURCHASE_URL } from '@/data/company';

type Stats = { total: number; notified: number; pending: number };

const DEV_KEY = 'fingame-dev-access';

const ReleaseMailer = ({
  gameId,
  gameTitle,
  gameSlug,
}: {
  gameId: string;
  gameTitle: string;
  gameSlug: string;
}) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [subject, setSubject] = useState(`${gameTitle} — игра вышла`);
  const [message, setMessage] = useState('');
  const [testTo, setTestTo] = useState('');
  const [busy, setBusy] = useState<'test' | 'all' | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const code = typeof window === 'undefined' ? '' : localStorage.getItem(DEV_KEY) || '';

  useEffect(() => {
    setSubject(`${gameTitle} — игра вышла`);
    setMessage(
      `Здравствуйте!\n\nВы просили сообщить, когда выйдет «${gameTitle}» — игра уже в RuStore и AppGallery, можно скачивать.\n\nСтраница игры: https://fingame-coder.ru/games/${gameSlug}\n\nЭто письмо отправлено один раз, по вашей просьбе. Больше рассылок не будет.\n\nFinGame`,
    );
    setResult(null);
    setError(null);
    setConfirm(false);
  }, [gameId, gameTitle, gameSlug]);

  const loadStats = async () => {
    setError(null);
    try {
      const res = await fetch(GAME_PURCHASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'release-stats', gameId, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Не удалось получить список подписчиков.');
        return;
      }
      setStats({ total: data.total, notified: data.notified, pending: data.pending });
    } catch {
      setError('Нет связи с сервером.');
    }
  };

  useEffect(() => {
    setStats(null);
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  const send = async (mode: 'test' | 'all') => {
    if (mode === 'all' && !confirm) {
      setConfirm(true);
      return;
    }

    setBusy(mode);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(GAME_PURCHASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'release-send',
          gameId,
          code,
          subject,
          message,
          testTo: mode === 'test' ? testTo.trim() : '',
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || 'Не удалось отправить письма.');
        return;
      }

      setResult(
        mode === 'test'
          ? `Тестовое письмо отправлено на ${testTo.trim()}.`
          : `Отправлено писем: ${data.sent}${data.failed ? `, не доставлено: ${data.failed}` : ''}.`,
      );
      setConfirm(false);
      if (mode === 'all') loadStats();
    } catch {
      setError('Нет связи с сервером.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <section id="mailer" className="scroll-mt-28 rounded-lg bg-secondary p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-head text-[22px] font-bold tracking-[-0.01em] md:text-[26px]">
          Письмо о релизе
        </h2>
        <button
          type="button"
          onClick={loadStats}
          className="inline-flex h-9 items-center gap-2 rounded-[18px] bg-background px-3.5 text-[14px] font-medium transition-colors hover:bg-border"
        >
          <Icon name="RefreshCw" size={15} />
          Обновить
        </button>
      </div>
      <p className="mt-2 text-[16px] leading-[1.45] text-muted-foreground">
        Одной кнопкой разослать письмо всем, кто оставил почту на странице игры. Каждому
        адресу письмо уходит один раз — повторно он в рассылку не попадёт.
      </p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Всего подписчиков', value: stats?.total },
          { label: 'Ждут письма', value: stats?.pending },
          { label: 'Уже получили', value: stats?.notified },
        ].map((s) => (
          <div key={s.label} className="rounded-md bg-background px-4 py-3">
            <dt className="text-[14px] text-muted-foreground">{s.label}</dt>
            <dd className="mt-0.5 font-head text-[22px] font-bold">
              {s.value === undefined ? '—' : s.value}
            </dd>
          </div>
        ))}
      </dl>

      <label className="mt-6 block text-[15px] font-medium" htmlFor="mail-subject">
        Тема письма
      </label>
      <input
        id="mail-subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="mt-2 h-[52px] w-full rounded-[26px] bg-background px-5 text-[16px] outline-none ring-ring/40 focus:ring-2"
      />

      <label className="mt-4 block text-[15px] font-medium" htmlFor="mail-body">
        Текст письма
      </label>
      <textarea
        id="mail-body"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={9}
        className="mt-2 w-full resize-y rounded-[20px] bg-background px-5 py-4 text-[15px] leading-[1.5] outline-none ring-ring/40 focus:ring-2"
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className="block text-[15px] font-medium" htmlFor="mail-test">
            Проверочное письмо себе
          </label>
          <input
            id="mail-test"
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
            placeholder="game-fin-ip@yandex.ru"
            className="mt-2 h-[52px] w-full rounded-[26px] bg-background px-5 text-[16px] outline-none ring-ring/40 placeholder:text-muted-foreground focus:ring-2"
          />
        </div>
        <button
          type="button"
          disabled={busy !== null || !testTo.trim()}
          onClick={() => send('test')}
          className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[26px] bg-background px-6 text-[16px] font-medium transition-colors hover:bg-border disabled:pointer-events-none disabled:opacity-50"
        >
          {busy === 'test' ? (
            <Icon name="LoaderCircle" size={17} className="animate-spin" />
          ) : (
            <Icon name="Send" size={17} />
          )}
          Отправить тест
        </button>
      </div>

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

      <div className="mt-6 rounded-lg bg-background p-5">
        {confirm ? (
          <>
            <p className="flex items-start gap-2 text-[15px] leading-[1.45]">
              <Icon name="TriangleAlert" size={18} className="mt-0.5 shrink-0 text-destructive" />
              Письмо уйдёт {stats?.pending ?? 0} подписчикам. Отменить отправку будет нельзя.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => send('all')}
                className="inline-flex h-[52px] items-center gap-2 rounded-[26px] bg-destructive px-6 text-[16px] font-bold text-destructive-foreground transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60"
              >
                {busy === 'all' ? (
                  <Icon name="LoaderCircle" size={17} className="animate-spin" />
                ) : (
                  <Icon name="Check" size={17} />
                )}
                Да, разослать всем
              </button>
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="inline-flex h-[52px] items-center rounded-[26px] bg-secondary px-6 text-[16px] font-medium transition-colors hover:bg-border"
              >
                Отмена
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            disabled={busy !== null || !stats?.pending}
            onClick={() => send('all')}
            className="inline-flex h-[56px] w-full items-center justify-center gap-2.5 rounded-[28px] bg-primary px-[30px] text-[17px] font-bold text-primary-foreground transition-transform hover:scale-[1.01] disabled:pointer-events-none disabled:opacity-50"
          >
            <Icon name="MailCheck" size={19} />
            Разослать письмо о релизе ({stats?.pending ?? 0})
          </button>
        )}
      </div>
    </section>
  );
};

export default ReleaseMailer;
