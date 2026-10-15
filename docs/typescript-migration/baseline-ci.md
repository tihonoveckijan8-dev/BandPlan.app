# BandPlan baseline CI report

Date: 2026-10-15  
Repository: `tihonoveckijan8-dev/BandPlan.app`  
Branch: `migration/import-grouppp-baseline`  
Pull request: [#1 — Import existing BandPlan app baseline](https://github.com/tihonoveckijan8-dev/BandPlan.app/pull/1)  
Commit: `a5ffc9e2633da2487f23470532a3cc9f5211581f`

## Results

| Check | Result | Notes |
|---|---|---|
| JavaScript syntax check | PASS | Existing syntax workflow passed. |
| Auth/browser smoke test | PASS | Workflow's full smoke job passed, including build, Chromium and assertions for auth bootstrap, IndexedDB/offline queues and other existing contracts. |
| Production build | PASS | `npm run build` completed inside Auth Smoke and Lighthouse workflows. |
| Lighthouse budgets | PASS | Lighthouse run, budgets and PWA shell validation passed. |
| Design contrast audit | FAIL | Existing `tests/design-contrast.mjs` reports 80 hardcoded CSS color occurrences, including preset/status colors and shorthand colors. It reports 0 allowed versus 80 found. |

## Interpretation

The import baseline is buildable under GitHub Actions and the existing browser smoke suite passes. The design-contrast failure is a pre-existing design-token audit issue in the imported CSS/test contract, not a TypeScript compilation failure. The CSS was intentionally not changed because this task is a behavior-preserving migration and the design audit is outside the initial migration scope.

Do not suppress or weaken the contrast test just to make CI green. In a separate approved task, classify legitimate semantic/status/preset colors versus accidental hardcoded values, then migrate only confirmed design-token candidates and update the test intentionally.

## Scope and limitations

- All 53 source files from `grouppp/main` were copied to this branch, and every source file path and Git blob SHA was verified against the source tree.
- `main` was not modified; PR #1 remains the review gate.
- GitHub Actions tested the PR merge checkout, not a separately configured GitHub Pages deployment. The Pages deploy workflow only runs on pushes to `main` or manual dispatch, so no deployment occurred.
- Supabase production configuration, external email confirmation, multi-account sync and installed native builds were not tested by this CI run.
- No runtime JavaScript/HTML/CSS/Supabase/Service Worker code has been converted to TypeScript yet.
