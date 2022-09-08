import React from 'react';
import {
  BookmarkIcon,
  CogIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/24/solid';
import { NavLink } from '@remix-run/react';

const iconMap = {
  home: HomeIcon,
  search: MagnifyingGlassIcon,
  bookmark: BookmarkIcon,
  plus: PlusCircleIcon,
  setting: CogIcon,
};

interface Props {
  icon: keyof typeof iconMap;
  to: string;
}

export default function FooterTapItem({ icon, to }: Props) {
  const iconEl = React.createElement(iconMap[icon]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <NavLink
        to={to}
        className={({ isActive }) => (isActive ? 'text-violet-500' : undefined)}
      >
        <div className={`h-6 w-6`}>{iconEl}</div>
      </NavLink>
    </div>
  );
}
