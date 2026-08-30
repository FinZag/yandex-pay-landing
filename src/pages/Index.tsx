import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Games from '@/components/Games';
import Payment from '@/components/Payment';
import Requisites from '@/components/Requisites';
import Legal from '@/components/Legal';
import Contacts from '@/components/Contacts';
import Footer from '@/components/Footer';
import type { Game } from '@/data/company';
import { useToast } from '@/hooks/use-toast';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
};

const Index = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const scrollToPayment = () => {
    document.getElementById('payment')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const addItem = (game: Game) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === game.id);
      if (found) {
        return prev.map((i) => (i.id === game.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: game.id, title: game.title, price: game.price, qty: 1 }];
    });
    toast({
      title: 'Добавлено в заказ',
      description: `${game.title} — ${game.priceLabel}`,
    });
    scrollToPayment();
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={items.reduce((s, i) => s + i.qty, 0)}
        onCartClick={scrollToPayment}
      />
      <main>
        <Hero />
        <Games onAdd={addItem} />
        <Payment items={items} onRemove={removeItem} onClear={() => setItems([])} />
        <Requisites />
        <Legal />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
