import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import Overlay from './Overlay';

interface Props {
  visible: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

export default function Modal({ visible, children, onClose }: Props) {
  return (
    <>
      <Overlay visible={visible} onClose={onClose} />
      <div
        aria-label="Positioner"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 "
      >
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ y: '30vh', opacity: 0 }}
              animate={{ y: '0vh', opacity: 1 }}
              exit={{ y: '30vh', opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.33 }}
              className="w-[calc(100vw-32px)] rounded-md bg-white py-6 px-4 shadow-md sm:w-[375px]"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
