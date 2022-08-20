interface ButtonProps {
  layoutMode?: 'inline' | 'fullWidth';
}

interface Props extends React.HTMLAttributes<HTMLButtonElement>, ButtonProps {}

export default function Button({ layoutMode = 'inline', ...rest }: Props) {
  return (
    <button
      className={`h-12 border-none bg-purple-500 px-4 text-base font-semibold text-white ${
        layoutMode === 'inline' ? 'w-fit' : 'w-full'
      } `}
      {...rest}
    />
  );
}
