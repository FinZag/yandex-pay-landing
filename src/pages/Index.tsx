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
