import {
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import React, { useRef } from 'react';

export default function SearchArea() {
  const inputRef = useRef<HTMLInputElement>(null);

  const onClick = () => {
    inputRef.current?.focus();
  };

  return (
    <article>
      <div
        aria-label="input-wrapper"
        className="mr-2 flex h-9 w-[180px] items-center rounded border border-gray-200 pl-2 pr-[14px]"
        onClick={onClick}
      >
        <MagnifyingGlassIcon className="mr-2 h-5 w-5 shrink-0 text-gray-400" />
        <input
          type="text"
          className="min-w-0 flex-1 border-none outline-none"
          ref={inputRef}
        />
      </div>
    </article>
  );
}
