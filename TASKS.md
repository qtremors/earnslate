# Earnslate Tasks

## 🔴 Critical (Fix Immediately)
- [x] Budget-transaction sync race condition (multiple set() calls)
- [x] Date comparison timezone issues in billing updates
- [x] Settings import data loss risk (clearAllData race)

## 🟠 High Priority
- [x] Remove unused `firstDayOfWeek`, `monthStartDay`, `tags` settings
- [x] Delete dead code: HydrationGuard.tsx (never imported)
- [x] Fix export version (shows 0.3.0, should be 0.5.0)
- [x] Fix settings page version (shows 0.4.0, should be 0.5.0)
- [x] Add validation to BudgetForm and SubscriptionForm
- [x] Add error toast for JSON import failure

## 🟡 Medium Priority
- [x] Consolidate duplicated `chartColors` arrays to shared constant
- [ ] Consolidate `formatCurrency` functions to shared utility
- [ ] Actually use Button `loading` prop in form submissions
- [ ] Optimize store selectors for fewer re-renders
- [ ] Dynamic imports for icon libraries (bundle size)
- [ ] Add accessibility ARIA labels to interactive elements
- [ ] Replace hardcoded 'en-IN' locale with configurable setting
- [ ] Add note to Treemap about showing active subscriptions only

## 🟢 Low Priority (Polish)
- [x] Replace deprecated onKeyPress with onKeyDown in settings
- [ ] Replace inline styles in StoreProvider with CSS variables
- [ ] Adjust spinner size based on Button size prop
- [ ] Add more category icons to Dashboard CATEGORY_ICONS
- [ ] Consider using 30.44 for DAYS_PER_MONTH accuracy
- [ ] Remove unused `tags` field from Transaction type - DONE (included in critical)

---

## ✅ Recently Completed (v0.5.0 + v0.6.0)
- Budget period reset (auto-resets on app load)
- Subscription billing date auto-update
- Category type mismatch fix
- Toast notification system
- Form validation feedback (all forms now)
- Transaction search in Dashboard
- Mobile hamburger menu
- Loading states for buttons
- Chart hover tooltips
- Styled confirm dialogs (all pages)
- Code quality improvements
- Fixed race conditions in transaction/budget sync
- Fixed timezone issues
- Fixed import safety
- Deleted dead code
- Consolidated chart colors

---

*Last updated: 2025-12-15*
