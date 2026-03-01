# Earnslate - Tasks

> **Project:** Earnslate  
> **Version:** 1.1.1  
> **Last Updated:** 2026-01-14  
> **Audit Date:** 2026-01-14

---

## 🐛 Bug Fixes

### Critical Priority

- [x] **Data Loss on Import — No Merge Strategy**: `importData()` in store uses `set()` which replaces all state. If a user imports a partial backup (e.g., only transactions), it will **wipe** budgets, subscriptions, and settings to their defaults.
  - **File:** `src/store/index.ts` → `importData` action
  - **Impact:** Silent, irreversible data loss

- [x] **XSS via Imported Data**: `importData()` performs no sanitization on imported JSON values. Malicious `description`, `notes`, or `name` fields containing HTML/script payloads are rendered directly into the DOM via JSX. While React escapes by default, `dangerouslySetInnerHTML` isn't used — but SVG `style` attributes in treemap, pie charts, and inline styles apply attacker-controlled `color` values directly, allowing CSS injection.
  - **File:** `src/store/index.ts` → `importData`, multiple rendering components
  - **Impact:** CSS injection, UI breakage, potential phishing via crafted color/gradient values

- [x] **Race Condition in Store Rehydration**: Store rehydrates at module level (`useAppStore.persist.rehydrate()`) and then runs `checkAndResetBudgets()` / `updateSubscriptionBillingDates()` after a 100ms `setTimeout`. If Next.js renders before rehydration completes, the app briefly shows default state. The `StoreProvider` also reads `state.settings.theme` before confirming hydration is complete.
  - **File:** `src/store/index.ts` (bottom), `src/components/StoreProvider.tsx`
  - **Impact:** Flash of default content, potential incorrect routing during hydration

### High Priority

- [x] **isSubmitting Set After Mutation — Fake Loading State**: In `TransactionForm`, `SubscriptionForm`, and `BudgetForm`, `setIsSubmitting(true)` is called **after** the store mutation has already completed. The data is saved instantly, but the button shows a loading spinner for 300ms purely as fake feedback. If the user navigates away during this 300ms, `onClose()` fires on an unmounted component.
  - **Files:** `TransactionForm.tsx:142-147`, `SubscriptionForm.tsx:185-190`, `BudgetForm.tsx:128-133`
  - **Impact:** React state update on unmounted component warning, misleading UX

- [x] **Budget Spending Calculation Ignores Period**: `getSpentInPeriod()` always calculates from the `lastReset` date forward, but dates are compared as strings (`t.date >= lastReset`). Since `t.date` may be in `YYYY-MM-DD` format while `lastReset` is ISO with timezone info, string comparison can produce incorrect results.
  - **File:** `src/store/index.ts` → `getSpentInPeriod`
  - **Impact:** Budgets may incorrectly include or exclude transactions near the boundary dateline

- [x] **CSV Export Bypasses Display Formatting**: The export logic writes raw values directly correctly mapped (`t.amount` instead of `formatCurrency(t.amount)`, `t.date` instead of `formatDate(t.date)`). This results in CSV files omitting currency symbols, signs (`+`/`-`), and using raw database ISO strings.
  - **File:** `src/app/transactions/page.tsx` → `exportToCSV` block
  - **Impact:** Hard to read exports, mismatched visual format compared to web app display

### Medium Priority

- [x] **Modal `aria-labelledby` Uses Hardcoded ID**: Every `<Modal>` uses `id="modal-title"`, meaning when multiple modals are open simultaneously (e.g., confirm modal over a form modal), there are duplicate IDs in the DOM.
  - **File:** `src/components/Modal.tsx:55,59`
  - **Impact:** Invalid HTML, accessibility tree confusion

- [x] **DatePicker Positioning Uses Fixed Coordinates**: `DatePicker` calculates dropdown position via `getBoundingClientRect()` and applies it as fixed `top`/`left` style. This breaks on scroll, inside scrollable containers, or when the viewport is resized while open.
  - **File:** `src/components/DatePicker.tsx:47-54, 223`
  - **Impact:** Calendar dropdown appears in wrong position after scroll

- [x] **Subscription Next Billing Date Mutation**: In `SubscriptionForm.handleSubmit`, the `start` Date object is mutated in-place via `setHours`/`setDate`/`setMonth`/`setFullYear` to calculate next billing. This is the same object parsed from `startDate`, so side effects are possible.
  - **File:** `src/components/SubscriptionForm.tsx:145-162`
  - **Impact:** Potential date calculation errors for edge cases (month overflow)

