/**
 * Compile-time contract for the first isolated legacy-core utility module.
 * WHY: check its public inputs/outputs without changing runtime loading yet.
 */
import { daysFromToday, mondayFirstDayIndex, toLocalISODate } from '../../core/date-utils.js';

export function verifyDateUtilsContract(date: Date): void {
  const isoDate: string = toLocalISODate(date);
  const weekday: number = mondayFirstDayIndex(isoDate);
  const relativeDays: number = daysFromToday(isoDate, date);
  void weekday;
  void relativeDays;
}
