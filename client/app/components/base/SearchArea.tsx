import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate, useSearchParams } from '@remix-run/react';
import React, { useRef } from 'react';

export default function SearchArea() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  //? uncontrolled input이기 때문에 검색 후 input의 keyword가 사라진다.
  //? 그래서 url querystring을 사용해서 keyword를 input에 유지한다.
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get('q') ?? '';

  const onClick = () => {
    inputRef.current?.focus();
  };

  const onKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${inputRef.current?.value}`);
    }
  };

  return (
    <article>
      <div
        aria-label="input-wrapper"
        className="mr-2 flex h-9 w-[180px] items-center rounded border border-gray-50 pl-3 pr-[14px]"
        onClick={onClick}
        onKeyUp={onKeyUp}
      >
        <MagnifyingGlassIcon className="mr-2 h-5 w-5 shrink-0 text-gray-400" />
        <input
          type="text"
          className="min-w-0 flex-1 border-none bg-transparent outline-none"
          ref={inputRef}
          defaultValue={initialKeyword}
        />
      </div>
    </article>
  );
}
