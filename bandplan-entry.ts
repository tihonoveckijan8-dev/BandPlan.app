/**
 * BandPlan browser bootstrap.
 * WHY: keep the loader's runtime behavior small and typed without pulling the legacy core
 * into the first strict TypeScript migration boundary.
 */

type BandPlanBootContainer = HTMLElement & {
  querySelector(selectors: '.boot-core'): HTMLElement | null;
};

interface BandPlanLoaderWindow extends Window {
  __bandplanCorePromise?: Promise<unknown>;
  __bandplanEnsureCore?: () => Promise<unknown>;
}

(() => {
  'use strict';

  const browserWindow = window as BandPlanLoaderWindow;
  const coreModulePath: string = './bandplan-core.js';

  const loadCore = (): Promise<unknown> => {
    if (browserWindow.__bandplanCorePromise) return browserWindow.__bandplanCorePromise;

    // WHY: use a variable path so this small module can be checked independently of the legacy core.
    browserWindow.__bandplanCorePromise = import(coreModulePath).catch((error: unknown) => {
      console.error('BandPlan core failed to load:', error);
      const boot = document.getElementById('boot') as BandPlanBootContainer | null;
      if (boot) {
        boot.classList.add('is-error');
        let core = boot.querySelector('.boot-core');
        // WHY: cached or older HTML must still expose a visible bootstrap error if the expected container is missing.
        if (!core) {
          core = document.createElement('div');
          core.className = 'boot-core';
          boot.replaceChildren(core);
        }
        boot.setAttribute('role', 'alert');
        core.innerHTML =
          '<div class="boot-error-title">Не удалось загрузить BandPlan</div>' +
          '<div class="boot-error-text">Проверьте подключение и повторите запуск. Сохранённые данные не удалены.</div>' +
          '<div class="boot-acts"><button type="button" id="bootRetry">Повторить</button></div>';
        const retry = document.getElementById('bootRetry');
        if (retry) retry.addEventListener('click', () => location.reload(), { once: true });
      }
      throw error;
    });
    return browserWindow.__bandplanCorePromise;
  };

  /*
    Do not make core loading depend on the one-shot auth-ready CustomEvent.
    Supabase may restore an existing session before this module's listener is
    attached. The core already treats Supabase Auth as the source of truth and
    waits for initialize(), so loading it deterministically is safer and avoids
    the "login succeeds but the app never opens" race.
  */
  browserWindow.__bandplanEnsureCore = loadCore;
  // WHY: INITIAL_SESSION may fire before this deferred script executes; notify Auth waiters instead of failing a valid startup.
  window.dispatchEvent(new Event('bandplan:core-loader-ready'));
  // Core stays deferred until Supabase has resolved authentication.
})();
