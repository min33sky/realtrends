import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface Props {
  visible: boolean;
}

/**
 * Modal Overlay
 * @param visible show or hide modal
 * @returns
 */
export default function Overlay({ visible }: Props) {
  /** @TODO visible 설정 해줘야함 */
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          aria-label="Overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black"
        />
      )}
    </AnimatePresence>
  );
}
