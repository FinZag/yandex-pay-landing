import { Link } from '@tanstack/react-router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';
import { games } from '@/data/company';
import { news, formatNewsDate } from '@/data/news';

const tagIcon = { Релиз: 'Rocket', Обновление: 'RefreshCw', Анонс: 'Megaphone' } as const;

const NewsPage = () => (
  <div className="min-h-screen bg-background">
    <Header />

    <main className="mx-auto max-w-[1280px] px-5 pt-8 md:px-[76px] md:pt-12">
      <nav className="flex items-center gap-2 text-[14px] text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-foreground">
          Главная
        </Link>
        <Icon name="ChevronRight" size={14} />
        <span className="text-foreground">Новости</span>
      </nav>

      <h1 className="mt-5 font-head text-[34px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[48px]">
        Новости FinGame
      </h1>
      <p className="mt-3 max-w-[640px] text-[17px] leading-[1.45] text-muted-foreground">
        Релизы, обновления и анонсы наших игр для Android — коротко и по делу.
      </p>

      <ol className="mt-10 max-w-[860px] space-y-4">
        {news.map((item) => {
          const game = games.find((g) => g.slug === item.gameSlug);
          return (
            <li key={item.id} id={item.id} className="scroll-mt-28">
              <article className="flex gap-4 rounded-lg bg-secondary p-5 md:gap-6 md:p-7">
                {game?.icon && (
                  <Link
                    to="/games/$slug"
                    params={{ slug: game.slug }}
                    className="h-14 w-14 shrink-0 overflow-hidden rounded-[16px] ring-1 ring-border md:h-[72px] md:w-[72px] md:rounded-[20px]"
                  >
                    <img
                      src={game.icon}
                      alt={`Иконка игры ${game.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[14px] text-muted-foreground">
                    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-badge px-3 text-[13px] font-bold text-badge-foreground">
                      <Icon name={tagIcon[item.tag]} size={14} />
                      {item.tag}
                    </span>
                    <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
                  </div>
                  <h2 className="mt-3 font-head text-[20px] font-bold leading-[1.2] tracking-[-0.01em] md:text-[24px]">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-[16px] leading-[1.5] text-muted-foreground">{item.text}</p>
                  {game && (
                    <Link
                      to="/games/$slug"
                      params={{ slug: game.slug }}
                      className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-medium text-primary transition-opacity hover:opacity-80"
                    >
                      Страница игры
                      <Icon name="ArrowRight" size={16} />
                    </Link>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </main>

    <Footer />
  </div>
);

export default NewsPage;
