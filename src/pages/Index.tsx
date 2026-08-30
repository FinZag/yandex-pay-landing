import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Games from '@/components/Games';
import Payment from '@/components/Payment';
import Requisites from '@/components/Requisites';
import Legal from '@/components/Legal';
import Contacts from '@/components/Contacts';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Games />
        <Payment />
        <Requisites />
        <Legal />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
