export const PAYMENT_CONFIRM_URL = 'https://functions.poehali.dev/09873c87-7c2c-47db-ac69-5de48f3a6987';

export const PAYMENT_URL = 'https://functions.poehali.dev/f37ce028-e555-4aee-a4a8-931a9db48882';

export const GAME_PURCHASE_URL = 'https://functions.poehali.dev/619eb346-cf2f-461b-8ea1-83172e973c9e';

export const PING_URL = 'https://functions.poehali.dev/f089d5db-508b-44ef-bc3b-bfa5e422629b';

export const CONTACT_URL = 'https://functions.poehali.dev/e9b7fc8d-4436-4b9b-9a98-905e863b6377';

export const company = {
  brand: 'FinGame',
  legalName: 'Индивидуальный предприниматель Финенко Лариса Валерьевна',
  shortName: 'ИП Финенко Л. В.',
  inn: '253304385316',
  ogrnip: '326253600015200',
  email: 'game-fin-ip@yandex.ru',
  bankName: 'Дальневосточный банк ПАО Сбербанк',
  account: '40802810650710009449',
  corrAccount: '30101810600000000608',
  bik: '040813608',
  answerTime: 'Отвечаем в течение одного рабочего дня',
};

export type Game = {
  id: string;
  slug: string;
  gameId: string;
  title: string;
  tagline: string;
  description: string;
  about: string[];
  features: { icon: string; title: string; text: string }[];
  priceLabel: string;
  thumb: string;
  genre: string;
  platforms: string;
  ageRating: string;
  size: string;
  rustore?: string;
  icon?: string;
  screenshots: { src: string; alt: string }[];
};

// ВАЖНО: подставьте реальные ссылки на страницы игр в RuStore.
export const games: Game[] = [
  {
    id: 'byte-trace',
    slug: 'bytetrace',
    gameId: 'bytetrace',
    title: 'ByteTrace',
    tagline: 'Кибер-головоломка о поиске цифрового следа.',
    description:
      'Вы — специалист по цифровой криминалистике. Ищете следы взлома в потоках данных, восстанавливаете цепочку событий и вычисляете того, кто был в системе. Без таймеров и рекламы — только логика.',
    about: [
      'В сеть компании кто-то проник. Система записала всё: обращения к файлам, входы в систему, передачи данных. Вам предстоит разобрать эти записи и понять, что именно произошло.',
      'Каждое дело — отдельная история. Вы сопоставляете время событий, находите противоречия в показаниях и шаг за шагом сужаете круг подозреваемых, пока не останется один.',
      'Подсказок мало, спешить некуда. Никаких таймеров и штрафов за ошибку — можно спокойно вернуться к делу и пересобрать цепочку заново.',
    ],
    features: [
      {
        icon: 'Network',
        title: 'Разбор сетевых связей',
        text: 'Стройте карту соединений и находите узел, через который пришёл взлом.',
      },
      {
        icon: 'ScrollText',
        title: 'Анализ журналов',
        text: 'Сопоставляйте записи по времени и находите событие, которого быть не должно.',
      },
      {
        icon: 'UserSearch',
        title: 'Выбор подозреваемого',
        text: 'Собранные улики сходятся на одном человеке — назовите имя и закройте дело.',
      },
      {
        icon: 'WifiOff',
        title: 'Работает без интернета',
        text: 'Все дела доступны офлайн. Связь нужна только для покупок.',
      },
    ],
    priceLabel: 'Бесплатно',
    thumb: 'from-ok to-badge',
    genre: 'Головоломка, детектив',
    platforms: 'Android 8.0 и новее',
    ageRating: '12+',
    size: 'около 60 МБ',
    rustore: 'https://www.rustore.ru/catalog/app/com.FinGame.ByteTrace',
    icon: 'https://cdn.poehali.dev/projects/f66c7488-88ec-49b0-bfc4-ee80d5e44ff2/bucket/7f835ab3-e9d3-401d-9266-530a364c2f39.jpeg',
    screenshots: [
      {
        src: 'https://cdn.poehali.dev/projects/f66c7488-88ec-49b0-bfc4-ee80d5e44ff2/files/974acb82-6b80-41b0-a2d1-d48f3755198a.jpg',
        alt: 'ByteTrace — карта сетевых связей с точкой проникновения',
      },
      {
        src: 'https://cdn.poehali.dev/projects/f66c7488-88ec-49b0-bfc4-ee80d5e44ff2/files/77818934-28ec-4d46-ac31-201b26766644.jpg',
        alt: 'ByteTrace — разбор журнала событий и поиск улик',
      },
      {
        src: 'https://cdn.poehali.dev/projects/f66c7488-88ec-49b0-bfc4-ee80d5e44ff2/files/16ea835c-885b-4786-b941-1437bbf6004a.jpg',
        alt: 'ByteTrace — выбор подозреваемого по собранным уликам',
      },
    ],
  },
];