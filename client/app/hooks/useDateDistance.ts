import { formatDistanceToNow } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { useEffect, useMemo, useReducer } from 'react';

export function useDateDistance(date: string | Date) {
  const [value, rerender] = useReducer((state) => !state, false);

  useEffect(() => {
    //? 1분마다 Hook을 재호출
    const interval = setInterval(rerender, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  const formatted = useMemo(() => {
    const d = date instanceof Date ? date : new Date(date);
    const diff = Date.now() - d.getTime();

    //? 1분 이내일 경우에는 '방금 전'으로 표시
    if (diff < 60 * 1000) {
      return '방금 전';
    }

    return formatDistanceToNow(d, {
      locale: ko,
      addSuffix: true,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, value]);

  return formatted;
}
