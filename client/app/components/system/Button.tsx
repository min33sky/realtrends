import { Link } from '@remix-run/react';
import { ButtonLoader } from '../vectors';

interface ButtonProps {
  layoutMode?: 'inline' | 'fullWidth';
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium';
  to?: string; //? Link Component를 사용할 경우에만 사용
}

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonProps {}

export default function Button({
  layoutMode = 'inline',
  variant = 'primary',
  size = 'medium',
  to,
  children,
  ...rest
}: Props) {
  if (to) {
    return (
      <Link
        to={to}
        className={`group flex items-center justify-center border-none
        font-semibold text-white transition disabled:bg-gray-400
        ${size === 'small' ? 'h-9 px-3 text-sm' : 'h-12 px-4 text-base'}
        ${variant === 'primary' && 'bg-purple-500 hover:opacity-80'}
        ${
          variant === 'secondary' &&
          'bg-purple-100 text-purple-500 hover:opacity-80'
        }
        ${
          variant === 'text' && 'bg-transparent text-gray-600 hover:bg-gray-100'
        }
        ${layoutMode === 'inline' ? 'w-fit' : 'w-full'} `}
      >
        <ButtonLoader className="mr-2 hidden h-4 w-4 animate-spin text-white group-disabled:inline" />
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`group flex items-center justify-center border-none
      font-semibold text-white transition disabled:bg-gray-400
      ${size === 'small' ? 'h-9 px-3 text-sm' : 'h-12 px-4 text-base'}
      ${variant === 'primary' && 'bg-purple-500 hover:opacity-80'}
      ${
        variant === 'secondary' &&
        'bg-purple-100 text-purple-500 hover:opacity-80'
      }
      ${variant === 'text' && 'bg-transparent text-gray-600 hover:bg-gray-100'}
      ${layoutMode === 'inline' ? 'w-fit' : 'w-full'} `}
      {...rest}
    >
      <ButtonLoader className="mr-2 hidden h-4 w-4 animate-spin text-white group-disabled:inline" />
      {children}
    </button>
  );
}
