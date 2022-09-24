import { BookmarkIcon } from '@heroicons/react/24/outline';
import IconToggleButton from './IconToggleButton';

interface Props {
  onClick?: () => void;
  isAciive?: boolean;
}

export default function BookmarkButton({ onClick, isAciive }: Props) {
  return (
    <IconToggleButton
      onClick={onClick}
      isActive={isAciive}
      activeIcon={
        <BookmarkIcon className="h-full w-full fill-current text-yellow-400" />
      }
      inactiveIcon={<BookmarkIcon className="h-full w-full text-yellow-400" />}
    />
  );
}
