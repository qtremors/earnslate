# Earnslate Tasks

## 🔜 Future Enhancements
- [ ] Add pagination for transactions list
- [ ] Subscription due reminders/notifications
- [ ] PWA/offline support
- [ ] Recurring transactions (not just subscriptions)
- [ ] Cloud sync (optional)
- [ ] Undo/redo for deletions
- [ ] Batch delete operations
- [ ] Dashboard date range filter (beyond "this month")
- [ ] Budget period reset notifications
- [ ] Data validation on import
- [ ] Multi-currency support
- [ ] Add stricter TypeScript checks (`noUncheckedIndexedAccess`) - requires extensive refactoring

---

## ✅ Completed

### Critical Bugs
- [x] Fix `calculateNextBilling()` month boundary bug
- [x] Remove unused `isFormOpen` state and `TransactionForm` import
- [x] Fix React hook dependency warnings

### Logic & Code
- [x] Unify 4 different icon handling patterns (`DynamicIcon.tsx`)
- [x] Fix `formatDate()` locale parameter (Intl.DateTimeFormat)
- [x] Integrate `DynamicIcon.tsx` properly
- [x] Standardize transaction amount sign convention (negative for expenses)
- [x] Budget category matching uses case-insensitive comparison

### Dead Code Cleanup
- [x] Remove unused imports (TransactionForm, ArrowUpDown)
- [x] Sync `APP_VERSION` with `package.json`

### Performance
- [x] Memoize chart SVG path calculations
- [x] Migrate to Iconify (removed react-icons)
- [x] `useShallow` selectors already optimized

### UI/UX
- [x] Fix pie chart legend (shows all categories)
- [x] Mobile responsiveness (sidebar collapse)
- [x] Add icon/color pickers to category editor
- [x] Color contrast improved for WCAG AA compliance
- [x] Delete operations have confirmation modal (loading state not needed for sync localStorage)
- [x] Button placement standardized in modals (Cancel left, Action right)

### Code Quality
- [x] Centralize `formatCurrency()` via `useFormatters` hook
- [x] Add input sanitization for data import

---

*Last updated: 2025-12-16*
