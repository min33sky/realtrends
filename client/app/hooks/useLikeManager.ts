import { useCallback, useRef } from 'react';
import { useItemOverride } from '~/contexts/ItemStatsContext';
import { likeItem, unlikeItem } from '~/lib/api/items';
import type { ItemStats } from '~/lib/api/types';

/**
 * 좋아요 관련 기능을 관리하는 커스텀 훅
 */
export function useLikeManager() {
  const { actions } = useItemOverride();
  const concurrentCounterRef = useRef<Map<number, number>>(new Map()); //? 추가 요청을 막기위해 사용

  const like = useCallback(
    async (id: number, initialStats: ItemStats) => {
      const counters = concurrentCounterRef.current;

      try {
        //? 클라이언트에서 값을 미리 변경하고 서버에서 응답받은 값으로 업데이트 한다.
        actions.set(id, {
          isLiked: true,
          ItemStats: {
            ...initialStats,
            likes: initialStats.likes + 1,
          },
        });

        const counter = (counters.get(id) ?? 0) + 1;
        counters.set(id, counter);
        const result = await likeItem(id);

        if (counters.get(id) !== counter) return;

        actions.set(id, {
          isLiked: true,
          ItemStats: result.ItemStats,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [actions],
  );

  const unlike = useCallback(
    async (id: number, initialStats: ItemStats) => {
      const counters = concurrentCounterRef.current;

      try {
        actions.set(id, {
          ItemStats: {
            ...initialStats,
            likes: initialStats.likes - 1,
          },
          isLiked: false,
        });
        const counter = (counters.get(id) ?? 0) - 1;
        counters.set(id, counter);
        const result = await unlikeItem(id);
        if (counters.get(id) !== counter) return;
        actions.set(id, {
          ItemStats: result.ItemStats,
          isLiked: false,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [actions],
  );

  return {
    like,
    unlike,
  };
}
