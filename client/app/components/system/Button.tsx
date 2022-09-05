import { ButtonLoader } from '../vectors';

interface ButtonProps {
  layoutMode?: 'inline' | 'fullWidth';
  variant?: 'primary' | 'secondary';
}

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonProps {}

export default function Button({
  layoutMode = 'inline',
  variant = 'primary',
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`group flex h-12 items-center justify-center border-none
      px-4 text-base font-semibold text-white disabled:bg-gray-400
      ${
        variant === 'primary'
          ? 'bg-purple-500'
          : 'bg-purple-100 text-purple-500'
      }
      ${layoutMode === 'inline' ? 'w-fit' : 'w-full'} `}
      {...rest}
    >
      <ButtonLoader className="mr-2 hidden h-4 w-4 animate-spin text-white group-disabled:inline" />
      {children}
    </button>
  );
}
