import {
  ArrowTrendingUpIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React, { useCallback, useMemo, useState } from 'react';
import type { ListMode } from '~/lib/api/types';
import ListModeItem from './ListNodeItem';

export interface ListModeSelectorProps {
  mode: ListMode;
  onSelectMode: (mode: ListMode) => void;
}

export default function ListModeSelector({
  mode,
  onSelectMode,
}: ListModeSelectorProps) {
  const [elementSizes, setElementSizes] = useState([0, 0, 0]);
  const setElementsSizeOfIndex = useCallback((index: number, size: number) => {
    setElementSizes((prev) => {
      const next = [...prev];
      next[index] = size;
      return next;
    });
  }, []);

  const modeProps = useMemo(
    () =>
      [
        {
          mode: 'trending',
          icon: <ArrowTrendingUpIcon className="h-6 w-6" />,
          name: '트랜딩',
        },
        {
          mode: 'recent',
          icon: <ClockIcon className="h-6 w-6" />,
          name: '최신',
        },
        {
          mode: 'past',
          icon: <CalendarIcon className="h-6 w-6" />,
          name: '과거',
        },
      ] as const,
    [],
  );

  const currentIndex = useMemo(
    () => modeProps.findIndex((props) => props.mode === mode),
    [mode, modeProps],
  );

  const indicatorWitdth = elementSizes[currentIndex];
  const indicatorLeft = useMemo(() => {
    const gaps = currentIndex * 16;
    const sizes = elementSizes
      .slice(0, currentIndex)
      .reduce((acc, cur) => acc + cur, 0);
    return gaps + sizes;
  }, [currentIndex, elementSizes]);

  return (
    <article className="relative mb-6 flex cursor-pointer gap-4">
      {modeProps.map((props, index) => (
        <ListModeItem
          key={props.name}
          currentMode={mode}
          onSelectMode={onSelectMode}
          index={index}
          onUpdateSize={setElementsSizeOfIndex}
          {...props}
        />
      ))}
      {indicatorWitdth > 0 && (
        <motion.div
          layout
          className="absolute left-0 -bottom-2 h-[2px]  rounded-sm bg-purple-500"
          style={{ left: indicatorLeft, width: indicatorWitdth }}
        />
      )}
    </article>
  );
}
