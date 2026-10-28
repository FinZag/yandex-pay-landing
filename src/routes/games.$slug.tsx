import { createFileRoute, redirect } from "@tanstack/react-router";
import GamePage from "@/pages/GamePage";
import { seoHead } from "@/components/Seo";
import { games } from "@/data/company";

export const Route = createFileRoute("/games/$slug")({
  beforeLoad: ({ params }) => {
    if (!games.some((g) => g.slug === params.slug)) {
      throw redirect({ to: "/", replace: true });
    }
  },
  head: ({ params }) => {
    const game = games.find((g) => g.slug === params.slug);
    if (!game) return {};
    return seoHead({
      title: `${game.title} — ${game.genre} для Android | FinGame`,
      description: game.comingSoon
        ? `${game.description} Игра в разработке, скоро в RuStore.`
        : `${game.description} Бесплатно в RuStore, отключение рекламы — разовая покупка.`,
      path: `/games/${game.slug}`,
    });
  },
  component: GamePage,
});
