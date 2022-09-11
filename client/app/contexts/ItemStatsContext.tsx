//! Deprecated /

import { createContext, useContext, useMemo, useState } from 'react';
import type { ItemStats } from '~/lib/api/types';

interface OverridableItem {
  isLiked: boolean;
  ItemStats: ItemStats;
}

interface ItemOverrideContextState {
  [key: number]: OverridableItem;
}

interface ItemOverrideContextActions {
  set: (itemId: number, overridableItem: OverridableItem) => void;
}

interface ItemOverrideContextType {
  state: ItemOverrideContextState;
  actions: ItemOverrideContextActions;
}

interface Props {
  children: React.ReactNode;
}

const ItemOverrideContext = createContext<ItemOverrideContextType | null>(null);

/**
 * ## Deprecated
 * @deprecated use useItemOverrideState instead
 */
export function ItemOverrideProvider({ children }: Props) {
  const [state, setState] = useState<ItemOverrideContextState>({});

  const actions: ItemOverrideContextActions = useMemo(
    () => ({
      set(itemId, overridableItem) {
        setState((prev) => ({
          ...prev,
          [itemId]: overridableItem,
        }));
      },
    }),
    [],
  );

  return (
    <ItemOverrideContext.Provider value={{ state, actions }}>
      {children}
    </ItemOverrideContext.Provider>
  );
}

/**
 * ## Deprecated
 * 클라이언트 상태값을 덮어씌우기 위한 컨텍스트
 * ? Optimistic UI를 구현하기 위해 사용
 * @deprecated use useItemStatsStore instead
 */
export function useItemOverride() {
  const context = useContext(ItemOverrideContext);
  if (!context) throw new Error('ItemOverrideContext.Provider not used');
  return context;
}

/**
 * ## Deprecated
 * 해당 ID의 상태값을 가져오는 함수
 * @param itemId
 * @returns ItemStats State (client state)
 * @deprecated use useItemStatsStore instead
 */
export function useItemOverrideById(
  itemId: number,
): OverridableItem | undefined {
  const { state } = useItemOverride();
  return state[itemId];
}
