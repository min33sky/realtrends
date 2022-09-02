import type { RefObject } from 'react';
import { useEffect } from 'react';

export function useInfinityScroll(
  targetRef: RefObject<any>,
  fetchNext: () => void,
) {
  useEffect(() => {
    if (!targetRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchNext();
          }
        });
      },
      {
        root: targetRef.current.parentElement,
        rootMargin: '64px',
        threshold: 1, //? 1이면 완전 다 보여야 isIntersecting이 true가 된다.
      },
    );
    observer.observe(targetRef.current);
    return () => {
      observer.disconnect();
    };
  }, [fetchNext, targetRef]);
}
