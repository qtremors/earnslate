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
- [x] Add shared formatCurrency and formatCurrencyCompact utilities
- [ ] Actually use Button `loading` prop in form submissions
- [ ] Optimize store selectors for fewer re-renders
- [ ] Dynamic imports for icon libraries (bundle size)
- [ ] Add accessibility ARIA labels to interactive elements
- [ ] Replace hardcoded 'en-IN' locale with configurable setting
- [x] Add note to Treemap about showing active subscriptions only

## 🟢 Low Priority (Polish)
- [x] Replace deprecated onKeyPress with onKeyDown in settings
- [x] Replace inline styles in StoreProvider with CSS variables
- [x] Adjust spinner size based on Button size prop
- [x] Add more category icons to Dashboard CATEGORY_ICONS
- [ ] Consider using 30.44 for DAYS_PER_MONTH accuracy

---

## ✅ Completed This Session (v0.6.0)
- Fixed race conditions in transaction/budget sync (atomic updates)
- Fixed timezone issues in billing date comparisons  
- Fixed import safety (removed clearAllData race)
- Deleted dead code (HydrationGuard.tsx)
- Removed unused fields (firstDayOfWeek, monthStartDay, tags)
- Added validation to BudgetForm and SubscriptionForm
- Added error toast for invalid import files
- Fixed version numbers (export + settings page)
- Replaced deprecated onKeyPress with onKeyDown
- Consolidated CHART_COLORS to shared constant
- Added formatCurrency and formatCurrencyCompact utilities
- Added info note to TreeMap for active subscription count
- Replaced StoreProvider inline styles with CSS module
- Added more category icons to Dashboard
- Adjusted Button spinner size based on size prop

---

*Last updated: 2025-12-15*
