import produce from 'immer';
import create from 'zustand';
import type { ItemStats } from '~/lib/api/types';

//? Item의 좋아요 여부, Item과 관련된 정보를 관리하는 스토어

interface OverridableItem {
  isLiked: boolean;
  ItemStats: ItemStats;
}

interface ItemOverrideStore {
  overrides: {
    [key: number]: OverridableItem | undefined;
  };
  set: (itemId: number, overridableItem: OverridableItem) => void;
}

export const useItemOverrideStore = create<ItemOverrideStore>((set) => ({
  overrides: {},
  set(itemId, overridableItem) {
    set((store) =>
      produce(store, (draft) => {
        draft.overrides[itemId] = overridableItem;
      }),
    );
  },
}));

/**
 * 현재 글의 상세 정보들을 캐시해두는 스토어에서 가져오는 함수
 * @param itemId 현재 글의 ID
 * @returns 좋아요 등등 정보
 */
export function useItemOverrideById(itemId: number) {
  const { overrides } = useItemOverrideStore();
  return overrides[itemId];
}

/**
 * 현재 글의 상세 정보를 스토어에 캐시해두는 함수
 */
export function useItemOverrideSetter() {
  return useItemOverrideStore((store) => store.set);
}
