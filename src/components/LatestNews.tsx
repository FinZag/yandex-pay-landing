import { Link } from '@tanstack/react-router';
import Icon from '@/components/ui/icon';
import { games } from '@/data/company';
import { news, formatNewsDate } from '@/data/news';

const tagIcon = { Релиз: 'Rocket', Обновление: 'RefreshCw', Анонс: 'Megaphone' } as const;

const LatestNews = () => {
  const latest = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <section id="news" className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
          Новости
        </h2>
        <Link
          to="/news"
          className="inline-flex shrink-0 items-center gap-1.5 text-[15px] font-medium text-primary transition-opacity hover:opacity-80"
        >
          Все новости
          <Icon name="ArrowRight" size={16} />
        </Link>
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-3">
        {latest.map((item) => {
          const game = games.find((g) => g.slug === item.gameSlug);
          return (
            <article key={item.id} className="flex flex-col rounded-lg bg-secondary p-5 md:p-6">
              <div className="flex items-center gap-3">
                {game?.icon && (
                  <img
                    src={game.icon}
                    alt={`Иконка игры ${game.title}`}
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-[13px] object-cover ring-1 ring-border"
                  />
                )}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-muted-foreground">
                  <span className="inline-flex h-6 items-center gap-1 rounded-full bg-badge px-2.5 text-[12px] font-bold text-badge-foreground">
                    <Icon name={tagIcon[item.tag]} size={12} />
                    {item.tag}
                  </span>
                  <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
                </div>
              </div>
              <h3 className="mt-4 font-head text-[18px] font-bold leading-[1.25] tracking-[-0.01em]">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-[15px] leading-[1.45] text-muted-foreground">
                {item.text}
              </p>
              <Link
                to="/news"
                hash={item.id}
                className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[15px] font-medium text-foreground transition-colors hover:text-primary"
              >
                Читать
                <Icon name="ArrowRight" size={16} />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default LatestNews;
