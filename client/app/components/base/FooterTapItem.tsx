import React from 'react';
import {
  BookmarkAltIcon,
  CogIcon,
  PlusCircleIcon,
  SearchIcon,
} from '@heroicons/react/outline';
import { HomeIcon } from '@heroicons/react/solid';
import { Link } from '@remix-run/react';

const iconMap = {
  home: HomeIcon,
  search: SearchIcon,
  bookmark: BookmarkAltIcon,
  plus: PlusCircleIcon,
  setting: CogIcon,
};

interface Props {
  icon: keyof typeof iconMap;
  isActive?: boolean;
  to?: string;
}

export default function FooterTapItem({ icon, isActive, to }: Props) {
  const iconEl = React.createElement(iconMap[icon]);

  if (to) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Link to={to}>
          <div className={`h-6 w-6 ${isActive && 'text-violet-500'}`}>
            {iconEl}
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className={`h-6 w-6 ${isActive && 'text-violet-500'}`}>{iconEl}</div>
    </div>
  );
}
