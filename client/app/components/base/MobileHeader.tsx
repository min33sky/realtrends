import { Logo } from '../vectors';

interface Props {
  title?: React.ReactNode;
  titleFullWidth?: boolean;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

function MobileHeader({
  title = <Logo className="h-10 w-36" />,
  titleFullWidth,
  headerLeft,
  headerRight,
}: Props) {
  return (
    <header className="relative flex h-[56px] items-center justify-center border-b border-b-gray-400 px-4 xs:hidden">
      {headerLeft && (
        <div className="absolute left-4 flex h-full items-center">
          {headerLeft}
        </div>
      )}

      <div
        className={`text-lg font-semibold text-gray-800 ${
          titleFullWidth && 'w-full'
        }`}
      >
        {title}
      </div>

      {headerRight && (
        <div className="absolute right-4 flex h-full items-center">
          {headerRight}
        </div>
      )}
    </header>
  );
}

export default MobileHeader;
