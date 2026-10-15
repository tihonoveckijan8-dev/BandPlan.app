/**
 * Source-mode runtime mirror of format-utils.ts.
 * WHY: direct source-mode runs do not load generated files from dist/.
 */
export function formatDuration(seconds) {
  const value = Math.round(seconds || 0);
  const remainder = value % 60;
  return `${Math.floor(value / 60)}:${String(remainder).padStart(2, '0')}`;
}

export function parseDuration(value) {
  const match = /^(\d+):(\d{1,2})$/.exec(String(value || '').trim());
  if (match) return Number(match[1]) * 60 + Number(match[2]);
  const parsed = parseInt(String(value), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function timeToMinutes(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value || '').trim());
  return match ? Number(match[1]) * 60 + Number(match[2]) : 0;
}
