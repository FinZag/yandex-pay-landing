import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { company } from '@/data/company';

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

const LegalRequisites = () => {
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
    <section id="requisites" className="scroll-mt-28 rounded-lg bg-secondary p-6 md:p-8">
      <h2 className="font-head text-[22px] font-bold tracking-[-0.01em] md:text-[26px]">
        Реквизиты получателя платежей
      </h2>
      <p className="mt-2 text-[15px] leading-[1.45] text-muted-foreground">
        Получателем добровольных взносов является {company.legalName}.
      </p>

      <dl className="mt-5 divide-y divide-border/70 border-y border-border/70">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-0.5 py-3 md:grid-cols-[240px_1fr] md:gap-6">
            <dt className="text-[14px] text-muted-foreground">{r.label}</dt>
            <dd className="text-[15px] break-words">{r.value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={copyAll}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-[20px] bg-background px-4 text-[14px] font-medium transition-colors hover:bg-border"
      >
        <Icon name={copied ? 'Check' : 'Copy'} size={16} />
        {copied ? 'Скопировано' : 'Скопировать реквизиты'}
      </button>
    </section>
  );
};

export default LegalRequisites;
