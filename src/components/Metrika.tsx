import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const COUNTER_ID = 112836320;

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

const Metrika = () => {
  const { pathname, search } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.ym?.(COUNTER_ID, 'hit', pathname + search, {
      referer: document.referrer,
      title: document.title,
    });
  }, [pathname, search]);

  return null;
};

export default Metrika;
