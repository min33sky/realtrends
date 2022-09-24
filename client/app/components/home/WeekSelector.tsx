import { useSearchParams } from '@remix-run/react';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { addWeekToRange } from '~/lib/week';

interface Props {
  dateRange: string[];
}

const SERVICE_START_DATE = new Date('2022-09-01');

export default function WeekSelector({ dateRange }: Props) {
  const [startDate, endDate] = useMemo(() => {
    const [startDate, endDate] = dateRange;
    const start = format(new Date(startDate), 'yyyy년 MM월 dd일');
    const end = format(new Date(endDate), 'yyyy년 MM월 dd일');
    return [start, end];
  }, [dateRange]);

  const [_, setSearchParams] = useSearchParams();

  const onClikePrev = () => {
    const [start, end] = addWeekToRange(dateRange, -1);
    setSearchParams({ mode: 'past', start, end });
  };

  const onClickNext = () => {
    const [start, end] = addWeekToRange(dateRange, 1);
    setSearchParams({ mode: 'past', start, end });
  };

  const [prevDisabled, nextDisabled] = useMemo(() => {
    const today = new Date(format(new Date(), 'yyyy-MM-dd'));
    const [start, end] = dateRange.map((date) => new Date(date));
    return [start <= SERVICE_START_DATE, end >= today];
  }, [dateRange]);

  return (
    <div className="mb-4 text-base text-gray-500">
      <div>
        {startDate} ~ {endDate}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className="inline-flex border-none underline outline-none"
          onClick={onClikePrev}
          disabled={prevDisabled}
        >
          저번 주
        </button>
        <button
          className="inline-flex border-none underline outline-none"
          onClick={onClickNext}
          disabled={nextDisabled}
        >
          다음 주
        </button>
      </div>
    </div>
  );
}
