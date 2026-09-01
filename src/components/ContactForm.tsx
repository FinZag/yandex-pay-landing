import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { CONTACT_URL } from '@/data/company';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Не удалось отправить');
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      toast({
        title: 'Сообщение не отправилось',
        description: err instanceof Error ? err.message : 'Попробуйте написать нам на почту',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-lg bg-secondary p-6 md:p-8">
        <Icon name="CheckCircle2" size={26} className="text-ok" />
        <h3 className="mt-3 font-head text-[19px] font-bold">Сообщение отправлено</h3>
        <p className="mt-1 text-[15px] leading-[1.45] text-muted-foreground">
          Ответим на указанную почту в течение одного рабочего дня.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-[20px] bg-background px-4 text-[14px] font-medium transition-colors hover:bg-border"
        >
          Написать ещё
        </button>
      </div>
    );
  }

  const field =
    'h-12 w-full rounded-[14px] border border-border bg-background px-4 text-[16px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground';

  return (
    <form onSubmit={submit} className="rounded-lg bg-secondary p-6 md:p-8">
      <h3 className="font-head text-[19px] font-bold">Написать нам</h3>
      <p className="mt-1 text-[15px] text-muted-foreground">
        Вопрос по игре, платежу или сотрудничеству — напишите, разберёмся.
      </p>

      <div className="mt-5 grid gap-3">
        <input
          className={field}
          placeholder="Как к вам обращаться"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={200}
        />
        <input
          className={field}
          type="email"
          placeholder="Ваш e-mail для ответа"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          className="min-h-[120px] w-full resize-y rounded-[14px] border border-border bg-background px-4 py-3 text-[16px] leading-[1.45] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
          placeholder="Сообщение"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={4000}
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="mt-4 inline-flex h-[52px] items-center justify-center gap-2 rounded-[26px] bg-primary px-7 font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60"
      >
        {sending ? 'Отправляем…' : 'Отправить'}
        <Icon name={sending ? 'Loader2' : 'Send'} size={17} className={sending ? 'animate-spin' : ''} />
      </button>

      <p className="mt-3 text-[13px] leading-[1.45] text-muted-foreground">
        Отправляя сообщение, вы соглашаетесь на обработку указанных данных для ответа на обращение.
      </p>
    </form>
  );
};

export default ContactForm;
