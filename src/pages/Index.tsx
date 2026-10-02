import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Seo from '@/components/Seo';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Games from '@/components/Games';
import Payment from '@/components/Payment';
import Faq from '@/components/Faq';
import Contacts from '@/components/Contacts';
import Footer from '@/components/Footer';

const Index = () => {
  const { hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const scroll = () => document.querySelector(hash)?.scrollIntoView({ behavior: 'instant' });
    const frame = window.requestAnimationFrame(scroll);
    const timers = [150, 500, 1000].map((ms) => window.setTimeout(scroll, ms));
    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [hash, key]);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="FinGame — бесплатные инди-игры на Unity в RuStore"
        description="Инди-студия FinGame разрабатывает мобильные игры на Unity. Скачивайте бесплатно в RuStore и поддержите разработку добровольным взносом через ЮKassa."
        path="/"
      />
      <Header />
      <main>
        <Hero />
        <About />
        <Games />
        <Payment />
        <Faq />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
