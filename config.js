/* BandPlan public client configuration. Never place a Supabase service_role secret in browser code. */
// WHY: one validated configuration source prevents URL/key drift between app entry points.
/** @typedef {{ readonly supabaseUrl: string, readonly supabasePublishableKey: string }} BandPlanClientConfig */
/** @typedef {Window & { BANDPLAN_CONFIG?: Readonly<BandPlanClientConfig>, __bandplanConfigError?: boolean }} BandPlanWindow */
(() => {
  'use strict';
  const config = /** @type {Readonly<BandPlanClientConfig>} */ (Object.freeze({
    supabaseUrl: 'https://oczcjphvzoadfqntoqlc.supabase.co',
    supabasePublishableKey: 'sb_publishable_EOBM5JQZQvtXcph4JNFA4w_LjfOjkiY'
  }));
  // WHY: JSDoc adds compile-time checks without changing the browser runtime or script loading order.
  const browserWindow = /** @type {BandPlanWindow} */ (window);
  const validUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl);
  const validKey = /^sb_publishable_[A-Za-z0-9_-]+$/.test(config.supabasePublishableKey);
  if (!validUrl || !validKey) {
    console.error('BandPlan configuration is invalid. Check the public Supabase URL and publishable key.');
    browserWindow.__bandplanConfigError = true;
  } else {
    browserWindow.BANDPLAN_CONFIG = config;
  }
})();
