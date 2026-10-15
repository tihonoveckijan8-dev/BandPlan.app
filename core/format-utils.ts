/**
 * Typed duration helpers used by the legacy BandPlan core.
 * WHY: isolate pure formatting/parsing logic before expanding TypeScript coverage.
 */

/** Match the legacy core's rounded seconds display, including its existing overflow behavior. */
export function formatDuration(seconds: number): string {
  const value = Math.round(seconds || 0);
  const remainder = value % 60;
  return `${Math.floor(value / 60)}:${String(remainder).padStart(2, '0')}`;
}

/** Match the legacy core's mm:ss parsing and integer fallback. */
export function parseDuration(value: unknown): number {
  const match = /^(\d+):(\d{1,2})$/.exec(String(value || '').trim());
  if (match) return Number(match[1]) * 60 + Number(match[2]);
  const parsed = parseInt(String(value), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}
