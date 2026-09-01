export const company = {
  brand: 'FinGame',
  legalName: 'Индивидуальный предприниматель Финенко Лариса Валерьевна',
  shortName: 'ИП Финенко Л. В.',
  inn: '253304385316',
  ogrnip: '326253600015200',
  email: 'support@fingame.ru',
  bankName: 'Дальневосточный банк ПАО Сбербанк',
  account: '40802810650710009449',
  corrAccount: '30101810600000000608',
  bik: '040813608',
  answerTime: 'Отвечаем в течение одного рабочего дня',
};

export type Game = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  priceLabel: string;
  thumb: string;
  genre: string;
  platforms: string;
  rustore?: string;
};

// ВАЖНО: подставьте реальные ссылки на страницы игр в RuStore.
export const games: Game[] = [
  {
    id: 'ledger-rush',
    title: 'Ledger Rush',
    tagline: 'Аркада про биржевой день. 30 уровней.',
    description:
      'Динамичная аркада, где вы сводите баланс на скорость: сделки летят быстрее, чем вы успеваете считать. 30 уровней, режим бесконечной смены и таблица рекордов.',
    priceLabel: 'Бесплатно',
    thumb: 'from-accent to-banner-to',
    genre: 'Аркада',
    platforms: 'Android',
    rustore: '',
  },
  {
    id: 'night-shift',
    title: 'Ночная смена',
    tagline: 'Тихий детектив в офисе на 12 этаже.',
    description:
      'Неспешный детектив без погонь и стрельбы. Вы — ночной аудитор, который находит в отчётах то, чего там быть не должно. Пять вечеров, три концовки.',
    priceLabel: 'Бесплатно',
    thumb: 'from-bar to-muted-foreground',
    genre: 'Детектив, квест',
    platforms: 'Android',
    rustore: '',
  },
  {
    id: 'pixel-vault',
    title: 'Pixel Vault',
    tagline: 'Головоломка о взломе старых сейфов.',
    description:
      'Пиксельная головоломка: 60 механических замков, каждый со своей логикой. Подсказки не продаются — до всего доходите сами.',
    priceLabel: 'Бесплатно',
    thumb: 'from-ok to-badge',
    genre: 'Головоломка',
    platforms: 'Android',
    rustore: '',
  },
];