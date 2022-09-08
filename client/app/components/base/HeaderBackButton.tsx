import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface Props {
  onClick: () => void;
}

function HeaderBackButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="-m-2 cursor-pointer p-2 transition hover:text-purple-500"
    >
      <ArrowLeftIcon className="h-5 w-5" />
    </button>
  );
}

export default HeaderBackButton;
