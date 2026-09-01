import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Games from '@/components/Games';
import Payment from '@/components/Payment';
import Requisites from '@/components/Requisites';
import Legal from '@/components/Legal';
import Faq from '@/components/Faq';
import Contacts from '@/components/Contacts';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Games />
        <Payment />
        <Requisites />
        <Legal />
        <Faq />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
