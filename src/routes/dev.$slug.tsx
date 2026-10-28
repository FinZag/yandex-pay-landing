import { createFileRoute } from "@tanstack/react-router";
import DevGate from "@/components/DevGate";
import DevDocs from "@/pages/DevDocs";
import { seoHead } from "@/components/Seo";
import { games } from "@/data/company";

const DevPage = () => (
  <DevGate>
    <DevDocs />
  </DevGate>
);

export const Route = createFileRoute("/dev/$slug")({
  head: ({ params }) => {
    const game = games.find((g) => g.slug === params.slug) ?? games[0];
    return seoHead({
      title: `Инструкция для разработчика — покупки в игре ${game.title}`,
      description: `Техническая инструкция: адрес проверки покупок, коды товаров и пример ответа сервера для игры ${game.title}.`,
      path: `/dev/${game.slug}`,
      noindex: true,
    });
  },
  component: DevPage,
});
