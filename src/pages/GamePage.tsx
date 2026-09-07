import { useParams, Link, Navigate } from 'react-router-dom';
import Seo from '@/components/Seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GamePurchase from '@/components/GamePurchase';
import Icon from '@/components/ui/icon';
import { games } from '@/data/company';
import { useToast } from '@/hooks/use-toast';

const GamePage = () => {
  const { slug } = useParams();
  const game = games.find((g) => g.slug === slug);
  const { toast } = useToast();

  if (!game) return <Navigate to="/" replace />;

  const openStore = () => {
    if (game.rustore) {
      window.open(game.rustore, '_blank', 'noopener,noreferrer');
      return;
    }
    toast({ title: 'Ссылка на RuStore пока не указана' });
  };

  const specs = [
    { label: 'Жанр', value: game.genre },
    { label: 'Платформа', value: game.platforms },
    { label: 'Возраст', value: game.ageRating },
    { label: 'Размер', value: game.size },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${game.title} — ${game.genre} для Android | FinGame`}
        description={`${game.description} Бесплатно в RuStore, отключение рекламы — разовая покупка.`}
        path={`/games/${game.slug}`}
      />
      <Header />

      <main>
        <section className="mx-auto max-w-[1280px] px-5 pt-8 md:px-[76px] md:pt-12">
          <nav className="flex items-center gap-2 text-[14px] text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <Link to="/#games" className="transition-colors hover:text-foreground">
              Игры
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">{game.title}</span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
            <div
              className={`h-[132px] w-[132px] shrink-0 overflow-hidden rounded-[28px] bg-gradient-to-br ${game.thumb} md:h-[164px] md:w-[164px]`}
            >
              {game.icon && (
                <img
                  src={game.icon}
                  alt={`Иконка игры ${game.title}`}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div>
              <span className="inline-flex h-8 items-center rounded-full bg-badge px-3.5 text-[13px] font-bold text-badge-foreground">
                {game.priceLabel} в RuStore
              </span>
              <h1 className="mt-3 font-head text-[34px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[52px]">
                {game.title}
              </h1>
              <p className="mt-3 max-w-[620px] text-[17px] leading-[1.4] text-muted-foreground md:text-[19px]">
                {game.tagline}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openStore}
                  className="inline-flex h-[56px] items-center gap-2.5 rounded-[28px] bg-primary px-[30px] text-[17px] font-bold tracking-[-0.01em] text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
                >
                  <Icon name="Download" size={20} />
                  Скачать в RuStore
                </button>
                <a
                  href="#purchase"
                  className="inline-flex h-[56px] items-center gap-2.5 rounded-[28px] bg-secondary px-[30px] text-[17px] font-medium text-foreground transition-colors hover:bg-border"
                >
                  Покупки в игре
                  <Icon name="ArrowDown" size={18} />
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {specs.map((s) => (
                  <div key={s.label} className="rounded-md bg-secondary px-4 py-3">
                    <dt className="text-[14px] text-muted-foreground">{s.label}</dt>
                    <dd className="mt-0.5 text-[15px] font-medium leading-[1.3]">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
          <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
            Скриншоты
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {game.screenshots.map((shot, i) => (
              <figure
                key={shot.src}
                style={{ animationDelay: `${0.06 * i}s` }}
                className="animate-rise overflow-hidden rounded-lg bg-secondary"
              >
                <div className="aspect-[9/16] w-full bg-[#141414]">
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>
                <figcaption className="px-4 py-3 text-[13px] leading-[1.35] text-muted-foreground">
                  {shot.alt.replace(`${game.title} — `, '')}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
          <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
            Об игре
          </h2>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="rounded-lg bg-secondary p-6 md:p-8">
              {game.about.map((p) => (
                <p key={p} className="mt-4 text-[16px] leading-[1.5] first:mt-0">
                  {p}
                </p>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {game.features.map((f) => (
                <div key={f.title} className="rounded-lg bg-secondary p-5">
                  <Icon name={f.icon} fallback="CircleAlert" size={22} />
                  <h3 className="mt-3 font-head text-[16px] font-bold leading-[1.2]">{f.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-[1.4] text-muted-foreground">
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <GamePurchase gameId={game.gameId} gameTitle={game.title} />

        <section className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
          <div className="rounded-lg bg-[linear-gradient(105deg,hsl(var(--banner-from))_0%,hsl(var(--banner-to))_100%)] p-6 md:p-10">
            <h2 className="font-head text-[24px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[30px]">
              {game.ctaTitle ?? `Попробуйте ${game.title}`}
            </h2>
            <p className="mt-2 max-w-[560px] text-[16px] leading-[1.4]">
              {game.ctaText ?? 'Скачивание бесплатное, регистрация не нужна.'}
            </p>
            <button
              type="button"
              onClick={openStore}
              className="mt-6 inline-flex h-[56px] items-center gap-2.5 rounded-[28px] bg-primary px-[30px] text-[17px] font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              Скачать в RuStore
              <Icon name="ArrowUpRight" size={18} />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GamePage;