# Earnslate - Tasks

> **Project:** Earnslate  
> **Version:** 1.1.1  
> **Last Updated:** 2026-01-14

---



## � Bug Fixes

### Critical Priority
- [ ] No critical issues currently.

### High Priority
- [ ] No high priority issues currently.

### Medium Priority
- [ ] No medium priority issues currently.

### Low Priority
- [ ] No low priority issues currently.

---

## 🔧 Code Quality Issues

### Dead Code & Cleanup
- [ ] `POPULAR_SERVICES` imports from `@/data/services` in SubscriptionForm but only uses `ServiceTemplate` type - unused import.
- [ ] Both `lucide-react` (direct imports) and `@iconify/react` (via DynamicIcon) are used for icons. Consider standardizing on one approach.
- [ ] Multiple duplicate pie chart rendering logic in `page.tsx` (dashboard) and `transactions/page.tsx`.

### Type Safety
- [ ] Several places use `any` implicitly or loose typing (e.g., `chartData.reduce` accumulator typing could be stricter).
- [ ] Import validation in `importData` could use Zod schema validation instead of manual checks.

### Code Style
- [ ] Inconsistent component file structure - some files have styles import at top, others at bottom.
- [ ] Magic numbers scattered: `ITEMS_PER_PAGE = 25`, budget thresholds `80`, `90`, `100`.

---

## 🏗️ Architecture Improvements

### High Priority
- [ ] **Centralize Chart Components**: Pie chart and donut chart logic is duplicated across dashboard, transactions, and budgets pages. Extract into reusable `<PieChart>` and `<DonutChart>` components.


### Medium Priority
- [ ] **Consider Context for Settings**: Settings are accessed via Zustand in many components. Consider dedicated SettingsContext for cleaner access patterns.
- [ ] **Add Error Boundaries**: No error boundaries exist - runtime errors will crash entire app.
- [ ] **Move Helper Functions**: `formatCycleDisplay` and `getMonthlyEquivalent` exported from store should be in utils or types file.

### Low Priority
- [ ] **Module-level Side Effects in Store**: Store file has side effects at module level (`useAppStore.persist.rehydrate()`, event listeners) - consider moving to StoreProvider.
- [ ] **Consider Zustand Store Slices**: Single monolithic store could be split into transaction, budget, subscription slices for better organization.

---

## ⚡ Performance Optimizations

### High Priority
- [ ] **Memoize Expensive Calculations**: Dashboard recalculates `monthlyIncome`, `monthlyExpenses`, `spendingByCategory` on every render. Wrap in `useMemo` with proper deps.
- [ ] **Add React.memo to List Items**: Transaction rows, subscription cards, budget cards should be memoized to prevent re-renders.

### Medium Priority
- [ ] **Virtualize Long Lists**: Transactions page shows 25 items per page but could benefit from virtualization for large datasets.
- [ ] **Lazy Load Heavy Components**: ServicePicker with 100+ items could be lazily loaded when modal opens.
- [ ] **Icon Loading**: @iconify/react fetches icons on-demand - consider preloading common icons or using icon bundles.

### Low Priority
- [ ] **Bundle Analysis**: No bundle analyzer configured - add @next/bundle-analyzer to monitor size.
- [ ] **Image Optimization**: Logo and favicon should use next/image for optimization.

---

## ♿ Accessibility (A11y) Issues

### High Priority
- [ ] **Focus Management in Modals**: After modal opens, focus should move to first focusable element. After close, focus should return to trigger.
- [ ] **Announce Toast Messages**: Toast notifications should use aria-live regions for screen readers.
- [ ] **Skip Link Missing**: No skip-to-content link for keyboard users to bypass sidebar navigation.

### Medium Priority
- [ ] **Color Contrast**: Budget status colors (warning yellow, danger red) may not have sufficient contrast in light mode.
- [ ] **Form Error Announcements**: Form validation errors should be announced to screen readers.
- [ ] **Keyboard Navigation in Custom DatePicker**: Arrow keys don't navigate calendar grid.

### Low Priority
- [ ] **Reduce Motion Incomplete**: `prefers-reduced-motion` only affects CSS animations, not JavaScript-driven ones (toasts, modals).

---

## 📚 Documentation Issues

### High Priority
- [ ] **README Version Mismatch**: Badge shows "Next.js-16.0.10" but text says "Next.js 15 (App Router)".
- [ ] **Missing API/Store Documentation**: No JSDoc comments on store actions describing expected behavior.

### Medium Priority
- [ ] **DEVELOPMENT.md Missing Store Reference**: Architecture section doesn't document store structure or actions.
- [ ] **No Component Documentation**: Components lack prop documentation or usage examples.

### Low Priority
- [ ] **Keyboard Shortcuts Not Documented**: KEYBOARD_SHORTCUTS constant exists but isn't exposed in UI or docs.
- [ ] **CHANGELOG Could Use More Detail**: Entry descriptions are brief - consider adding more context.

---

## �🚧 In Progress



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

## � Ideas / Future

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
- **Icons**: Unified via DynamicIcon component using @iconify/react, supports Lucide, SimpleIcons, and brand icons dynamically.
- **Styling**: CSS Modules with design tokens in globals.css. Light/dark theme via data-theme attribute.