import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useCommentInputStore } from '~/lib/stores/useCommentInputStore';
import Overlay from '../system/Overlay';

export default function CommentInputOverlay() {
  const visible = useCommentInputStore((store) => store.visible);

  return (
    <>
      <Overlay visible={visible} />
      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            initial={{ y: 48 }}
            animate={{ y: 0 }}
            exit={{ y: 48 }}
            transition={{ damping: 0 }}
            className="fixed bottom-0 h-12 w-full bg-white"
          />
        )}
      </AnimatePresence>
    </>
  );
}
