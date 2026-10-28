export type NewsItem = {
  id: string;
  date: string;
  gameSlug?: string;
  tag: 'Релиз' | 'Обновление' | 'Анонс';
  title: string;
  text: string;
};

export const news: NewsItem[] = [
  {
    id: 'little-witch-preorder',
    date: '2026-10-28',
    gameSlug: 'little-witch-shop',
    tag: 'Анонс',
    title: '«Лавка маленькой ведьмы» — открыт предзаказ в RuStore',
    text: 'Уютная головоломка с волшебными плитками, маленькой ведьмой и котом-помощником. Оформите предзаказ в RuStore или оставьте почту на странице игры — напишем, когда она выйдет. Монеты и отключение рекламы уже можно купить на сайте.',
  },
  {
    id: 'kooperativ-release',
    date: '2026-10-24',
    gameSlug: 'kooperativ-6',
    tag: 'Релиз',
    title: '«Кооператив №6» вышел в RuStore',
    text: 'Симулятор гаражного автосервиса в ГСК конца 90-х доступен для скачивания. Всем, кто ждал релиза, мы отправили письмо со ссылкой на игру.',
  },
  {
    id: 'kooperativ-announce',
    date: '2026-09-28',
    gameSlug: 'kooperativ-6',
    tag: 'Анонс',
    title: 'Анонс «Кооператива №6»',
    text: 'Рассказали о новой игре студии: диагностика поломок, три стратегии ремонта и председатель Михалыч со взносами. На странице игры появилась подписка на новость о выходе.',
  },
  {
    id: 'butter-clicker-release',
    date: '2026-09-07',
    gameSlug: 'butter-clicker',
    tag: 'Релиз',
    title: '«Масло Кликер: Антистресс ASMR» в RuStore',
    text: 'Залипательный ASMR-кликер с живой физикой масла и 19 скинами со своими звуками. На сайте можно отключить рекламу и купить пак монет.',
  },
  {
    id: 'bytetrace-release',
    date: '2026-09-02',
    gameSlug: 'bytetrace',
    tag: 'Релиз',
    title: 'ByteTrace — детективный квест в RuStore',
    text: 'Взломайте смартфон пропавшего хакера Prometheus и раскройте тайну ByteTrace. Скачивание бесплатное, отключение рекламы — разовая покупка на сайте.',
  },
];

export const formatNewsDate = (date: string) => {
  const [y, m, d] = date.split('-').map(Number);
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  return `${d} ${months[m - 1]} ${y}`;
};