- [x] **useEffect Missing Dependencies**: Several `useEffect` hooks have incomplete dependency arrays:
  - `TransactionForm.tsx:106` — Missing `errors.description` dep
  - `TransactionForm.tsx:113` — Missing `errors.amount` dep
  - `SubscriptionForm.tsx:67` — Missing `isOpen` dependency inconsistently
  - **Impact:** Stale closure bugs, React strict mode warnings

### Low Priority

- [ ] **LocalStorage Quota Not Handled**: No error handling around `localStorage.setItem`. If the user accumulates enough data to exceed the ~5-10MB quota, the app will silently fail to persist.
  - **File:** `src/store/index.ts` → Zustand persist middleware
  - **Impact:** Silent data loss on save when quota exceeded

- [ ] **Category Deletion Doesn't Cascade**: Deleting a custom category in settings doesn't update existing transactions or budgets that reference that category. They retain the deleted category name.
  - **File:** `src/store/index.ts` → `removeCustomCategory`
  - **Impact:** Orphaned category references in data

- [ ] **Onboarding Can Be Bypassed via Direct URL**: `StoreProvider` checks `hasCompletedOnboarding` and redirects, but there's a brief window during hydration where the page content is accessible.
  - **File:** `src/components/StoreProvider.tsx:28-46`
  - **Impact:** Minor — user can briefly see content before redirect

---

## 🔐 Security & Data Integrity

### High Priority

- [ ] **No Input Validation on Import**: `importData()` checks `Array.isArray` on top-level fields but doesn't validate individual item shapes. Malformed transactions (missing `id`, wrong `type`, non-numeric `amount`) will corrupt the store.
  - **File:** `src/store/index.ts` → `importData`
  - **Fix:** Add schema validation (Zod recommended) for imported data

- [ ] **No Data Integrity Checks**: No checksums or version stamps on exported data. Importing a backup from a different version with a different schema will silently corrupt state.
  - **File:** `src/store/index.ts` → `importData` / `exportData`
  - **Fix:** Add schema version to exports, validate on import

### Medium Priority

- [ ] **Unvalidated Color Values in Inline Styles**: `color` fields from subscriptions and budgets are used directly in inline `style` attributes (e.g., `style={{ color: sub.color }}`). Crafted values like `red; position: fixed; z-index: 9999` could break layout.
  - **Files:** `SubscriptionTreemap.tsx:67-68`, `subscriptions/page.tsx`, `budgets/page.tsx`
  - **Fix:** Validate color values against hex/rgb pattern

- [ ] **`crypto.randomUUID()` for IDs**: Used for generating transaction/budget/subscription IDs. Works in modern browsers but lacks a fallback. No collision detection.
  - **File:** `src/store/index.ts` → all `add*` actions
  - **Impact:** Will crash in older browsers without `crypto.randomUUID`

---

## 🔧 Code Quality Issues

### Dead Code & Cleanup

- [ ] `POPULAR_SERVICES` imported in `SubscriptionForm.tsx:15` but only `ServiceTemplate` type is actually used from `@/data/services`. The services data is used via `ServicePicker` component instead.
- [ ] `import * as LucideIcons` in `IconPicker.tsx:4` and `ServicePicker.tsx:5` imports the **entire** Lucide icon library. This is a massive bundle-size issue — potentially 100KB+ of unused icons.
- [ ] Dual icon system: `lucide-react` direct imports (in `Sidebar`, `Modal`, `Toast`, `DatePicker`, `Header`, `Button`) and `@iconify/react` (via `DynamicIcon`). Two separate icon libraries loaded simultaneously.
- [ ] `isBrandIcon` exported from `DynamicIcon.tsx` is imported in `SubscriptionForm.tsx:14` but never used.
- [ ] `formatCycleDisplay` imported in `SubscriptionTreemap.tsx:5` from store but never called.
- [ ] Multiple duplicate pie chart rendering logic in `page.tsx` (dashboard) and `transactions/page.tsx`. Same donut chart logic exists in `budgets/page.tsx`.

### Type Safety

- [ ] `LucideIcons as unknown as Record<string, React.ElementType>` cast in `IconPicker.tsx:158,209` and `ServicePicker.tsx:48` is unsafe — silently returns `undefined` for invalid icon names.
- [ ] `formData.category` in forms defaults to magic string `'Other'` — no validation that 'Other' exists in the user's custom categories.
- [ ] Store `importData` uses loose structural checks instead of type guards or schema validation.
- [ ] `chartData.reduce` accumulator typing could be stricter in dashboard page.

### Code Style

