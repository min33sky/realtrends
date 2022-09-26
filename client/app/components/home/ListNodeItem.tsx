import React, { useEffect, useLayoutEffect, useRef } from 'react';
import type { ListMode } from '~/lib/api/types';
import type { ListModeSelectorProps } from './ListModeSelector';

interface Props extends ListModeSelectorProps {
  currentMode: ListMode;
  icon: React.ReactNode;
  name: string;
  index: number;
  onUpdateSize: (index: number, size: number) => void;
}

export default function ListModeItem({
  currentMode,
  icon,
  index,
  mode,
  name,
  onSelectMode,
  onUpdateSize,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const useIsmorphicEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsmorphicEffect(() => {
    if (!ref.current) return;
    onUpdateSize(index, ref.current.clientWidth);
  }, [index, onUpdateSize]);

  return (
    <div
      className={`flex items-center gap-x-4 text-base text-gray-500 ${
        mode === currentMode ? 'font-semibold text-purple-500' : ''
      }`}
      onClick={() => onSelectMode(mode)}
      ref={ref}
    >
      {icon}
      {name}
    </div>
  );
}
