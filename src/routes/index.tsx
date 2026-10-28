import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import { seoHead } from "@/components/Seo";

export const Route = createFileRoute("/")({
  head: () =>
    seoHead({
      title: "FinGame — бесплатные инди-игры на Unity в RuStore",
      description:
        "Инди-студия FinGame разрабатывает мобильные игры на Unity. Скачивайте бесплатно в RuStore и поддержите разработку добровольным взносом через ЮKassa.",
      path: "/",
    }),
  component: Index,
});
