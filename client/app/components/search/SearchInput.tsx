import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchInput({ value, onChangeText }: Props) {
  return (
    <div className="flex h-8 w-full items-center rounded bg-gray-50 px-2">
      <MagnifyingGlassIcon className="h-4 w-4" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        className="ml-2 flex-1 border-none bg-transparent text-sm text-gray-800 placeholder-gray-500 outline-none"
        placeholder="Search..."
      />
    </div>
  );
}
