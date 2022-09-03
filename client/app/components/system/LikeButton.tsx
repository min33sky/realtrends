import { HeartIcon } from '@heroicons/react/outline';

interface Props {
  onClick: () => void;
  isLiked: boolean;
}

export default function LikeButton({ onClick, isLiked }: Props) {
  return (
    <button aria-label="좋아요 버튼" onClick={onClick}>
      <HeartIcon
        className={`h-5 w-5  text-red-400 ${isLiked ? 'fill-current' : ''}`}
      />
    </button>
  );
}
