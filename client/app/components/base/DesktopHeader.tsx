import { Link } from '@remix-run/react';
import React from 'react';
import Button from '../system/Button';
import { Logo } from '../vectors';
import SearchArea from './SearchArea';

export default function DesktopHeader() {
  return (
    <header className="hidden h-16 items-center border-b border-gray-500 px-4 xs:flex">
      <Link to="/">
        <Logo className="block h-[17px] w-auto" />
      </Link>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center"></div>
        <div className="flex items-center">
          <SearchArea />
          <div className="flex gap-2">
            <Button variant="text" size="small">
              로그인
            </Button>
            <Button size="small">회원가입</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
