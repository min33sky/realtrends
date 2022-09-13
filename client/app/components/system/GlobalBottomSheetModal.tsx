import { useBottomSheetModalStore } from '~/stores/useBottomSheetModalStore';
import BottomSheetModal from './BottomSheetModal';

export default function GlobalBottomSheetModal() {
  const { close, items, visible } = useBottomSheetModalStore();

  return <BottomSheetModal items={items} visible={visible} onClose={close} />;
}
