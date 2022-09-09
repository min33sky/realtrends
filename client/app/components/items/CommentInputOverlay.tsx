import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useCreateCommentMutation from '~/hooks/mutation/useCreateCommentMutation';
import useItemId from '~/hooks/useItemId';
import { useCommentInputStore } from '~/lib/stores/useCommentInputStore';
import Button from '../system/Button';
import Overlay from '../system/Overlay';

export default function CommentInputOverlay() {
  const { visible, close, parentCommentId } = useCommentInputStore();
  const [text, setText] = useState('');
  const itemId = useItemId();

  const { mutate, isLoading } = useCreateCommentMutation({
    onSuccess: (data) => {
      // TODO: do sth with data
      console.log('hello world');
      close();
    },
  });

  useEffect(() => {
    if (visible) {
      setText('');
    }
  }, [visible]);

  const onClick = () => {
    if (!itemId) return;
    mutate({ itemId, text });
  };

  return (
    <>
      <Overlay visible={visible} onClose={close} />
      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            initial={{ y: 48 }}
            animate={{ y: 0 }}
            exit={{ y: 48 }}
            transition={{ damping: 0 }}
            className="fixed bottom-0 flex h-12 w-full bg-white"
          >
            <input
              className="h-full flex-1 pl-4 outline-none"
              placeholder="댓글을 입력하세요"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button onClick={onClick} disabled={isLoading} variant="secondary">
              등록
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