- [ ] Inconsistent component file structure — some files have `'use client'` directive, `Card.tsx`, `Button.tsx`, `Input.tsx`, `ProgressBar.tsx` do not.
- [ ] Magic numbers: `ITEMS_PER_PAGE = 25`, budget thresholds `80`/`90`/`100`, toast duration `4000`, submit delay `300`, hydration delay `100`.
- [ ] `PAGE_SIZES = [10, 25, 50]` defined inside component render in `transactions/page.tsx` — should be module-level constant.
- [ ] Inconsistent error handling patterns — some validations use `showToast`, others silently return.

---

## 🏗️ Architecture Improvements

### High Priority

- [ ] **Centralize Chart Components**: Pie chart and donut chart logic is duplicated across dashboard, transactions, and budgets pages. Extract into reusable `<PieChart>` and `<DonutChart>` components.
- [ ] **Add Error Boundaries**: No error boundaries exist — runtime errors will crash entire app with a white screen. Critical for a finance app where data integrity matters.

### Medium Priority

- [ ] **Move Helper Functions Out of Store**: `formatCycleDisplay` and `getMonthlyEquivalent` are pure utility functions exported from the store file. They don't access store state and belong in a utils file.
- [ ] **Module-level Side Effects in Store**: Store file has side effects at module level (`useAppStore.persist.rehydrate()`, `setTimeout`, `visibilitychange` listener). These should be in `StoreProvider` for better control over lifecycle.
- [ ] **Consider Context for Settings**: Settings are accessed via Zustand `useShallow` in many components. A dedicated `SettingsContext` or selector hook would reduce boilerplate.
- [ ] **Standardize Icon System**: Choose one approach — either use `@iconify/react` everywhere (via `DynamicIcon`) or use direct Lucide imports. Current dual approach increases bundle size.
- [ ] **Form Component Abstraction**: `TransactionForm`, `BudgetForm`, `SubscriptionForm` share near-identical validation patterns (validate → setErrors → clear on change). Extract a shared form validation hook.

### Low Priority

- [ ] **Consider Zustand Store Slices**: Single monolithic store (480+ lines) handles transactions, budgets, subscriptions, and settings. Consider splitting into domain slices.
- [ ] **Route-based Code Splitting**: All page components are loaded eagerly. Consider `next/dynamic` for heavy components like `ServicePicker`, `SubscriptionTreemap`.
- [ ] **Constants File**: Budget thresholds, page sizes, animation durations, and other magic numbers should live in a shared constants file.

---

## ⚡ Performance Optimizations

### High Priority

- [ ] **`import * as LucideIcons` Kills Tree-Shaking**: `IconPicker.tsx` and `ServicePicker.tsx` import the entire Lucide library. This pulls in **1000+ icon components** into the bundle. Use specific imports or switch to `@iconify/react` for these components too.
- [ ] **Memoize Expensive Calculations**: Dashboard recalculates `monthlyIncome`, `monthlyExpenses`, `spendingByCategory` on every render. Wrap in `useMemo` with proper deps.
- [ ] **Add React.memo to List Items**: Transaction rows, subscription cards, budget cards are re-rendered when any sibling changes.

### Medium Priority

- [ ] **Virtualize Long Lists**: Transactions page shows all filtered items in pages of 25, but the full array is still filtered/sorted on every render regardless of page.
- [ ] **Lazy Load Heavy Components**: `ServicePicker` with 100+ items, `IconPicker` with 130+ icons, and `SubscriptionTreemap` could use `React.lazy` / `next/dynamic`.
- [ ] **Icon Loading**: `@iconify/react` fetches icons on-demand via network. Consider using icon bundles for offline support and faster renders.
- [ ] **Inline SVG Pie Charts Recalculated Every Render**: Dashboard pie chart `cumulativeAngles` and segment calculations run on every render without memoization.

### Low Priority

- [ ] **Bundle Analysis**: No bundle analyzer configured — add `@next/bundle-analyzer` to monitor size.
- [ ] **CSS Module Composition**: Some components have very similar CSS (form layouts, card patterns). Consider CSS Module `composes` for shared styles.

---

## ♿ Accessibility (A11y) Issues

### High Priority

- [ ] **Focus Trap Missing in Modals**: `Modal.tsx` has `role="dialog"` and `aria-modal="true"` but doesn't implement a focus trap. Tab key can escape the modal to background content.
- [ ] **Focus Management in Modals**: After modal opens, focus should move to first focusable element. After close, focus should return to trigger element.
- [ ] **Announce Toast Messages**: Toast notifications don't use `aria-live` regions. Screen readers won't announce them.
- [ ] **Skip Link Missing**: No skip-to-content link for keyboard users to bypass the 5+ sidebar navigation items.

### Medium Priority

