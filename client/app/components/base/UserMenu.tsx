import { useNavigate } from '@remix-run/react';
import { AnimatePresence, motion } from 'framer-motion';
import useOutsideClick from '~/hooks/useOutsideClick';

interface Props {
  visible: boolean;
  onClose: (e?: Event) => void;
}

export default function UserMenu({ visible, onClose }: Props) {
  const navigate = useNavigate();
  const targetRef = useOutsideClick(onClose);

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.article
          ref={targetRef}
          onClick={() => onClose()}
          className="absolute right-0 top-12 z-10 w-[200px] border border-gray-100 bg-white shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.8, scale: 0 }}
          transition={{ duration: 0.125 }}
        >
          <div
            aria-label="triangle div"
            className="absolute right-4 -top-2 z-10 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-purple-400"
          />

          <div
            className="block cursor-pointer p-4 transition hover:bg-gray-100 md:hidden"
            onClick={() => navigate('/write')}
          >
            새 글 등록
          </div>
          <div
            className="cursor-pointer p-4 transition hover:bg-gray-100"
            onClick={() => navigate('/account')}
          >
            내 계정
          </div>
          <div
            className="cursor-pointer p-4 transition hover:bg-gray-100"
            onClick={() => navigate('/bookmarks')}
          >
            북마크
          </div>
          <div
            className="cursor-pointer p-4 transition hover:bg-gray-100"
            onClick={() => navigate('/')}
          >
            로그아웃
          </div>
        </motion.article>
      ) : null}
    </AnimatePresence>
  );
}
