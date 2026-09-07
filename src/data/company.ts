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
  ctaTitle?: string;
  ctaText?: string;
  screenshots: { src: string; alt: string }[];
};

// ВАЖНО: подставьте реальные ссылки на страницы игр в RuStore.
export const games: Game[] = [
  {
    id: 'byte-trace',
    slug: 'bytetrace',
    gameId: 'bytetrace',
    title: 'ByteTrace',
    tagline: 'Взломай смартфон пропавшего хакера. Раскрой тайну ByteTrace.',
    description:
      'Иммерсивный детективный квест, который превращает ваш смартфон в терминал настоящего кибер-расследования. Вскрывайте чужой телефон приложение за приложением и восстанавливайте, что случилось с его владельцем.',
    about: [
      'Известный соло-хакер Дмитрий, в даркнете известный под ником Prometheus, бесследно исчез. Служба безопасности мегакорпорации Apex Tech идёт по его следу.',
      'Всё, что осталось от Дмитрия, — его зашифрованный смартфон, и он попал к вам в руки. Переписки, терминал, логи системы, галерея, сейф паролей — доступ к каждому разделу нужно открыть самому.',
      'Сможете ли вы завершить его миссию до того, как вычислят вас? Расследование идёт в реальном времени, и часы работают не в вашу пользу.',
    ],
    features: [
      {
        icon: 'Smartphone',
        title: 'Настоящий интерфейс телефона',
        text: 'Мессенджер, почта, галерея, плеер и терминал — вы работаете с живой системой.',
      },
      {
        icon: 'SquareTerminal',
        title: 'Командная строка',
        text: 'Вводите команды в терминал ByteTrace OS, чтобы обойти защиту и добраться до данных.',
      },
      {
        icon: 'KeyRound',
        title: 'Сейф паролей',
        text: 'Улики из переписок и файлов складываются в код доступа к закрытым разделам.',
      },
      {
        icon: 'Clock',
        title: 'Расследование в реальном времени',
        text: 'Служба безопасности Apex Tech идёт по следу — действовать нужно решительно.',
      },
    ],
    priceLabel: 'Бесплатно',
    thumb: 'from-ok to-badge',
    genre: 'Головоломка, детектив',
    platforms: 'Android 8.0 и новее',
    ageRating: '12+',
    size: 'около 60 МБ',
    rustore: 'https://www.rustore.ru/catalog/app/com.FinGame.ByteTrace',
    icon: 'https://cdn.poehali.dev/projects/f66c7488-88ec-49b0-bfc4-ee80d5e44ff2/bucket/3dd7089f-eb58-4946-9308-eafedccdcc7b.jpeg',
    ctaTitle: 'Телефон Prometheus ждёт владельца',
    ctaText:
      'Скачивание бесплатное, регистрация не нужна. Расследование начинается с первого экрана.',
    screenshots: [
      {
        src: 'https://cdn.poehali.dev/projects/f66c7488-88ec-49b0-bfc4-ee80d5e44ff2/bucket/6fd78cd9-2218-443c-97b3-3c2b25e78e6c.png',
        alt: 'ByteTrace — загрузка ByteTrace OS: система заблокирована',
      },
      {
        src: 'https://cdn.poehali.dev/projects/f66c7488-88ec-49b0-bfc4-ee80d5e44ff2/bucket/cf2b5007-68e0-4a9c-af1e-1c1300aa037a.png',
        alt: 'ByteTrace — рабочий стол взломанного смартфона',
      },
      {
        src: 'https://cdn.poehali.dev/projects/f66c7488-88ec-49b0-bfc4-ee80d5e44ff2/bucket/67a9af38-4543-4b33-97af-6ccb71f2cddc.png',
        alt: 'ByteTrace — галерея с уликами из зашифрованных файлов',
      },
      {
        src: 'https://cdn.poehali.dev/projects/f66c7488-88ec-49b0-bfc4-ee80d5e44ff2/bucket/453e331d-9a22-4ca0-9be9-5c12ee7c76a8.png',
        alt: 'ByteTrace — плеер с аудиозаписями из памяти телефона',
      },
    ],
  },
  {
    id: 'butter-clicker',
    slug: 'butter-clicker',
    gameId: 'butter-clicker',
    title: 'Масло Кликер: Антистресс ASMR',
    tagline: 'Мягкое масло, сочный шлепок и приятная вибрация в вашем телефоне.',
    description:
      'Залипательный ASMR-кликер для тех, кто хочет выдохнуть после тяжёлого дня. Тапайте по мягкому упругому бруску, ловите ритм и слушайте сочный шмяк — а заодно собирайте скины и прокачивайте силу клика.',
    about: [
      'Масло в этой игре ведёт себя как настоящее: от каждого касания оно проминается под пальцами, отзывается мягким шлепком и короткой упругой вибрацией смартфона. Ощущение такое, будто брусок лежит у вас в ладони.',
      'В коллекции 19 скинов, и каждый — со своим характером и собственным звуком шмяка: шоколадное и клубничное масло, любимцы интернета, культовые герои, космические, неоновые и абстрактные жидкие узоры.',
      'Клик здесь имеет вес. За тапы капают монеты и опыт, на них качаются «Сильные пальцы», автокликер и крит-клик с взрывом на весь экран. Уровни уходят далеко за сотый, открывая самые редкие скины, а каждый левелап приносит мешок монет.',
      'Заходите каждый день — календарь наград к концу недели превращается в полумиллионный джекпот. А если кликать долго не хочется, в магазине есть мгновенный XP-ускоритель.',
    ],
    features: [
      {
        icon: 'Hand',
        title: 'Живая физика масла',
        text: 'Брусок проминается под пальцами, отвечает шлепком и вибрацией.',
      },
      {
        icon: 'Palette',
        title: '19 скинов со своим звуком',
        text: 'От классического бруска до неоновых и космических узоров.',
      },
      {
        icon: 'TrendingUp',
        title: 'Сильные пальцы и крит-клик',
        text: 'Три ветки прокачки и уровни, которые уходят за сотый.',
      },
      {
        icon: 'Gift',
        title: 'Награда за каждый день',
        text: 'Календарь подарков растёт всю неделю, плюс XP-ускорители.',
      },
    ],
    priceLabel: 'Бесплатно',
    thumb: 'from-badge to-banner-to',
    genre: 'Кликер, антистресс',
    platforms: 'Android 8.0 и новее',
    ageRating: '3+',
    size: 'около 80 МБ',
    rustore: 'https://www.rustore.ru/catalog/app/com.com.asmr.butter.Squishbutter',
    icon: 'https://cdn.poehali.dev/projects/f66c7488-88ec-49b0-bfc4-ee80d5e44ff2/bucket/82510c79-e40e-4ddc-a7cb-62ac7977ad92.jpg',
    ctaTitle: 'Мягкое масло уже ждёт ваших тапов',
    ctaText:
      'Скачивание бесплатное, регистрация не нужна. Расслабляйтесь под ASMR-звуки и открывайте любимые скины.',
    screenshots: [
      {
        src: '/butter-clicker-1.png',
        alt: 'Масло Кликер — классический брусок масла в ладони и шкала опыта',
      },
      {
        src: '/butter-clicker-2.png',
        alt: 'Масло Кликер — скин с мраморным узором и вишенкой из коллекции',
      },
      {
        src: '/butter-clicker-3.png',
        alt: 'Масло Кликер — магазин улучшений: сильные пальцы, авто-кликер, крит-клик',
      },
    ],
  },
];