/**
 * Gradual TypeScript migration contracts.
 *
 * WHY: These declarations document existing browser globals without changing
 * script loading, runtime values, or the application's public API.
 */
export interface BandPlanRuntimeConfig {
  readonly supabaseUrl: string;
  readonly supabasePublishableKey: string;
}

export interface BandPlanCloudContract {
  readonly [method: string]: unknown;
}

declare global {
  interface Window {
    BANDPLAN_CONFIG?: Readonly<BandPlanRuntimeConfig>;
    BandPlanCloud?: BandPlanCloudContract;
    __bandplanEnsureCore?: () => Promise<unknown>;
  }
}

export {};
