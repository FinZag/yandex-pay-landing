import Icon from '@/components/ui/icon';
import { company } from '@/data/company';

const facts = [
  {
    icon: 'User',
    title: 'Один разработчик',
    text: 'FinGame — это инди-разработчик в одном лице: код, дизайн, звук и публикация делаются самостоятельно, без издателя.',
  },
  {
    icon: 'Cpu',
    title: 'Движок Unity',
    text: 'Разрабатываем на Unity — проверенном движке для мобильных игр. Он даёт стабильную работу на широком парке Android-устройств.',
  },
  {
    icon: 'HeartHandshake',
    title: 'Почему скачивание бесплатно',
    text: 'Игру можно установить и пройти без вложений. Разработка окупается рекламой и необязательными покупками внутри игры.',
  },
];

const About = () => {
  return (
    <section id="about" className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
          О студии
        </h2>
        <span className="text-[15px] text-muted-foreground">Кто и как делает игры</span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-lg bg-secondary p-6 md:p-8">
          <p className="font-head text-[19px] font-bold leading-[1.3] tracking-[-0.01em] md:text-[21px]">
            {company.brand} — инди-разработчик мобильных игр. Всё, что вы видите в играх, сделано
            одним человеком.
          </p>
          <div className="mt-4 space-y-3 text-[16px] leading-[1.5] text-muted-foreground">
            <p>
              Я делаю небольшие мобильные игры в одиночку: придумываю механику, пишу код, рисую
              интерфейс, собираю звук и сам выпускаю релизы. Издателя и команды нет — поэтому
              проекты выходят компактными, зато каждый доводится до конца.
            </p>
            <p>
              Разработка ведётся на Unity — движке, на котором сделана большая часть мобильных игр.
              Он даёт стабильную работу на самых разных Android-устройствах и позволяет быстро
              выпускать обновления.
            </p>
            <p>
              Игры бесплатны при скачивании: установить и пройти их можно без вложений. Разработка
              окупается рекламой и необязательными покупками внутри игры — они ускоряют прогресс
              или отключают рекламу, но не обязательны. Деятельность зарегистрирована как{' '}
              {company.shortName} и ведётся по российскому законодательству.
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