# Earnslate - Tasks & Roadmap

> Last reviewed: 2025-12-18

---

## 🐛 Bugs & Issues

### Critical

- [ ] **Missing Onboarding Redirect**: New users are not redirected to `/onboarding` page. The `hasCompletedOnboarding` flag exists but no redirect logic in the app.
- [ ] **Selection State Persists Across Filter Changes**: In transactions page, selected items persist when applying filters that may hide those items, leading to potential deletion of hidden transactions.

### Medium

- [ ] **Budget Reset Not Synchronized with Transactions**: When budget period resets (`checkAndResetBudgets`), existing transactions within the new period are not re-counted towards the new period's spent amount.
- [ ] **Date Picker Native vs Custom**: Custom `DatePicker` component exists but transactions form uses native HTML date input, causing inconsistent UX.
- [ ] **CSV Export Doesn't Escape Commas**: If transaction description contains commas, CSV export will be malformed.

### Low

- [ ] **formatCurrencyCompact Hardcoded Values**: Uses Indian numbering system (Cr/L) regardless of locale for compact currency display.
- [ ] **Unused Variable**: `iconType` in `SubscriptionForm.tsx` is set but never read for conditional logic.
- [ ] **Missing Error Boundary**: No React error boundary to gracefully handle runtime errors.

---

## 🔧 Logic & Consistency Issues

### Data Management

- [ ] **Budget-Transaction Sync Race Condition**: When editing a transaction's amount/category, budget spent calculations may be incorrect if the transaction was created before the budget was added.
- [ ] **Import Data Replaces Instead of Merges**: Data import completely replaces existing data rather than offering merge options.
- [ ] **Subscription Billing Date Calculation**: For monthly subscriptions starting on 31st, next billing may jump to March after February instead of staying on last day of month (edge case in `calculateNextBilling`).

### Type Safety

- [ ] **Transaction Amount Sign Convention**: Transactions store negative amounts for expenses, but some calculations use `Math.abs()` inconsistently. Standardize the approach.
- [ ] **Missing Null Checks**: `existingTransaction?.notes` access in TransactionForm useEffect doesn't handle undefined gracefully.

### State Management

- [ ] **Subscription `updateSubscriptionBillingDates` Called on Every Mount**: May cause performance issues with large numbers of subscriptions. Consider memoization or debouncing.
- [ ] **Multiple Store Rehydrations**: `visibilitychange` event may trigger redundant budget/subscription updates.

---

## 🧩 Half-Baked Features

### Onboarding Flow

- [ ] Onboarding page exists but is never shown to new users
- [ ] No option to re-trigger onboarding from settings
- [ ] Missing name input step (currently only currency selection)

### Keyboard Shortcuts

- [ ] `Ctrl+S` documented in README but not implemented for subscriptions navigation
- [ ] `Ctrl+N` only works on transactions page, not globally
- [ ] No keyboard shortcut help modal/panel

### Settings

- [ ] Category type (`income`/`expense`/`both`) is stored but editing it is not exposed in the UI
- [ ] No undo/redo for settings changes
- [ ] Theme selection doesn't show preview before applying

---

## 💀 Dead Code & Unused Items

### Files & Functions

- [ ] `formatCurrency`, `formatCurrencyCompact`, `formatDate`, `formatDateShort`, `formatDateFull` in `types/index.ts` are duplicated by `useFormatters` hook
- [ ] `isBrandIcon` function in `DynamicIcon.tsx` is exported but never used externally
- [ ] `normalizeIconName` function exported but unused
- [ ] Public folder contains unused SVGs: `window.svg`, `next.svg`, `globe.svg`, `file.svg`

### CSS

- [ ] Audit CSS modules for unused classes (several `.module.css` files may have orphaned selectors)

---

## ⭐ Missing Features

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

## 🎨 UI/UX Improvements

### Forms & Inputs

- [ ] Add currency input mask (format as user types)
- [ ] Auto-focus first field when modals open
- [ ] Show loading skeleton instead of "Loading..." text in StoreProvider
- [ ] Add form field hints/help text
- [ ] Implement shake animation on validation errors

### Navigation & Feedback

