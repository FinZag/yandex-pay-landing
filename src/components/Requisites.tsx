import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { company } from '@/data/company';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const rows: { label: string; value: string }[] = [
  { label: 'Полное наименование', value: company.legalName },
  { label: 'ИНН', value: company.inn },
  { label: 'ОГРНИП', value: company.ogrnip },
  { label: 'Расчётный счёт', value: company.account },
  { label: 'Банк', value: company.bankName },
  { label: 'Корр. счёт', value: company.corrAccount },
  { label: 'БИК', value: company.bik },
  { label: 'E-mail', value: company.email },
];

const Requisites = () => {
  const [copied, setCopied] = useState(false);

  const copyAll = async () => {
    const text = rows.map((r) => `${r.label}: ${r.value}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="requisites" className="mx-auto max-w-[1280px] px-5 pt-12 md:px-[76px] md:pt-16">
      <Accordion type="single" collapsible className="rounded-lg bg-secondary/60">
        <AccordionItem value="req" className="border-none">
          <AccordionTrigger className="px-6 py-4 text-left text-[15px] font-medium text-muted-foreground hover:no-underline">
            Реквизиты получателя платежей
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <dl className="divide-y divide-border/70 border-y border-border/70">
              {rows.map((r) => (
                <div
                  key={r.label}
                  className="grid gap-0.5 py-3 md:grid-cols-[240px_1fr] md:gap-6"
                >
                  <dt className="text-[14px] text-muted-foreground">{r.label}</dt>
                  <dd className="text-[15px]">{r.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={copyAll}
                className="inline-flex h-10 items-center gap-2 rounded-[20px] bg-background px-4 text-[14px] font-medium transition-colors hover:bg-border"
              >
                <Icon name={copied ? 'Check' : 'Copy'} size={16} />
                {copied ? 'Скопировано' : 'Скопировать'}
              </button>
              <p className="text-[13px] leading-[1.45] text-muted-foreground">
                Получателем платежей является {company.legalName}.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default Requisites;
