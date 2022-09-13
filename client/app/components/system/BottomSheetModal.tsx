import { AnimatePresence, motion } from 'framer-motion';
import Overlay from './Overlay';

interface Props {
  visible: boolean;
  items: {
    name: string;
    onClick: () => void;
  }[];
  onClose: () => void;
}

/**
 * 화면 하단에 나타나는 모달
 */
export default function BottomSheetModal({ visible, items, onClose }: Props) {
  return (
    <>
      <Overlay visible={visible} onClose={onClose} />
      <AnimatePresence>
        {visible && (
          <motion.div
            aria-label="sheet"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{
              damping: 0,
            }}
            className="fixed bottom-0 left-0 w-full rounded-tl rounded-tr bg-white"
          >
            <ul aria-label="items" onClick={onClose} className="flex flex-col">
              {items.map((item) => (
                <li
                  aria-label="item"
                  key={item.name}
                  onClick={item.onClick}
                  className="cursor-pointer p-4 text-gray-500 transition hover:bg-indigo-100"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
