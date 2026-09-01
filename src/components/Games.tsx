import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { games, type Game } from '@/data/company';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Games = () => {
  const [active, setActive] = useState<Game | null>(null);
  const { toast } = useToast();

  const openStore = (url: string | undefined, store: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    toast({
      title: `Ссылка на ${store} пока не указана`,
      description: 'Пришлите адрес страницы игры — добавим кнопку.',
    });
  };

  return (
    <section id="games" className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
      <div className="flex items-baseline justify-between">
        <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
          Каталог игр
        </h2>
        <span className="text-[15px] text-muted-foreground">Скачивание в RuStore</span>
      </div>

      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game, i) => (
          <article
            key={game.id}
            style={{ animationDelay: `${0.06 * i}s` }}
            className="flex animate-rise flex-col gap-3 rounded-lg bg-secondary p-4 pb-[18px] transition-shadow hover:shadow-[0_8px_28px_-16px_hsl(var(--foreground)/0.35)]"
          >
            <button
              type="button"
              onClick={() => setActive(game)}
              className={`relative h-[120px] overflow-hidden rounded-md bg-gradient-to-br ${game.thumb}`}
              aria-label={`Подробнее об игре ${game.title}`}
            >
              <span className="absolute -right-6 -top-6 h-[88px] w-[88px] rounded-full bg-background/25" />
            </button>

            <div className="flex items-center justify-between gap-3">
              <h3 className="font-head text-[17px] font-bold tracking-[-0.01em]">{game.title}</h3>
              <span className="shrink-0 rounded-full bg-background px-3 py-1 text-[13px] font-medium text-muted-foreground">
                {game.priceLabel}
              </span>
            </div>
            <p className="text-[15px] leading-[1.35] text-muted-foreground">{game.tagline}</p>

            <button
              type="button"
              onClick={() => setActive(game)}
              className="inline-flex items-center gap-1 self-start text-[14px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Подробнее <Icon name="ChevronRight" size={14} />
            </button>

            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => openStore(game.rustore, 'RuStore')}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[20px] bg-primary px-4 text-[14px] font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                <Icon name="Download" size={16} />
                Скачать в RuStore
              </button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg rounded-lg">
          {active && (
            <>
              <div className={`h-[110px] rounded-md bg-gradient-to-br ${active.thumb}`} />
              <DialogHeader>
                <DialogTitle className="font-head text-[22px] font-bold tracking-[-0.01em]">
                  {active.title}
                </DialogTitle>
                <DialogDescription className="text-[16px] leading-[1.45] text-muted-foreground">
                  {active.description}
                </DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-2 gap-3 text-[15px]">
                <div className="rounded-md bg-secondary px-4 py-3">
                  <dt className="text-muted-foreground">Жанр</dt>
                  <dd className="mt-0.5 font-medium">{active.genre}</dd>
                </div>
                <div className="rounded-md bg-secondary px-4 py-3">
                  <dt className="text-muted-foreground">Платформы</dt>
                  <dd className="mt-0.5 font-medium">{active.platforms}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => openStore(active.rustore, 'RuStore')}
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[26px] bg-primary px-6 font-bold text-primary-foreground"
              >
                Скачать в RuStore
                <Icon name="ArrowUpRight" size={18} />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Games;