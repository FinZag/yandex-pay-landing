import Icon from '@/components/ui/icon';

const Hero = () => {
  return (
    <section id="top" className="mx-auto max-w-[1280px] px-5 pt-2 md:px-[76px]">
      <div className="relative flex animate-rise flex-col overflow-hidden rounded-lg bg-[linear-gradient(105deg,hsl(var(--banner-from))_0%,hsl(var(--banner-from))_42%,hsl(var(--banner-to))_100%)] px-6 py-8 md:min-h-[420px] md:px-10 md:py-[38px]">
        <div className="cond text-[22px] leading-none tracking-[-0.01em] md:text-[26px]">
          Fin<span className="text-accent">Game</span> · студия инди-игр
        </div>

        <h1 className="mt-6 max-w-[15ch] font-head text-[30px] font-bold leading-[1.08] tracking-[-0.025em] md:mt-[26px] md:text-[32px]">
          Бесплатные игры от независимой студии
        </h1>

        <p className="mt-4 max-w-[34ch] text-[17px] font-medium leading-[1.4] text-muted-foreground">
          Три игры на своём движке — скачивайте в RuStore и AppGallery. Понравилось? Поддержите
          разработку картой или через Яндекс Пэй.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3 pb-1 md:mt-auto md:pt-6">
          <a
            href="#games"
            className="inline-flex h-[56px] shrink-0 items-center whitespace-nowrap rounded-[28px] bg-primary px-[30px] text-[17px] font-bold tracking-[-0.01em] text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Смотреть игры
          </a>
          <a
            href="#payment"
            className="inline-flex h-[56px] shrink-0 items-center gap-2 whitespace-nowrap rounded-[28px] bg-background px-[30px] text-[17px] font-bold tracking-[-0.01em] text-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Поддержать <span className="cond">Пэй</span>
          </a>
        </div>

        <img
          className="pointer-events-none absolute bottom-6 right-8 hidden h-[300px] w-[300px] animate-float rounded-[36px] object-cover shadow-[0_24px_60px_-24px_hsl(var(--foreground)/0.45)] lg:block"
          alt="Логотип FinGame"
          src="/logo.jpg"
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: 'Download', text: 'Игры бесплатны — RuStore и AppGallery' },
          { icon: 'ShieldCheck', text: 'Поддержка через защищённый шлюз Яндекс Пэй' },
          { icon: 'BadgeCheck', text: 'Поддержка — добровольно, без подписок' },
        ].map((f) => (
          <div
            key={f.icon}
            className="flex items-center gap-3 rounded-md bg-secondary px-4 py-3.5 text-[15px] leading-[1.35] text-muted-foreground"
          >
            <Icon name={f.icon} size={20} className="shrink-0 text-foreground" />
            {f.text}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;