import { ButtonLoader } from './vectors';

interface ButtonProps {
  layoutMode?: 'inline' | 'fullWidth';
}

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonProps {}

export default function Button({
  layoutMode = 'inline',
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`group flex h-12 items-center justify-center border-none bg-purple-500 px-4 text-base font-semibold text-white disabled:bg-gray-400 ${
        layoutMode === 'inline' ? 'w-fit' : 'w-full'
      } `}
      {...rest}
    >
      <ButtonLoader />
      {children}
    </button>
  );
}
