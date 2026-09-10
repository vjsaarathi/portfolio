import { useEffect, useRef } from 'react';

interface ScrollToTopProps {
  route: string;
}

export function ScrollToTop({ route }: ScrollToTopProps) {
  const prevRoute = useRef(route);

  useEffect(() => {
    if (prevRoute.current !== route) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      prevRoute.current = route;
    }
  }, [route]);

  return null;
}
