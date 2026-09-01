export const PAYMENT_URL = 'https://functions.poehali.dev/f37ce028-e555-4aee-a4a8-931a9db48882';

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
  title: string;
  tagline: string;
  description: string;
  priceLabel: string;
  thumb: string;
  genre: string;
  platforms: string;
  rustore?: string;
  icon?: string;
};

// ВАЖНО: подставьте реальные ссылки на страницы игр в RuStore.
export const games: Game[] = [
  {
    id: 'byte-trace',
    title: 'ByteTrace',
    tagline: 'Кибер-головоломка о поиске цифрового следа.',
    description:
      'Вы — специалист по цифровой криминалистике. Ищете следы взлома в потоках данных, восстанавливаете цепочку событий и вычисляете того, кто был в системе. Без таймеров и рекламы — только логика.',
    priceLabel: 'Бесплатно',
    thumb: 'from-ok to-badge',
    genre: 'Головоломка, детектив',
    platforms: 'Android',
    rustore: 'https://www.rustore.ru/catalog/app/com.FinGame.ByteTrace',
    icon: 'https://cdn.poehali.dev/projects/f66c7488-88ec-49b0-bfc4-ee80d5e44ff2/bucket/7f835ab3-e9d3-401d-9266-530a364c2f39.jpeg',
  },
];