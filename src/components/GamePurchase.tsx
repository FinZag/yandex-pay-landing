import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import MailLink from "@/components/MailLink";
import { GAME_PURCHASE_URL } from "@/data/company";
import { useToast } from "@/hooks/use-toast";

type Product = { productId: string; title: string; amount: number };

const GamePurchase = ({
  gameId,
  gameTitle,
}: {
  gameId: string;
  gameTitle: string;
}) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [playerId, setPlayerId] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [soft, setSoft] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let stop = false;
    fetch(`${GAME_PURCHASE_URL}?gameId=${encodeURIComponent(gameId)}`)
      .then((r) => r.json())
      .then(
        (d) =>
          !stop && setProducts(Array.isArray(d.products) ? d.products : []),
      )
      .catch(() => !stop && setProducts([]));
    return () => {
      stop = true;
    };
  }, [gameId]);

  const product = products?.[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!/^[A-Za-z0-9_-]{1,64}$/.test(playerId.trim())) {
      setSoft(false);
      setError(
        "Укажите номер игрока — его видно в игре, в разделе «Настройки».",
      );
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setSoft(false);
      setError("Укажите корректный e-mail — на него придёт чек.");
      return;
    }
    if (!agree) {
      setSoft(false);
      setError(
        "Подтвердите согласие с офертой и политикой конфиденциальности.",
      );
      return;
    }

    setError(null);
    setSoft(false);
    setLoading(true);

    try {
      const res = await fetch(GAME_PURCHASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          productId: product.productId,
          playerId: playerId.trim(),
          email: email.trim(),
          returnUrl: window.location.origin,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.paymentUrl) {
        setSoft(Boolean(data.notConfigured));
        setError(data.error || "Не удалось создать платёж. Попробуйте позже.");
        return;
      }

      toast({
        title: "Переходим к оплате",
        description: `${product.title} — ${product.amount} ₽. Открывается защищённая страница ЮKassa.`,
      });
      window.location.href = data.paymentUrl;
    } catch {
      setSoft(false);
      setError(
        "Нет связи с платёжным сервисом. Проверьте интернет и попробуйте снова.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="purchase"
      className="mx-auto max-w-[1280px] px-5 pt-16 md:px-[76px] md:pt-24"
    >
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h2 className="font-head text-[22px] font-medium tracking-[-0.01em] md:text-[26px]">
          Покупки в игре
        </h2>
        <span className="text-[15px] text-muted-foreground">
          Картой или через СБП
        </span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <form
          onSubmit={submit}
          className="rounded-lg bg-secondary p-6 md:p-8"
          noValidate
        >
          {products === null ? (
            <p className="flex items-center gap-2 text-[15px] text-muted-foreground">
              <Icon name="LoaderCircle" size={18} className="animate-spin" />
              Загружаем список товаров
            </p>
          ) : !product ? (
            <p className="flex items-start gap-2 text-[15px] text-muted-foreground">
              <Icon name="Info" size={18} className="mt-0.5 shrink-0" />
              Покупки для этой игры временно недоступны. Загляните позже.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-head text-[18px] font-bold">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-[15px] leading-[1.35] text-muted-foreground">
                    Разовая покупка для {gameTitle}. Реклама пропадает навсегда,
                    подписки и автосписаний нет.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-background px-4 py-2 font-head text-[18px] font-bold">
                  {product.amount} ₽
                </span>
              </div>

              <label
                className="mt-7 block text-[15px] font-medium"
                htmlFor="buy-player"
              >
                Номер игрока
              </label>
              <input
                id="buy-player"
                value={playerId}
                onChange={(ev) => setPlayerId(ev.target.value.trim())}
                placeholder="player-42"
                autoComplete="off"
                className="mt-2 h-[52px] w-full rounded-[26px] bg-background px-5 text-[16px] outline-none ring-ring/40 placeholder:text-muted-foreground focus:ring-2"
              />
              <p className="mt-2 text-[13px] leading-[1.4] text-muted-foreground">
                Откройте игру → «Настройки» → «Номер игрока». По нему покупка
                попадёт именно в ваш профиль.
              </p>

              <label
                className="mt-5 block text-[15px] font-medium"
                htmlFor="buy-email"
              >
                E-mail для чека
              </label>
              <input
                id="buy-email"
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="you@example.com"
                className="mt-2 h-[52px] w-full rounded-[26px] bg-background px-5 text-[16px] outline-none ring-ring/40 placeholder:text-muted-foreground focus:ring-2"
              />

              <label className="mt-4 flex cursor-pointer items-start gap-3 text-[14px] leading-[1.4] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(ev) => setAgree(ev.target.checked)}
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[hsl(var(--primary))]"
                />
                <span>
                  Согласен с{" "}
                  <Link
                    to="/legal#offer"
                    className="text-foreground underline underline-offset-2"
                  >
                    договором оферты
                  </Link>{" "}
                  и{" "}
                  <Link
                    to="/legal#privacy"
                    className="text-foreground underline underline-offset-2"
                  >
                    политикой конфиденциальности
                  </Link>
                  , даю согласие на обработку персональных данных.
                </span>
              </label>

              {error && (
                <p
                  className={`mt-4 flex items-start gap-2 text-[14px] ${
                    soft ? "text-muted-foreground" : "text-destructive"
                  }`}
                >
                  <Icon
                    name={soft ? "Info" : "TriangleAlert"}
                    size={16}
                    className="mt-0.5 shrink-0"
                  />
                  {error}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="font-head text-[24px] font-bold">
                  Итого: {product.amount} ₽
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-[56px] items-center gap-2.5 rounded-[28px] bg-primary px-[30px] text-[17px] font-bold tracking-[-0.01em] text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Icon
                        name="LoaderCircle"
                        size={18}
                        className="animate-spin"
                      />
                      Создаём платёж
                    </>
                  ) : (
                    "Перейти к оплате"
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="space-y-6">
          <div className="rounded-lg bg-[linear-gradient(105deg,hsl(var(--banner-from))_0%,hsl(var(--banner-to))_100%)] p-6 md:p-8">
            <span className="inline-flex h-8 items-center rounded-full bg-badge px-3.5 text-[13px] font-bold text-badge-foreground">
              ЮKassa
            </span>
            <h3 className="mt-4 font-head text-[20px] font-bold leading-[1.15] tracking-[-0.02em]">
              Как проходит покупка
            </h3>
            <ol className="mt-4 space-y-3 text-[15px] leading-[1.4]">
              {[
                "Указываете номер игрока из настроек игры и e-mail.",
                "Платите картой или через СБП на защищённой форме ЮKassa.",
                "Возвращаетесь на сайт — покупка подтверждается автоматически.",
                "Открываете игру: реклама отключена, чек пришёл на почту.",
              ].map((t, n) => (
                <li key={t} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                    {n + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg bg-secondary p-6 md:p-8">
            <h3 className="font-head text-[18px] font-bold">Что важно знать</h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-[1.4] text-muted-foreground">
              <li className="flex gap-2.5">
                <Icon
                  name="Check"
                  size={18}
                  className="mt-0.5 shrink-0 text-ok"
                />
                <span>
                  Покупка разовая и бессрочная — платите один раз, подписки нет.
                </span>
              </li>
              <li className="flex gap-2.5">
                <Icon
                  name="Check"
                  size={18}
                  className="mt-0.5 shrink-0 text-ok"
                />
                <span>
                  Данные карты остаются у банка, сайт их не получает и не
                  хранит.
                </span>
              </li>
              <li className="flex gap-2.5">
                <Icon
                  name="Check"
                  size={18}
                  className="mt-0.5 shrink-0 text-ok"
                />
                <span>
                  Сама игра бесплатная — покупка нужна только для отключения
                  рекламы.
                </span>
              </li>
              <li className="flex gap-2.5">
                <Icon
                  name="Check"
                  size={18}
                  className="mt-0.5 shrink-0 text-ok"
                />
                <span>
                  Деньги списались, а реклама осталась — напишите на{" "}
                  <MailLink subject={`Покупка в игре ${gameTitle}`} /> с номером
                  заказа, решим вопрос.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamePurchase;
