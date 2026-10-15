/**
 * Generated runtime mirror of date-utils.ts for source-mode development.
 * WHY: direct source-mode runs do not execute the esbuild output in dist/.
 * Keep behavior in sync with the typed source; production builds compile the TS file.
 */

/** Preserve the legacy core's local-calendar YYYY-MM-DD formatting. */
export function toLocalISODate(value) {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  const pad2 = part => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Return a Monday-first weekday index: Monday=0 ... Sunday=6. */
export function mondayFirstDayIndex(dateString) {
  return (new Date(`${dateString}T00:00:00`).getDay() + 6) % 7;
}

/** Count calendar days from today using local midnight, matching the legacy core. */
export function daysFromToday(dateString, now = new Date()) {
  const target = new Date(`${dateString}T00:00:00`);
  const currentDate = toLocalISODate(now);
  const currentMidnight = new Date(`${currentDate}T00:00:00`);
  return Math.round((target.getTime() - currentMidnight.getTime()) / 86_400_000);
}
