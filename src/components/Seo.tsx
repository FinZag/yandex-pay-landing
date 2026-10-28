export const SITE_URL = 'https://fingame-coder.ru';

type SeoProps = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

// Page meta is produced by the route head() via seoHead(); the component is kept
// so existing pages stay unchanged.
export const seoHead = ({ title, description, path, noindex }: SeoProps) => {
  const url = `${SITE_URL}${path}`;
  const image = `${SITE_URL}/logo.jpg`;
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      ...(noindex ? [{ name: 'robots', content: 'noindex, follow' }] : []),
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'FinGame' },
      { property: 'og:locale', content: 'ru_RU' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1024' },
      { property: 'og:image:height', content: '1024' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
};

const Seo = (_props: SeoProps) => null;

export default Seo;
