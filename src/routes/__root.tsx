import type {ReactNode} from "react";
import {HeadContent, Outlet, Scripts, createRootRoute} from "@tanstack/react-router";
import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {PLATFORM_META, PLATFORM_SCRIPTS} from "@/platform/scripts.gen";
import {HMR_CLIENT} from "@/platform/dev-hmr";
import appCss from "@/index.css?url";

import Metrika from "@/components/Metrika";
import ScrollToTop from "@/components/ScrollToTop";
import NotFound from "@/pages/NotFound";

const TITLE = "FinGame — бесплатные инди-игры на Unity в RuStore";
const DESCRIPTION =
    "Инди-студия FinGame разрабатывает мобильные игры на Unity. Скачивайте бесплатно в RuStore и поддержите разработку добровольным взносом через ЮKassa.";
const OG_DESCRIPTION =
    "Инди-студия FinGame разрабатывает мобильные игры на Unity. Скачивайте бесплатно в RuStore и поддержите разработку через ЮKassa.";
const OG_IMAGE = "https://fingame-coder.ru/logo.jpg";

const JSON_LD = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FinGame",
    legalName: "Индивидуальный предприниматель Финенко Лариса Валерьевна",
    taxID: "253304385316",
    url: "https://fingame-coder.ru/",
    logo: "https://fingame-coder.ru/logo.jpg",
    email: "game-fin-ip@yandex.ru",
    description: "Инди-студия разработки мобильных игр на Unity.",
    contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "game-fin-ip@yandex.ru",
        availableLanguage: "Russian",
    },
});

const METRIKA_1 = `(function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
    k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(101026698, "init", { trustedDomains: ["poehali.dev"], clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true, trackHash: true });`;

const METRIKA_2 = `window.dataLayer = window.dataLayer || [];
(function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
    k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=112836320", "ym");
ym(112836320, "init", { ssr: true, webvisor: true, clickmap: true, ecommerce: "dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce: true, trackLinks: true });`;

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {charSet: "utf-8"},
            {name: "viewport", content: "width=device-width, initial-scale=1.0"},
            {title: TITLE},
            {name: "description", content: DESCRIPTION},
            {name: "author", content: "ИП Финенко Лариса Валерьевна"},
            {property: "og:type", content: "website"},
            {property: "og:site_name", content: "FinGame"},
            {property: "og:locale", content: "ru_RU"},
            {property: "og:url", content: "https://fingame-coder.ru/"},
            {property: "og:title", content: TITLE},
            {property: "og:description", content: OG_DESCRIPTION},
            {property: "og:image", content: OG_IMAGE},
            {property: "og:image:width", content: "1024"},
            {property: "og:image:height", content: "1024"},
            {name: "twitter:card", content: "summary_large_image"},
            {name: "twitter:title", content: TITLE},
            {name: "twitter:description", content: "Скачивайте игры бесплатно в RuStore и поддержите разработку через ЮKassa."},
            {name: "twitter:image", content: OG_IMAGE},
            {name: "theme-color", content: "#080c17"},
            ...PLATFORM_META,
        ],
        links: [
            {rel: "stylesheet", href: appCss},
            {rel: "icon", type: "image/svg+xml", href: "/favicon.svg"},
            {rel: "apple-touch-icon", href: "/logo.jpg"},
            {rel: "preconnect", href: "https://fonts.googleapis.com"},
            {rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous"},
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;700;800&family=Russo+One&display=swap",
            },
        ],
        // IMPORTANT: DO NOT REMOVE PLATFORM SCRIPTS AND THE DEV HMR CLIENT!
        scripts: [
            ...(import.meta.env.DEV ? [{children: HMR_CLIENT}] : []),
            ...PLATFORM_SCRIPTS,
            {type: "application/ld+json", children: JSON_LD},
            {children: METRIKA_1},
            {children: METRIKA_2},
        ],
    }),
    component: RootComponent,
    notFoundComponent: NotFound,
});

function RootComponent() {
    return (
        <RootDocument>
            <TooltipProvider>
                <Toaster/>
                <Sonner/>
                <Metrika/>
                <ScrollToTop/>
                <Outlet/>
            </TooltipProvider>
        </RootDocument>
    );
}

function RootDocument({children}: { children: ReactNode }) {
    return (
        <html lang="ru">
        <head>
            <HeadContent/>
        </head>
        <body>
        {children}
        <Scripts/>
        </body>
        </html>
    );
}
