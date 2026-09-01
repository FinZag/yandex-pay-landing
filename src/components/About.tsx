import Icon from '@/components/ui/icon';
import { company } from '@/data/company';

const facts = [
  {
    icon: 'Users',
    title: 'Небольшая команда',
    text: 'Игры делает микростудия под управлением ИП: код, дизайн и звук ведём сами, без издателя и внешних инвесторов.',
  },
  {
    icon: 'Cpu',
    title: 'Собственный движок',
    text: 'Пишем на своём движке для Android — он лёгкий, не тянет за собой рекламные модули и не собирает лишние данные.',
  },
  {
    icon: 'HeartHandshake',
    title: 'Почему бесплатно',
    text: 'Мы против рекламы, доната за победу и подписок. Игра открыта целиком, а поддержать разработку можно добровольно.',
  },
];

const About = () => {
  return (
    <section id="about" className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
      <div className="flex items-baseline justify-between">
        <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
          О студии
        </h2>
        <span className="text-[15px] text-muted-foreground">Кто и как делает игры</span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-lg bg-secondary p-6 md:p-8">
          <p className="font-head text-[19px] font-bold leading-[1.3] tracking-[-0.01em] md:text-[21px]">
            {company.brand} — независимая студия, которая делает небольшие игры без рекламы и
            обязательных покупок.
          </p>
          <div className="mt-4 space-y-3 text-[16px] leading-[1.5] text-muted-foreground">
            <p>
              Мы начали с простой идеи: мобильная игра может быть спокойной. Без баннеров на
              полэкрана, без таймеров ожидания и предложений «ускорить за 99 рублей». Поэтому
              каждый проект выходит целиком — все уровни и режимы открыты сразу после установки.
            </p>
            <p>
              Разработку ведём на собственном движке. Он написан под конкретные задачи наших игр,
              весит немного и не тянет за собой рекламные SDK — за счёт этого сборки компактные, а
              лишние разрешения приложению не нужны.
            </p>
            <p>
              Студия зарегистрирована как {company.shortName} и работает по российскому
              законодательству. Игры публикуются в RuStore, а всё, что поступает добровольными
              взносами, идёт на новые уровни, исправление ошибок и оплату аккаунтов разработчика.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {facts.map((f) => (
            <div key={f.title} className="rounded-lg bg-secondary p-5 md:p-6">
              <Icon name={f.icon} size={22} />
              <h3 className="mt-3 font-head text-[17px] font-bold">{f.title}</h3>
              <p className="mt-1 text-[15px] leading-[1.45] text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
