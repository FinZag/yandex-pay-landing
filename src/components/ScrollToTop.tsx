import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }
    const scroll = () => document.querySelector(hash)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    const frame = window.requestAnimationFrame(scroll);
    const timers = [150, 500].map((ms) => window.setTimeout(scroll, ms));
    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
