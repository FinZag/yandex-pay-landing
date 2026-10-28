import { createFileRoute } from "@tanstack/react-router";
import PayDone from "@/pages/PayDone";
import { seoHead } from "@/components/Seo";

export const Route = createFileRoute("/pay/done")({
  head: () =>
    seoHead({
      title: "Оплата — FinGame",
      description: "Статус оплаты покупки.",
      path: "/pay/done",
      noindex: true,
    }),
  component: PayDone,
});
