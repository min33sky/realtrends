import React from 'react';
import { Logo } from './vectors';

function Header() {
  return (
    <header className="h-[56px] px-4  flex justify-center items-center border-b-[1px] border-b-gray-400">
      <Logo className="w-36 h-10" />
    </header>
  );
}

export default Header;
