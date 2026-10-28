import { createFileRoute } from '@tanstack/react-router';
import NewsPage from '@/pages/News';
import { seoHead } from '@/components/Seo';

export const Route = createFileRoute('/news')({
  head: () =>
    seoHead({
      title: 'Новости FinGame — релизы и обновления игр для Android',
      description:
        'Новости студии FinGame: выход новых игр в RuStore, обновления, анонсы и предзаказы. ByteTrace, Масло Кликер, Кооператив №6, Лавка маленькой ведьмы.',
      path: '/news',
    }),
  component: NewsPage,
});
