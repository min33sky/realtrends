import { format } from 'date-fns';

/**
 * 주어진 날짜의 이전 일주일 기간을 구한다..
 * @param date
 * @returns
 */
export function getWeekRangeFromDate(date: Date) {
  const day = date.getDay(); //? 일요일 ~ 토요일: 0 ~ 6
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // -6, 2, 3, 4, 5, 6, 7
  const start = format(new Date(date.setDate(diff)), 'yyyy-MM-dd');
  const end = format(new Date(date.setDate(diff + 6)), 'yyyy-MM-dd');
  return [start, end];
}
