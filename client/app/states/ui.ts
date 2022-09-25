import { useEffect } from 'react';
import { sangte, useSangteStore, useSangteValue, useSetSangte } from 'sangte';

//? 이 프로젝트에서는 사용 안함

const isMultiColumn = sangte(false);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useIsMultiColumn() {
  return useSangteValue(isMultiColumn);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useIsMultiColumnCheck() {
  const set = useSetSangte(isMultiColumn);
  const store = useSangteStore(isMultiColumn);

  useEffect(() => {
    if (window.innerWidth > 768) {
      set(true);
    } else {
      set(false);
    }

    const onResize = () => {
      const nextValue = window.innerWidth > 768;
      if (store.getState() !== nextValue) {
        set(nextValue);
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [set, store]);
}
