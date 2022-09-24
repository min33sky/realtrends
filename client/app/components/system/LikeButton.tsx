import { HeartIcon } from '@heroicons/react/24/outline';
import IconToggleButton from './IconToggleButton';

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
    <IconToggleButton
      activeIcon={
        <HeartIcon className={`h-full w-full fill-current text-red-400`} />
      }
      inactiveIcon={<HeartIcon className={`h-full w-full text-red-400`} />}
      isActive={isLiked}
      onClick={onClick}
      size={size}
    />
  );
}
