import { Link } from '@remix-run/react';
import { useUser } from '~/contexts/UserContext';
import Button from '../system/Button';
import { Logo } from '../vectors';
import SearchArea from './SearchArea';
import UserAddon from './UserAddon';

export default function DesktopHeader() {
  const user = useUser();

  return (
    <header className="hidden h-16 items-center border-b border-gray-500 px-4 xs:flex">
      <Link to="/">
        <Logo className="block h-[17px] w-auto" />
      </Link>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center"></div>
        <div className="flex items-center">
          <SearchArea />
          {user ? (
            <UserAddon username={user.username} />
          ) : (
            <div className="flex gap-2">
              <Button variant="text" size="small" to="/auth/login">
                로그인
              </Button>
              <Button size="small" to="/auth/register">
                회원가입
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
