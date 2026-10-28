import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/pages/Legal";
import { seoHead } from "@/components/Seo";

export const Route = createFileRoute("/legal")({
  head: () =>
    seoHead({
      title: "Документы и реквизиты — публичная оферта FinGame",
      description:
        "Публичная оферта, условия оплаты и возврата, политика конфиденциальности и банковские реквизиты ИП Финенко Л. В. — получателя добровольных взносов FinGame.",
      path: "/legal",
    }),
  component: LegalPage,
});
