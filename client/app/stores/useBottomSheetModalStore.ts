import create from 'zustand';

interface BottomSheetModalItem {
  name: string;
  onClick: () => void;
}

interface BottomSheetModalStore {
  visible: boolean;
  items: BottomSheetModalItem[]; //? 화면에 보여줄 텍스트와 클릭 이벤트를 담은 배열
  open: (items: BottomSheetModalItem[]) => void;
  close: () => void;
}

/**
 * 화면 하단에 나타나는 모달을 관리하는 스토어
 */
export const useBottomSheetModalStore = create<BottomSheetModalStore>(
  (set) => ({
    visible: false,
    items: [],
    open: (items) => set((store) => ({ ...store, items, visible: true })),
    close: () => set((store) => ({ ...store, visible: false })),
  }),
);
