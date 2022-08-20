import { Logo } from './vectors';

interface Props {
  title?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

function Header({
  title = <Logo className="h-10 w-36" />,
  headerLeft,
  headerRight,
}: Props) {
  return (
    <header className="relative flex h-[56px]  items-center justify-center border-b-[1px] border-b-gray-400 px-4">
      {headerLeft && (
        <div className="absolute left-4 flex h-full items-center">
          {headerLeft}
        </div>
      )}

      <div className="text-lg font-semibold text-gray-800">{title}</div>

      {headerRight && (
        <div className="absolute right-4 flex h-full items-center">
          {headerRight}
        </div>
      )}
    </header>
  );
}

export default Header;
