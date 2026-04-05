# Earnslate - Tasks

> **Project:** Earnslate (earnslate-web)  
> **Note:** The `earnslate-android` project is currently a placeholder for future development with no active tasks.  
> **Version:** 1.2.0
> **Last Updated:** 2026-04-05

---

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

- [ ] `import * as LucideIcons` in `IconPicker.tsx:4` and `ServicePicker.tsx:5` imports the **entire** Lucide icon library. This is a massive bundle-size issue — potentially 100KB+ of unused icons.
- [ ] Dual icon system: `lucide-react` direct imports (in `Sidebar`, `Modal`, `Toast`, `DatePicker`, `Header`, `Button`) and `@iconify/react` (via `DynamicIcon`). Two separate icon libraries loaded simultaneously.
- [ ] Multiple duplicate pie chart rendering logic in `page.tsx` (dashboard) and `transactions/page.tsx`. Same donut chart logic exists in `budgets/page.tsx`.

### Type Safety

- [ ] `LucideIcons as unknown as Record<string, React.ElementType>` cast in `IconPicker.tsx:158,209` and `ServicePicker.tsx:48` is unsafe — silently returns `undefined` for invalid icon names.
- [ ] `formData.category` in forms defaults to magic string `'Other'` — no validation that 'Other' exists in the user's custom categories.
- [ ] Store `importData` uses loose structural checks instead of type guards or schema validation.
- [ ] `chartData.reduce` accumulator typing could be stricter in dashboard page.

### Code Style

- [ ] Inconsistent component file structure — some files have `'use client'` directive, `Card.tsx`, `Button.tsx`, `Input.tsx`, `ProgressBar.tsx` do not.
- [ ] Magic numbers: `ITEMS_PER_PAGE = 25`, budget thresholds `80`/`90`/`100`, toast duration `4000`, submit delay `300`, hydration delay `100`.
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