import { company } from '@/data/company';

const MailLink = ({ subject }: { subject?: string }) => (
  <a
    href={`mailto:${company.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`}
    className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
  >
    {company.email}
  </a>
);

export default MailLink;
