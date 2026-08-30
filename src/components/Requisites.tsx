import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { company } from '@/data/company';

const rows: { label: string; value: string }[] = [
  { label: 'Полное наименование', value: company.legalName },
  { label: 'Сокращённо', value: company.shortName },
  { label: 'ИНН', value: company.inn },
  { label: 'ОГРНИП', value: company.ogrnip },
  { label: 'Юридический адрес', value: company.address },
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
    <section id="requisites" className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
          Реквизиты получателя платежей
        </h2>
        <button
          type="button"
          onClick={copyAll}
          className="inline-flex h-11 items-center gap-2 rounded-[22px] bg-secondary px-5 text-[15px] font-medium transition-colors hover:bg-border"
        >
          <Icon name={copied ? 'Check' : 'Copy'} size={17} />
          {copied ? 'Скопировано' : 'Скопировать реквизиты'}
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg bg-secondary">
        <dl className="divide-y divide-border">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-1 px-6 py-4 md:grid-cols-[280px_1fr] md:gap-6">
              <dt className="text-[15px] text-muted-foreground">{r.label}</dt>
              <dd className="text-[16px] font-medium">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-4 text-[14px] leading-[1.45] text-muted-foreground">
        Получателем платежей является {company.legalName}. Деятельность ведётся на территории
        Российской Федерации.
      </p>
    </section>
  );
};

export default Requisites;