- [ ] **Color Contrast**: Budget status colors (warning yellow `#F59E0B`, danger red on dark background) may not meet WCAG AA 4.5:1 ratio.
- [ ] **Form Error Announcements**: Validation errors update `<span>` text but don't use `aria-describedby` to associate errors with their inputs, and aren't announced via `aria-live`.
- [ ] **Keyboard Navigation in Custom DatePicker**: Arrow keys don't navigate calendar grid days. Only Tab works, which is slow for navigating 30+ day buttons.
- [ ] **Sidebar Backdrop Has No Accessible Name**: Mobile backdrop (`styles.backdrop`) is a clickable `div` without role or accessible name.
- [ ] **Icon-only Buttons Missing Labels**: Several icon-only buttons (edit, delete, toggle in list views) rely on `title` attribute instead of `aria-label`.

### Low Priority

- [ ] **Reduce Motion Incomplete**: `prefers-reduced-motion` only affects CSS transitions, not JavaScript-driven animations (toast appear/dismiss, modal open/close, loading spinner).
- [ ] **Color-only Information**: Budget progress uses color alone (green/yellow/red) to convey status. No text label or pattern alternative for color-blind users.

---

## 📚 Documentation Issues

### High Priority

- [ ] **README Version Mismatch**: Badge shows `Next.js-16.0.10` but body text says "Next.js 15 (App Router)" in the tech stack section.
- [ ] **Missing API/Store Documentation**: No JSDoc comments on store actions describing expected behavior, parameters, or return values.

### Medium Priority

- [ ] **DEVELOPMENT.md Missing Store Reference**: Architecture section doesn't document store structure, actions, or state shape.
- [ ] **No Component Documentation**: Components lack prop documentation or usage examples.
- [ ] **DEVELOPMENT.md Says "No .env Required"**: This is correct now, but if cloud sync or other features are added, this should be updated proactively.

### Low Priority

- [ ] **Keyboard Shortcuts Not Documented in UI**: `KEYBOARD_SHORTCUTS` constant exists in `useKeyboardShortcuts.ts` but the shortcuts panel (`Ctrl+/`) is implemented — verify it's discoverable.
- [ ] **CHANGELOG Could Use More Detail**: Entry descriptions are brief — consider adding more context for future contributors.
- [ ] **No CONTRIBUTING.md**: Project has contribution guidelines buried in `DEVELOPMENT.md` but no dedicated `CONTRIBUTING.md`.

---

## 🚧 In Progress

_(none)_

---

## 📋 To Do

### High Priority

- [ ] **PWA Support**: Service worker for offline functionality, install prompt
- [ ] **Recurring Transactions**: Auto-create transactions based on subscriptions
- [ ] **Search Across All Modules**: Global search for transactions, budgets, subscriptions
- [ ] **Data Persistence Options**: Cloud sync (Supabase/Firebase), IndexedDB for larger datasets

### Medium Priority

- [ ] **Transaction Attachments**: Upload receipts/images for transactions
- [ ] **Multi-Currency Support**: Track finances in multiple currencies with conversion
- [ ] **Budget Rollover**: Option to carry over remaining budget to next period
- [ ] **Subscription Reminders**: Notification before billing date
- [ ] **Dashboard Widgets**: Customizable dashboard layout
- [ ] **Transaction Templates**: Save frequent transactions for quick entry
- [ ] **Reports**: Monthly/yearly summaries, spending trends graphs

### Low Priority

- [ ] **Biometric Lock**: App lock with fingerprint/face recognition
- [ ] **Dark/Light Mode Scheduling**: Auto-switch based on time of day
- [ ] **Data Export to PDF/Excel**: Additional export formats
- [ ] **Localization**: Multi-language support (i18n)
- [ ] **Accessibility Audit**: Full WCAG 2.1 compliance check

---

## 💡 Ideas / Future

- [ ] Universal icon picker (all Iconify libraries)
- [ ] Subscription due notifications
- [ ] Enhanced empty states with illustrations
- [ ] Automated testing suite (Jest + React Testing Library)
- [ ] E2E tests with Playwright
- [ ] Storybook for component documentation

---

## 🏗️ Architecture Notes

- **Data Sync**: Using Zustand `persist` middleware with `skipHydration: true` and manual rehydration in store module. Consider moving side effects to StoreProvider.
- **Charts**: Custom SVG implementation for zero dependencies. Consider extracting to reusable components if complexity grows.
- **Icons**: Unified via DynamicIcon component using @iconify/react, supports Lucide, SimpleIcons, and brand icons dynamically. However, direct `lucide-react` imports are still used in many components, creating a dual icon system.
- **Styling**: CSS Modules with design tokens in globals.css. Light/dark theme via data-theme attribute.
- **State**: Single monolithic Zustand store handles all domain data and settings. Module-level side effects handle rehydration and maintenance tasks.