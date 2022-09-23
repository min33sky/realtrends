import { format } from 'date-fns';
import React, { useMemo } from 'react';

interface Props {
  dateRange: string[];
}

export default function WeekSelector({ dateRange }: Props) {
  const [startDate, endDate] = useMemo(() => {
    const [startDate, endDate] = dateRange;
    const start = format(new Date(startDate), 'yyyy년 MM월 dd일');
    const end = format(new Date(endDate), 'yyyy년 MM월 dd일');
    return [start, end];
  }, [dateRange]);

  return (
    <div className="mb-4 text-base text-gray-500">
      <div>
        {startDate} ~ {endDate}
      </div>
      <div className="mt-4 flex gap-2">
        <button className="inline-flex border-none underline outline-none">
          저번 주
        </button>
        <button className="inline-flex border-none underline outline-none">
          다음 주
        </button>
      </div>
    </div>
  );
}
