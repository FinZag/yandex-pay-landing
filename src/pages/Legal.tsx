import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import MailLink from '@/components/MailLink';
import LegalRequisites from '@/components/LegalRequisites';
import { company } from '@/data/company';

const nav = [
  { href: '#offer', label: 'Публичная оферта' },
  { href: '#refund', label: 'Оплата и возврат' },
  { href: '#privacy', label: 'Политика конфиденциальности' },
  { href: '#requisites', label: 'Реквизиты' },
];

const LegalPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 md:h-[92px] md:px-[76px]">
          <Link to="/" className="flex items-center gap-2.5" aria-label="FinGame — на главную">
            <img
              src="/logo-mark.jpg"
              alt=""
              className="h-[38px] w-[38px] rounded-[11px] object-cover"
            />
            <span className="font-head text-[24px] font-bold tracking-[-0.02em]">
              Fin<span className="cond">Game</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex h-[46px] items-center gap-2 rounded-[23px] bg-secondary px-5 text-[15px] font-medium transition-colors hover:bg-border"
          >
            <Icon name="ArrowLeft" size={18} />
            На главную
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-5 pb-16 pt-6 md:px-[76px] md:pb-24">
        <h1 className="font-head text-[30px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[42px]">
          Документы и реквизиты
        </h1>
        <p className="mt-3 max-w-[720px] text-[16px] leading-[1.45] text-muted-foreground">
          Условия приёма добровольных взносов, порядок возврата, обработка персональных данных и
          банковские реквизиты получателя платежей. Редакция от 1 сентября 2026 года.
        </p>

        <nav className="mt-6 flex flex-wrap gap-2">
          {nav.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="inline-flex h-10 items-center rounded-[20px] bg-secondary px-4 text-[14px] font-medium transition-colors hover:bg-border"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <article className="mt-10 space-y-6">
          <section id="offer" className="scroll-mt-28 rounded-lg bg-secondary p-6 md:p-8">
            <h2 className="font-head text-[22px] font-bold tracking-[-0.01em] md:text-[26px]">
              Договор публичной оферты
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-[1.55] text-muted-foreground">
              <p>
                1. {company.legalName} (далее — Получатель) публикует настоящий документ как
                публичную оферту на приём добровольных денежных взносов в поддержку разработки
                компьютерных игр под брендом {company.brand}.
              </p>
              <p>
                2. Игры доступны для бесплатного скачивания в магазине приложений RuStore. Сайт не
                осуществляет продажу товаров и услуг, встречное предоставление за взнос не
                предусмотрено.
              </p>
              <p>
                3. Внутриигровые покупки и показ рекламы, доступные в самих играх, к настоящей
                оферте отношения не имеют. Такие покупки совершаются в приложении и обрабатываются
                магазином приложений RuStore по его правилам; сайт в этих расчётах не участвует. По
                вопросам внутриигровых покупок обращайтесь в поддержку RuStore или на{' '}
                <MailLink subject="Вопрос по внутриигровой покупке" />.
              </p>
              <p>
                4. Приём взносов на сайте производится через платёжный сервис Яндекс Пэй. Данные
                банковской карты вводятся на стороне платёжного сервиса, Получателю не передаются и
                на сайте не хранятся.
              </p>
              <p>
                5. Перечисление средств на сайте означает полное и безоговорочное принятие условий
                оферты. Договор считается заключённым с момента зачисления денежных средств.
              </p>
              <p>
                6. Сумму взноса плательщик определяет самостоятельно, минимальная сумма — 100
                рублей. Валюта расчётов — российский рубль. Подписки и регулярные списания не
                оформляются.
              </p>
              <p>
                7. Средства направляются на разработку и поддержку игр студии. Получатель
                самостоятельно определяет порядок их расходования.
              </p>
              <p>
                8. Стороны освобождаются от ответственности при обстоятельствах непреодолимой силы.
                Споры разрешаются путём переговоров, в остальном — по законодательству Российской
                Федерации.
              </p>
            </div>
          </section>

          <section id="refund" className="scroll-mt-28 rounded-lg bg-secondary p-6 md:p-8">
            <h2 className="font-head text-[22px] font-bold tracking-[-0.01em] md:text-[26px]">
              Условия оплаты и возврата
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-[1.55] text-muted-foreground">
              <p>
                Платежи принимаются банковскими картами Visa, Mastercard, «Мир», через СБП и сервис
                Яндекс Пэй. Обработка платежа происходит на стороне платёжного провайдера, реквизиты
                карты Получателю не передаются.
              </p>
              <p>
                Игры доступны для бесплатной загрузки в RuStore. Физическая или электронная доставка
                товара не производится, стоимость доставки не взимается.
              </p>
              <p>
                Ошибочный или непреднамеренный платёж возвращается в течение 14 календарных дней с
                момента списания. Заявление направляется на{' '}
                <MailLink subject="Заявление на возврат платежа" /> с указанием даты платежа, суммы
                и e-mail плательщика. Возврат производится тем же способом, которым был совершён
                платёж, в срок 3–10 рабочих дней.
              </p>
              <p>
                Регулярные списания и подписки не оформляются, повторный платёж совершается только
                по инициативе плательщика.
              </p>
              <p>Чек об оплате направляется на указанный плательщиком e-mail в течение 15 минут.</p>
            </div>
          </section>

          <section id="privacy" className="scroll-mt-28 rounded-lg bg-secondary p-6 md:p-8">
            <h2 className="font-head text-[22px] font-bold tracking-[-0.01em] md:text-[26px]">
              Политика конфиденциальности
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-[1.55] text-muted-foreground">
              <p>
                Оператор персональных данных — {company.legalName}, ИНН {company.inn}.
              </p>
              <p>
                Обрабатываются: адрес электронной почты, сумма и дата платежа, имя и текст
                обращения, отправленного через форму обратной связи, технические данные (IP-адрес,
                тип браузера, cookie-файлы веб-аналитики). Цель обработки — приём платежа, отправка
                чека, поддержка пользователей и бухгалтерский учёт.
              </p>
              <p>
                Правовое основание — согласие субъекта персональных данных и исполнение договора.
                Данные хранятся на территории Российской Федерации не дольше, чем требуется для
                указанных целей и сроков налогового учёта.
              </p>
              <p>
                Данные не передаются третьим лицам, кроме платёжного провайдера и оператора
                фискальных данных в объёме, необходимом для проведения платежа и выдачи чека.
              </p>
              <p>
                Субъект вправе запросить сведения об обработке, потребовать уточнения, блокирования
                или удаления данных, отозвать согласие — письмом на{' '}
                <MailLink subject="Запрос по персональным данным" />. Запрос рассматривается в
                течение 30 дней.
              </p>
            </div>
          </section>

          <LegalRequisites />
        </article>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/#payment"
            className="inline-flex h-[56px] items-center gap-2.5 rounded-[28px] bg-primary px-[30px] text-[17px] font-bold tracking-[-0.01em] text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Вернуться к взносу
            <Icon name="ArrowRight" size={20} />
          </Link>
          <p className="text-[14px] text-muted-foreground">
            Вопросы по документам — <MailLink subject="Вопрос по документам" />
          </p>
        </div>
      </main>
    </div>
  );
};

export default LegalPage;
