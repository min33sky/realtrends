import { useCallback } from 'react';
import { useItemStats } from '~/contexts/ItemStatsContext';
import { likeItem } from '~/lib/api/items';
import type { ItemStats } from '~/lib/api/types';

export function useLikeManager() {
  const { actions } = useItemStats();

  const like = useCallback(
    async (id: number, initialStats: ItemStats) => {
      try {
        //? 클라이언트에서 값을 미리 변경하고 서버에서 응답받은 값으로 업데이트 한다.
        actions.set(id, { ...initialStats, likes: initialStats.likes + 1 });
        const result = await likeItem(id);
        actions.set(id, result.ItemStats);
      } catch (error) {
        console.error(error);
      }
    },
    [actions],
  );

  const unlike = useCallback(
    async (id: number, initialStats: ItemStats) => {
      try {
        actions.set(id, { ...initialStats, likes: initialStats.likes - 1 });
        const result = await likeItem(id);
        actions.set(id, result.ItemStats);
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
