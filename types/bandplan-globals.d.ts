/**
 * Stable browser-global contracts used at the BandPlan runtime boundary.
 * WHY: declare globals centrally before incrementally enabling checks on bootstrap modules.
 */
interface BandPlanClientConfig {
  readonly supabaseUrl: string;
  readonly supabasePublishableKey: string;
}

type BandPlanParticipationStatus = 'yes' | 'maybe' | 'no' | '';

interface BandPlanAuthUser {
  readonly id: string;
  readonly email?: string;
  readonly user_metadata?: Record<string, unknown>;
}

interface BandPlanCloudLoadResult {
  readonly state: Record<string, unknown>;
  readonly updatedAt: string;
}

/** Realtime payload emitted by Supabase for participation changes. */
interface BandPlanParticipationChange {
  readonly group_id?: string | null;
  readonly event_id: string;
  readonly user_id: string;
  readonly status: string;
  readonly updated_at: string;
  readonly deleted?: boolean;
}

/**
 * Public surface assigned by supabase.js to window.BandPlanCloud.
 * WHY: keep the browser-facing contract explicit before gradually checking the
 * legacy core; this declaration does not alter the runtime object or auth flow.
 */
interface BandPlanCloudRuntime {
  initialize?: () => Promise<BandPlanAuthUser | null>;
  user?: () => BandPlanAuthUser | null;
  authState?: () => string;
  load?: () => Promise<BandPlanCloudLoadResult | null>;
  saveNow?: (state: Record<string, unknown>) => Promise<unknown>;
  schedule?: (state: Record<string, unknown>) => void;
  subscribe?: (
    onState: (state: Record<string, unknown>, updatedAt?: string) => void,
    onParticipation?: (change: BandPlanParticipationChange) => void
  ) => () => void;
  signOut?: () => Promise<void>;
  leaveGroup?: () => Promise<unknown>;
  joinGroup?: (code: string, name: string, roles: string[]) => Promise<unknown>;
  setEventParticipation?: (eventId: string, status: BandPlanParticipationStatus, updatedAt?: string) => Promise<unknown>;
  queueEventParticipation?: (
    eventId: string,
    status: BandPlanParticipationStatus,
    updatedAt?: string
  ) => Promise<{ queued: true; event_id: string; status: BandPlanParticipationStatus; updated_at: string }>;
  hasAccountIdentity?: () => Promise<boolean>;
  markOnboardingComplete?: () => Promise<void>;
  isJustRegistered?: () => boolean;
  clearJustRegistered?: () => void;
}

interface BandPlanDateUtilsRuntime {
  toLocalISODate(value: string | number | Date): string;
  mondayFirstDayIndex(dateString: string): number;
  daysFromToday(dateString: string, now?: Date): number;
}

interface BandPlanFormatUtilsRuntime {
  formatDuration(seconds: number): string;
  parseDuration(value: unknown): number;
  timeToMinutes(value: unknown): number;
}

interface Window {
  BandPlanFormatUtils?: BandPlanFormatUtilsRuntime;
  BandPlanDateUtils?: BandPlanDateUtilsRuntime;
  BANDPLAN_CONFIG?: Readonly<BandPlanClientConfig>;
  BandPlanCloud?: BandPlanCloudRuntime;
  __bandplanConfigError?: boolean;
  __bandplanCorePromise?: Promise<unknown>;
  __bandplanEnsureCore?: () => Promise<unknown>;
}
