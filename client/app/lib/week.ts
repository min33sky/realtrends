import { format } from 'date-fns';

/**
 * 주어진 날짜가 포함된 한 주의 시작 날짜와 끝 날짜를 반환하는 함수
 * @param date Date
 * @returns [string, string] [시작 날짜, 끝 날짜]
 */
export function getWeekRangeFromDate(date: Date) {
  const day = date.getDay(); // 0: 일요일, 1: 월요일, 2: 화요일, 3: 수요일, 4: 목요일, 5: 금요일, 6: 토요일
  const startDate = date.getDate() - day;

  const start = format(new Date(date.setDate(startDate)), 'yyyy-MM-dd');
  const end = format(
    new Date(new Date(start).setDate(startDate + 6)),
    'yyyy-MM-dd',
  );
  return [start, end];
}

export function addWeekToRange(
  range: string[],
  weeks: number,
): [string, string] {
  const [startDate] = range;
  const d = new Date(startDate);
  const nextStartDate = new Date(d.setDate(d.getDate() + weeks * 7));
  const nextEndDate = new Date(
    new Date(nextStartDate).setDate(nextStartDate.getDate() + 6),
  );
  const start = format(nextStartDate, 'yyyy-MM-dd');
  const end = format(nextEndDate, 'yyyy-MM-dd');
  return [start, end];
}
