import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/ui/icon';

type Shot = { src: string; alt: string };

type Props = {
  shots: Shot[];
  index: number | null;
  title: string;
  onChange: (index: number | null) => void;
};

const ScreenshotViewer = ({ shots, index, title, onChange }: Props) => {
  const touchX = useRef<number | null>(null);
  const open = index !== null;
  const total = shots.length;

  const go = (step: number) => {
    if (index === null) return;
    onChange((index + step + total) % total);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      if (e.key === 'ArrowRight') onChange(((index ?? 0) + 1) % total);
      if (e.key === 'ArrowLeft') onChange(((index ?? 0) - 1 + total) % total);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, index, total, onChange]);

  if (index === null) return null;
  const shot = shots[index];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Скриншот ${index + 1} из ${total}`}
      className="fixed inset-0 z-[100] flex animate-in fade-in-0 flex-col bg-background/95 backdrop-blur-md"
      onClick={() => onChange(null)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
        <span className="text-[14px] text-muted-foreground">
          {title} · {index + 1} / {total}
        </span>
        <button
          type="button"
          aria-label="Закрыть"
          onClick={() => onChange(null)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Icon name="X" size={22} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 md:px-20">
        <img
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full animate-in fade-in-0 zoom-in-95 rounded-md object-contain shadow-[0_0_80px_-20px_hsl(var(--primary)/0.5)]"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Предыдущий скриншот"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-secondary/90 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground md:inline-flex"
            >
              <Icon name="ChevronLeft" size={26} />
            </button>
            <button
              type="button"
              aria-label="Следующий скриншот"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-secondary/90 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground md:inline-flex"
            >
              <Icon name="ChevronRight" size={26} />
            </button>
          </>
        )}
      </div>

      <p className="px-5 py-4 text-center text-[14px] leading-[1.4] text-muted-foreground md:px-8">
        {shot.alt.replace(`${title} — `, '')}
      </p>
    </div>,
    document.body,
  );
};

export default ScreenshotViewer;
