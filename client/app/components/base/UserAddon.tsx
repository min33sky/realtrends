import { UserIcon } from '@heroicons/react/24/solid';
import React, { useRef, useState } from 'react';
import Button from '../system/Button';
import UserMenu from './UserMenu';

export default function UserAddon({ username }: { username: string }) {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onOpen = () => setVisible(true);
  const onClose = (e?: Event) => {
    console.log('buttonRef, e?.target', buttonRef, e?.target, ''); //!!!
    const isButton =
      buttonRef.current?.contains(e?.target as Node) ||
      buttonRef.current === e?.target;
    if (isButton) return;
    setVisible(false);
  };

  return (
    <article className="relative flex">
      <div className="mr-2 hidden md:block">
        <Button to="/write" size="small" variant="secondary">
          새글 작성
        </Button>
      </div>
      <Button variant="text" size="small" onClick={onOpen} ref={buttonRef}>
        <div className="flex items-center">
          <UserIcon className="mr-2 h-5 w-5" />
          {username}
        </div>
      </Button>
      <UserMenu visible={visible} onClose={onClose} />
    </article>
  );
}
