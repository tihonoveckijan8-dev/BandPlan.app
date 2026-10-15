/**
 * Stable browser-global contracts used at the BandPlan runtime boundary.
 * WHY: declare globals centrally before incrementally enabling checks on bootstrap modules.
 */
interface BandPlanClientConfig {
  readonly supabaseUrl: string;
  readonly supabasePublishableKey: string;
}

interface Window {
  BANDPLAN_CONFIG?: Readonly<BandPlanClientConfig>;
  __bandplanConfigError?: boolean;
  __bandplanCorePromise?: Promise<unknown>;
  __bandplanEnsureCore?: () => Promise<unknown>;
}
