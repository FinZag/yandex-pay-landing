import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

const links = [
  { href: '#about', label: 'О студии' },
  { href: '#games', label: 'Игры' },
  { href: '#payment', label: 'Поддержать' },
  { href: '#requisites', label: 'Реквизиты' },
  { href: '#legal', label: 'Документы' },
  { href: '#faq', label: 'Вопросы' },
  { href: '#contacts', label: 'Контакты' },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-background/85 backdrop-blur transition-shadow',
        scrolled && 'shadow-[0_1px_0_0_hsl(var(--border))]',
      )}
    >
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 md:h-[92px] md:px-[76px]">
        <a href="#top" className="flex items-center gap-2.5" aria-label="FinGame — на главную">
          <img
            src="/logo-mark.jpg"
            alt=""
            className="h-[38px] w-[38px] rounded-[11px] object-cover"
          />
          <span className="font-head text-[24px] font-bold tracking-[-0.02em]">
            Fin<span className="cond">Game</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-[16px] text-muted-foreground lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
          <a
            href="#games"
            className="inline-flex h-[52px] items-center gap-2.5 rounded-[26px] bg-secondary px-6 font-medium text-foreground transition-colors hover:bg-border"
          >
            Скачать игры
            <Icon name="Download" size={20} />
          </a>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
            aria-expanded={open}
            className="grid h-11 w-11 place-items-center rounded-full bg-secondary"
          >
            <Icon name={open ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 pb-5 pt-2 lg:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-border py-3.5 text-[17px] last:border-0"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;