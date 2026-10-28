import { createFileRoute } from "@tanstack/react-router";
import ThankYou from "@/pages/ThankYou";
import { seoHead } from "@/components/Seo";

export const Route = createFileRoute("/thanks")({
  head: () =>
    seoHead({
      title: "Спасибо за поддержку — FinGame",
      description: "Взнос принят. Спасибо, что поддерживаете разработку игр FinGame.",
      path: "/thanks",
      noindex: true,
    }),
  component: ThankYou,
});
