import { FormEvent, ReactNode, useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

const STORAGE_KEY = 'fingame-dev-access';
const CODE = 'fingame-dev-2026';

const DevGate = ({ children }: { children: ReactNode }) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setAllowed(localStorage.getItem(STORAGE_KEY) === CODE);
  }, []);

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (value.trim() !== CODE) {
      setError(true);
      return;
    }
    localStorage.setItem(STORAGE_KEY, CODE);
    setAllowed(true);
  };

  if (allowed === null) return <div className="min-h-screen bg-background" />;
  if (allowed) return <>{children}</>;

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-[420px] rounded-lg bg-secondary p-7 md:p-8"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-background">
          <Icon name="Lock" size={22} />
        </span>
        <h1 className="mt-4 font-head text-[24px] font-bold tracking-[-0.02em]">
          Закрытый раздел
        </h1>
        <p className="mt-2 text-[15px] leading-[1.45] text-muted-foreground">
          Техническая инструкция для разработчиков игр. Введите код доступа.
        </p>
        <input
          type="password"
          value={value}
          onChange={(ev) => {
            setValue(ev.target.value);
            setError(false);
          }}
          placeholder="Код доступа"
          autoFocus
          className="mt-5 h-[52px] w-full rounded-[26px] bg-background px-5 text-[16px] outline-none ring-ring/40 placeholder:text-muted-foreground focus:ring-2"
        />
        {error && (
          <p className="mt-2 flex items-center gap-2 text-[14px] text-destructive">
            <Icon name="TriangleAlert" size={16} />
            Неверный код
          </p>
        )}
        <button
          type="submit"
          className="mt-4 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[26px] bg-primary text-[16px] font-bold text-primary-foreground transition-transform hover:scale-[1.01]"
        >
          Войти
          <Icon name="ArrowRight" size={18} />
        </button>
      </form>
    </div>
  );
};

export default DevGate;
