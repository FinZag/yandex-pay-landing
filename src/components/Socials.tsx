import Icon from '@/components/ui/icon';
import { socials } from '@/data/company';
import reachGoal from '@/lib/metrika';

const cards = [
  {
    ...socials.youtube,
    title: 'Разработка изнутри',
    text: 'Девлоги, геймплей новых игр и как всё устроено внутри Unity. Подписывайтесь, чтобы не пропустить выход.',
    cta: 'Смотреть канал',
  },
  {
    ...socials.boosty,
    title: 'Поддержка и ранний доступ',
    text: 'Регулярная поддержка студии, закулисье разработки и новости раньше всех.',
    cta: 'Перейти на Boosty',
  },
];

const Socials = () => (
  <section id="socials" className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
        Мы в сети
      </h2>
      <span className="text-[15px] text-muted-foreground">Следите за разработкой</span>
    </div>

    <div className="mt-5 grid gap-6 md:grid-cols-2">
      {cards.map((c) => (
        <a
          key={c.name}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => reachGoal('social_click', { network: c.name, place: 'socials' })}
          className="group relative flex flex-col overflow-hidden rounded-lg bg-secondary p-6 transition-transform hover:-translate-y-1 md:p-8"
        >
          <span
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl transition-opacity group-hover:opacity-40"
            style={{ background: c.color }}
          />
          <div className="relative flex items-center gap-3">
            <span
              className="grid h-12 w-12 place-items-center rounded-full text-white"
              style={{ background: c.color }}
            >
              <Icon name={c.icon} size={24} />
            </span>
            <div>
              <p className="font-head text-[18px] font-bold">{c.name}</p>
              <p className="text-[14px] text-muted-foreground">{c.handle}</p>
            </div>
          </div>
          <h3 className="relative mt-5 font-head text-[20px] font-bold">{c.title}</h3>
          <p className="relative mt-2 text-[15px] leading-[1.45] text-muted-foreground">{c.text}</p>
          <span
            className="relative mt-6 inline-flex h-11 items-center gap-2 self-start rounded-[22px] px-5 text-[15px] font-bold text-white transition-transform group-hover:scale-[1.03]"
            style={{ background: c.color }}
          >
            {c.cta}
            <Icon name="ArrowUpRight" size={17} />
          </span>
        </a>
      ))}
    </div>
  </section>
);

export const SocialIcons = ({ place, size = 'md' }: { place: string; size?: 'sm' | 'md' }) => {
  const box = size === 'sm' ? 'h-9 w-9' : 'h-[56px] w-[56px]';
  return (
    <div className="flex items-center gap-2">
      {[socials.youtube, socials.boosty].map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${s.name} ${s.handle}`}
          title={s.name}
          onClick={() => reachGoal('social_click', { network: s.name, place })}
          className={`grid ${box} place-items-center rounded-full bg-background text-foreground transition-all hover:scale-[1.06] hover:text-white`}
          onMouseEnter={(e) => (e.currentTarget.style.background = s.color)}
          onMouseLeave={(e) => (e.currentTarget.style.background = '')}
        >
          <Icon name={s.icon} size={size === 'sm' ? 17 : 22} />
        </a>
      ))}
    </div>
  );
};

export default Socials;
