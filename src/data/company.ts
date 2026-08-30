// ВАЖНО: замените значения-заглушки на реальные данные ИП перед подключением Яндекс Пэй.
export const company = {
  brand: 'FinGame',
  legalName: 'Индивидуальный предприниматель Финенко Лариса Валерьевна',
  shortName: 'ИП Финенко Л. В.',
  inn: '000000000000',
  ogrnip: '000000000000000',
  address: 'Российская Федерация, г. Москва',
  email: 'support@fingame.ru',
  phone: '+7 (900) 000-00-00',
  bankName: 'АО «Тинькофф Банк»',
  account: '40802810000000000000',
  corrAccount: '30101810000000000000',
  bik: '000000000',
  schedule: 'Пн–Пт, 10:00–19:00 (МСК)',
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
  appgallery?: string;
};

// ВАЖНО: подставьте реальные ссылки на страницы игр в RuStore и AppGallery.
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
    appgallery: '',
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
    appgallery: '',
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
    appgallery: '',
  },
];