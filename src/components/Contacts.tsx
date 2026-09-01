import Icon from '@/components/ui/icon';
import { company } from '@/data/company';
import ContactForm from '@/components/ContactForm';

const Contacts = () => {
  return (
    <section id="contacts" className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
      <div className="flex items-baseline justify-between">
        <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
          Контакты
        </h2>
        <span className="text-[15px] text-muted-foreground">{company.answerTime}</span>
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <ContactForm />

        <div className="flex flex-col gap-6">
          <a
            href={`mailto:${company.email}`}
            className="group rounded-lg bg-secondary p-6 transition-colors hover:bg-border md:p-8"
          >
            <Icon name="Mail" size={22} />
            <h3 className="mt-4 font-head text-[17px] font-bold">Почта поддержки</h3>
            <p className="mt-1 text-[16px] text-muted-foreground group-hover:text-foreground">
              {company.email}
            </p>
          </a>

          <div className="flex-1 rounded-lg bg-secondary p-6 md:p-8">
            <Icon name="Clock" size={22} />
            <h3 className="mt-4 font-head text-[17px] font-bold">Как мы работаем</h3>
            <p className="mt-1 text-[15px] leading-[1.5] text-muted-foreground">
              {company.answerTime}. Деятельность ведётся дистанционно, офис для очного посещения не
              предусмотрен — все обращения принимаются через форму или по электронной почте.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
