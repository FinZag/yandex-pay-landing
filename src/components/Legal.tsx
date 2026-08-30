import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { company } from '@/data/company';

const Legal = () => {
  return (
    <section id="legal" className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
      <div className="flex items-baseline justify-between">
        <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
          Документы
        </h2>
        <span className="text-[15px] text-muted-foreground">Оферта, политика, возврат</span>
      </div>

      <div className="mt-5 rounded-lg bg-secondary px-6 py-2 md:px-8">
        <Accordion type="single" collapsible defaultValue="offer">
          <AccordionItem value="offer">
            <AccordionTrigger className="text-left font-head text-[17px] font-bold hover:no-underline">
              Договор публичной оферты
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-6 text-[15px] leading-[1.5] text-muted-foreground">
              <p>
                1. {company.legalName} (далее — Продавец) публикует настоящий документ как публичную
                оферту на продажу цифровых товаров — компьютерных игр собственной разработки под
                брендом {company.brand}, а также на приём добровольных взносов в поддержку
                разработки.
              </p>
              <p>
                2. Оплата заказа на сайте означает полное и безоговорочное принятие условий оферты.
                Договор считается заключённым с момента зачисления денежных средств.
              </p>
              <p>
                3. Стоимость товара указана в каталоге в рублях РФ и включает все применимые налоги.
                Продавец вправе изменять цены; цена заказа фиксируется в момент оплаты.
              </p>
              <p>
                4. Товар передаётся в электронном виде: на указанный покупателем e-mail
                направляется ссылка на загрузку и лицензионный ключ в течение 15 минут после
                подтверждения платежа, но не позднее 24 часов.
              </p>
              <p>
                5. Покупатель получает простую неисключительную лицензию на использование игры в
                личных некоммерческих целях без права распространения и перепродажи.
              </p>
              <p>
                6. Стороны освобождаются от ответственности при обстоятельствах непреодолимой силы.
                Споры разрешаются путём переговоров, в остальном — по законодательству РФ.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="refund">
            <AccordionTrigger className="text-left font-head text-[17px] font-bold hover:no-underline">
              Условия оплаты, доставки и возврата
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-6 text-[15px] leading-[1.5] text-muted-foreground">
              <p>
                Оплата принимается банковскими картами Visa, Mastercard, «Мир», через СБП и сервис
                Яндекс Пэй. Обработка платежа происходит на стороне платёжного провайдера, реквизиты
                карты Продавцу не передаются.
              </p>
              <p>
                Доставка товара — электронная, на e-mail покупателя. Физическая отправка не
                производится, стоимость доставки не взимается.
              </p>
              <p>
                Возврат возможен в течение 14 календарных дней с момента оплаты, если файл игры не
                был загружен либо игра не запускается по технической причине на стороне Продавца.
                Заявление направляется на {company.email} с указанием даты платежа, суммы и
                e-mail заказа. Возврат производится тем же способом, которым была произведена
                оплата, в срок 3–10 рабочих дней.
              </p>
              <p>
                Добровольные взносы в поддержку разработки не являются оплатой товара и возврату не
                подлежат. Регулярные списания и подписки не оформляются.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="privacy" className="border-0">
            <AccordionTrigger className="text-left font-head text-[17px] font-bold hover:no-underline">
              Политика конфиденциальности
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-6 text-[15px] leading-[1.5] text-muted-foreground">
              <p>
                Оператор персональных данных — {company.legalName}, {company.address}, ИНН{' '}
                {company.inn}.
              </p>
              <p>
                Обрабатываются: адрес электронной почты, сумма и дата заказа, технические данные
                (IP-адрес, тип браузера, cookie-файлы веб-аналитики). Цель обработки — исполнение
                договора, отправка чека и лицензионного ключа, поддержка пользователей и учёт продаж.
              </p>
              <p>
                Правовое основание — согласие субъекта и исполнение договора. Данные хранятся на
                территории Российской Федерации не дольше, чем требуется для указанных целей и
                сроков налогового учёта.
              </p>
              <p>
                Данные не передаются третьим лицам, кроме платёжного провайдера и оператора
                фискальных данных в объёме, необходимом для проведения платежа и выдачи чека.
              </p>
              <p>
                Субъект вправе запросить сведения об обработке, потребовать уточнения, блокирования
                или удаления данных, отозвать согласие — письмом на {company.email}. Запрос
                рассматривается в течение 30 дней.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default Legal;
