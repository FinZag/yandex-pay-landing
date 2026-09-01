import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import MailLink from '@/components/MailLink';

const items = [
  {
    id: 'free',
    q: 'Игры действительно бесплатны?',
    a: (
      <>
        Да. Все игры студии скачиваются в RuStore бесплатно и полностью. Внутри нет обязательных
        покупок, платных подсказок и подписок — контент открыт с первого запуска.
      </>
    ),
  },
  {
    id: 'money',
    q: 'Куда идут добровольные взносы?',
    a: (
      <>
        На разработку и поддержку игр: работу над новыми уровнями, исправление ошибок, оплату
        аккаунтов разработчика и серверов. Взнос — по желанию, он не даёт преимуществ в игре и не
        является оплатой товара или услуги.
      </>
    ),
  },
  {
    id: 'refund',
    q: 'Можно ли вернуть отправленный взнос?',
    a: (
      <>
        Да, если платёж был ошибочным. Напишите на <MailLink subject="Заявление на возврат платежа" />{' '}
        с датой, суммой и почтой плательщика — вернём тем же способом в срок 3–10 рабочих дней.
      </>
    ),
  },
  {
    id: 'support',
    q: 'Как связаться с поддержкой?',
    a: (
      <>
        Через форму в разделе «Контакты» или письмом на <MailLink />. Отвечаем в течение одного
        рабочего дня, обычно быстрее.
      </>
    ),
  },
];

const Faq = () => {
  return (
    <section id="faq" className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
      <div className="flex items-baseline justify-between">
        <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
          Частые вопросы
        </h2>
        <span className="text-[15px] text-muted-foreground">Коротко о главном</span>
      </div>

      <div className="mt-5 rounded-lg bg-secondary px-6 py-2 md:px-8">
        <Accordion type="single" collapsible>
          {items.map((it) => (
            <AccordionItem key={it.id} value={it.id} className="last:border-none">
              <AccordionTrigger className="text-left font-head text-[17px] font-bold hover:no-underline">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-[15px] leading-[1.5] text-muted-foreground">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
