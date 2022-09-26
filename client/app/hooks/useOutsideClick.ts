import { useEffect, useRef } from 'react';

type Event = MouseEvent | TouchEvent;

/**
 * 특정 DOM 외부의 클릭 여부를 판단하는 Hook
 * @param handler 지정한 ref 범위 밖을 클릭 시 실행할 핸들러
 * @returns ref 특정 DOM을 참조하는 ref
 */
function useOutsideClick(handler: (event?: Event) => void) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const clickCheckListener = (e: Event) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler(e); //? ref.current 외부를 클릭했을 때 핸들러를 호출
    };

    document.addEventListener('mousedown', clickCheckListener);
    document.addEventListener('touchstart', clickCheckListener);

    return () => {
      document.removeEventListener('mousedown', clickCheckListener);
      document.removeEventListener('touchstart', clickCheckListener);
    };
  }, [handler, ref]);

  return ref;
}

export default useOutsideClick;
