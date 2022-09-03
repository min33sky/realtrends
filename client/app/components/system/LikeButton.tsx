import { HeartIcon } from '@heroicons/react/outline';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  onClick: () => void;
  isLiked: boolean;
}

export default function LikeButton({ onClick, isLiked }: Props) {
  return (
    <button
      aria-label="좋아요 버튼"
      className="relative h-full "
      onClick={onClick}
    >
      <AnimatePresence initial={false}>
        {isLiked ? (
          <motion.span
            key="fill"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute left-0 top-0 grid h-full place-items-center"
          >
            <HeartIcon className={` h-5 w-5 fill-current text-red-400`} />
          </motion.span>
        ) : (
          <motion.span
            key="outline"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute left-0 top-0 grid h-full place-items-center"
          >
            <HeartIcon className={` h-5 w-5 text-red-400`} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
