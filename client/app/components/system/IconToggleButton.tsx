import { AnimatePresence, motion } from 'framer-motion';

type Size = 'small' | 'medium';

interface Props {
  onClick?: () => void;
  isActive?: boolean;
  size?: Size;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
}

export default function IconToggleButton({
  activeIcon,
  inactiveIcon,
  isActive,
  onClick,
  size = 'medium',
}: Props) {
  return (
    <button
      aria-label="토글 버튼"
      className={`relative inline-flex ${
        size === 'small' ? 'h-4 w-4' : 'h-6 w-6'
      } `}
      onClick={onClick}
    >
      <AnimatePresence initial={false}>
        {isActive ? (
          <motion.span
            key="fill"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute left-0 top-0 grid h-full place-items-center"
          >
            {activeIcon}
          </motion.span>
        ) : (
          <motion.span
            key="outline"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute left-0 top-0 grid h-full place-items-center"
          >
            {inactiveIcon}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
