/**
 * Typed date helpers for the legacy BandPlan core.
 * WHY: isolate pure date calculations behind explicit types before wiring them
 * into the classic-script core; this module is compile-time checked only for now.
 */

/** Preserve the legacy core's local-calendar YYYY-MM-DD formatting. */
export function toLocalISODate(value: string | number | Date): string {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  const pad2 = (part: number): string => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Return a Monday-first weekday index: Monday=0 ... Sunday=6. */
export function mondayFirstDayIndex(dateString: string): number {
  return (new Date(`${dateString}T00:00:00`).getDay() + 6) % 7;
}

/** Count calendar days from today using local midnight, matching the legacy core. */
export function daysFromToday(dateString: string, now: Date = new Date()): number {
  const target = new Date(`${dateString}T00:00:00`);
  const currentDate = toLocalISODate(now);
  const currentMidnight = new Date(`${currentDate}T00:00:00`);
  return Math.round((target.getTime() - currentMidnight.getTime()) / 86_400_000);
}
