import type React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const homeSections = [
  { href: '#about', label: 'О студии' },
  { href: '#games', label: 'Игры' },
  { href: '#payment', label: 'Поддержать' },
  { href: '#faq', label: 'Вопросы' },
  { href: '#contacts', label: 'Контакты' },
];

const useSectionNav = (onGo?: () => void) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    onGo?.();
    if (pathname === '/') {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `/${hash}`);
      return;
    }
    navigate(`/${hash}`);
  };
};

export default useSectionNav;
