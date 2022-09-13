import { HeartIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';

type Size = 'small' | 'medium';

interface Props {
  onClick?: () => void;
  isLiked?: boolean;
  size?: Size;
}

export default function LikeButton({
  onClick,
  isLiked,
  size = 'medium',
}: Props) {
  return (
    <button
      aria-label="좋아요 버튼"
      className={`relative inline-flex  ${
        size === 'small' ? 'h-4 w-4' : 'h-6 w-6'
      } `}
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
            <HeartIcon className={`h-full w-full fill-current text-red-400`} />
          </motion.span>
        ) : (
          <motion.span
            key="outline"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute left-0 top-0 grid h-full place-items-center"
          >
            <HeartIcon className={`h-full w-full text-red-400`} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
