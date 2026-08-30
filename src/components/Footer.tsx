import { company } from '@/data/company';

const Footer = () => {
  return (
    <footer className="mx-auto max-w-[1280px] px-5 pb-10 pt-16 md:px-[76px] md:pt-24">
      <div className="flex flex-col gap-4 rounded-[28px] bg-bar px-6 py-5 text-[15px] text-bar-foreground md:flex-row md:items-center md:justify-between md:py-0 md:pl-[26px] md:pr-3 lg:h-[56px]">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <b className="font-medium">{company.shortName}</b>
          <span className="hidden h-1 w-1 rounded-full bg-bar-foreground/45 md:block" />
          <span className="text-bar-foreground/85">
            ИНН {company.inn} · ОГРНИП {company.ogrnip}
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-bar-foreground/45 md:block" />
          <span className="text-bar-foreground/85">Возврат в течение 14 дней</span>
        </div>
        <a
          href="#legal"
          className="inline-flex h-9 shrink-0 items-center self-start rounded-[18px] bg-badge px-5 font-bold text-badge-foreground transition-transform hover:scale-[1.03] md:self-auto"
        >
          Реквизиты и оферта
        </a>
      </div>

      <p className="mt-5 text-center text-[14px] text-muted-foreground">
        © {new Date().getFullYear()} {company.brand}. {company.legalName}. Все права на игры и
        материалы сайта принадлежат правообладателю.
      </p>
    </footer>
  );
};

export default Footer;
