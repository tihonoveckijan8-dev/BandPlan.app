/* BandPlan public client configuration. Never place a Supabase service_role secret in browser code. */

export {};

interface BandPlanClientConfig {
  readonly supabaseUrl: string;
  readonly supabasePublishableKey: string;
}

declare global {
  interface Window {
    BANDPLAN_CONFIG?: Readonly<BandPlanClientConfig>;
    __bandplanConfigError?: boolean;
  }
}

// WHY: TypeScript owns the source while the build emits the same classic-script config.js URL,
// preserving the existing HTML script order and runtime contract.
(() => {
  'use strict';
  const config: Readonly<BandPlanClientConfig> = Object.freeze({
    supabaseUrl: 'https://oczcjphvzoadfqntoqlc.supabase.co',
    supabasePublishableKey: 'sb_publishable_EOBM5JQZQvtXcph4JNFA4w_LjfOjkiY'
  });
  const validUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl);
  const validKey = /^sb_publishable_[A-Za-z0-9_-]+$/.test(config.supabasePublishableKey);
  if (!validUrl || !validKey) {
    console.error('BandPlan configuration is invalid. Check the public Supabase URL and publishable key.');
    window.__bandplanConfigError = true;
  } else {
    window.BANDPLAN_CONFIG = config;
  }
})();
