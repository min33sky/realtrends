import { useCallback, useRef } from 'react';
import { useItemOverride } from '~/contexts/ItemStatsContext';
import { likeItem, unlikeItem } from '~/lib/api/items';
import type { ItemStats } from '~/lib/api/types';

/**
 * 좋아요 관련 기능을 관리하는 커스텀 훅
 */
export function useLikeManager() {
  const { actions } = useItemOverride();

  const abortControllers = useRef(new Map<number, AbortController>()).current;

  const getAbortController = useCallback(
    (id: number) => {
      const controller = abortControllers.get(id);
      if (controller) {
        return controller;
      }
      const newController = new AbortController();
      abortControllers.set(id, newController);
      return newController;
    },
    [abortControllers],
  );

  const like = useCallback(
    async (id: number, initialStats: ItemStats) => {
      const controller = getAbortController(id);

      try {
        controller.abort();
        //? 클라이언트에서 값을 미리 변경하고 서버에서 응답받은 값으로 업데이트 한다.
        actions.set(id, {
          isLiked: true,
          ItemStats: {
            ...initialStats,
            likes: initialStats.likes + 1,
          },
        });

        const result = await likeItem(id);

        actions.set(id, {
          isLiked: true,
          ItemStats: result.ItemStats,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [actions, getAbortController],
  );

  const unlike = useCallback(
    async (id: number, initialStats: ItemStats) => {
      const controller = getAbortController(id);

      try {
        controller.abort();

        actions.set(id, {
          ItemStats: {
            ...initialStats,
            likes: initialStats.likes - 1,
          },
          isLiked: false,
        });

        const result = await unlikeItem(id);

        actions.set(id, {
          ItemStats: result.ItemStats,
          isLiked: false,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [actions, getAbortController],
  );

  return {
    like,
    unlike,
  };
}