- [ ] Add breadcrumbs for nested pages
- [ ] Show confirmation toast when data is exported
- [ ] Add empty state illustrations (instead of plain text)
- [ ] Implement skeleton loaders for charts and lists
- [ ] Add swipe-to-delete on mobile for list items

### Charts & Visualizations

- [ ] Add animation to pie chart on load
- [ ] Implement hover tooltips on chart segments
- [ ] Add trend indicators (up/down arrows) on dashboard
- [ ] Show sparklines for transaction history

### Responsive Design

- [ ] Improve table responsiveness on mobile (horizontal scroll or card view)
- [ ] Optimize filter toolbar for mobile (collapsible or bottom sheet)
- [ ] Test and fix layout on tablets

---

## ⚡ Performance & Efficiency

### Bundle Size

- [ ] Analyze bundle with `next build --analyze`
- [ ] Consider lazy loading for settings page modals
- [ ] Code-split ServicePicker (100+ services list)
- [ ] Use `next/dynamic` for IconPicker component

### Rendering

- [ ] Virtualize long transaction lists (react-window or similar)
- [ ] Memoize expensive chart calculations
- [ ] Debounce search input to reduce re-renders
- [ ] Use `useTransition` for non-urgent state updates

### Data

- [ ] Implement pagination in store for large datasets
- [ ] Add data archival for old transactions
- [ ] Compress localStorage data (consider LZString)

---

## 🔐 Resource Usage & Security

### localStorage

- [ ] Implement localStorage quota check and warning
- [ ] Add data migration system for schema changes
- [ ] Encrypt sensitive data before storing

### Security

- [ ] Sanitize all user inputs (XSS prevention)
- [ ] Add Content Security Policy headers
- [ ] Implement rate limiting for import operations

---

## 📚 Documentation

### README.md

- [ ] Add screenshots/GIFs of the app in action
- [ ] Include troubleshooting section for common issues
- [ ] Add deployment guide for Vercel/Netlify
- [ ] Document all environment variables (if any)

### Code Documentation

- [ ] Add JSDoc comments to store actions
- [ ] Document CSS variable naming convention
- [ ] Add component prop documentation (TypeDoc or Storybook)

### Missing Docs

- [ ] Create PRIVACY.md (data handling, no telemetry)
- [ ] Create SECURITY.md (responsible disclosure policy)
- [ ] Add inline comments for complex logic (billing calculations)

---

## 🧪 Testing

### Priority Tests Needed

- [ ] **Unit Tests**: Store actions, utility functions, formatters
- [ ] **Component Tests**: TransactionForm, BudgetForm, SubscriptionForm
- [ ] **Integration Tests**: Add transaction → budget updates
- [ ] **E2E Tests**: Full user flows (onboarding, add transaction, create budget)

### Test Setup

- [ ] Install Jest + React Testing Library
- [ ] Configure test environment for Next.js 15
- [ ] Add CI/CD pipeline with test runs

---

## 🏗️ Code Quality

### Refactoring

- [ ] Extract pie chart logic into reusable `PieChart` component
- [ ] Create shared `usePagination` hook
- [ ] Consolidate date formatting functions (remove duplicates in types)
- [ ] Extract CSV export logic into utility function

### TypeScript

- [ ] Enable stricter ESLint rules
- [ ] Add explicit return types to all functions
- [ ] Use branded types for IDs (TransactionId, BudgetId, etc.)

### Architecture

- [ ] Consider React Query for potential future API integration
- [ ] Evaluate moving to Jotai for finer-grained state updates
- [ ] Add error logging service integration point

---

## 📋 Quick Wins (< 1 hour each)

1. [ ] Add `aria-label` to all icon buttons for accessibility
2. [ ] Fix favicon to use .ico format properly
3. [ ] Add `<meta name="theme-color">` for mobile browsers
4. [ ] Implement `Ctrl+S` keyboard shortcut for subscriptions
5. [ ] Add onboarding redirect check in layout
6. [ ] Fix CSV export to escape commas in values
7. [ ] Remove unused SVGs from public folder
8. [ ] Add loading state to Export buttons during file generation
