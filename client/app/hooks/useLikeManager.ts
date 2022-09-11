import { useCallback, useRef } from 'react';
import { likeItem, unlikeItem } from '~/lib/api/items';
import type { ItemStats } from '~/lib/api/types';
import { useItemOverrideSetter } from '~/stores/useItemOverrideStore';

/**
 * 좋아요 관련 기능을 관리하는 커스텀 훅
 */
export function useLikeManager() {
  // const { actions } = useItemOverride();
  const set = useItemOverrideSetter();

  //? 인터넷 속도가 느릴 때 중복 요청이 발생한다면 이전 요청을 취소한다.
  const abortControllers = useRef(new Map<number, AbortController>()).current; //? Item의 Id와 취소 컨트롤러를 저장해 놓는다.

  const like = useCallback(
    async (id: number, initialStats: ItemStats) => {
      const prevController = abortControllers.get(id);

      try {
        prevController?.abort(); //? 현재 Item의 진행중인 좋아요 요청을 취소

        //? 클라이언트에서 값을 미리 변경하고 서버에서 응답받은 값으로 업데이트 한다.
        set(id, {
          isLiked: true,
          ItemStats: {
            ...initialStats,
            likes: initialStats.likes + 1,
          },
        });

        const controller = new AbortController();
        abortControllers.set(id, controller); //? 현재 요청을 저장
        const result = await likeItem(id, controller);
        abortControllers.delete(id); //? 현재 요청이 끝났으니 맵에서 삭제

        set(id, {
          isLiked: true,
          ItemStats: result.ItemStats,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [abortControllers, set],
  );

  const unlike = useCallback(
    async (id: number, initialStats: ItemStats) => {
      const prevController = abortControllers.get(id);

      try {
        prevController?.abort();

        set(id, {
          ItemStats: {
            ...initialStats,
            likes: initialStats.likes - 1,
          },
          isLiked: false,
        });

        const controller = new AbortController();
        abortControllers.set(id, controller);
        const result = await unlikeItem(id, controller);
        abortControllers.delete(id);

        set(id, {
          ItemStats: result.ItemStats,
          isLiked: false,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [abortControllers, set],
  );

  return {
    like,
    unlike,
  };
}
