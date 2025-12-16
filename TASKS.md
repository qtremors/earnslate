# Earnslate Tasks

## � Active Tasks

### Logic Inconsistencies
- [ ] Standardize transaction amount sign convention (negative vs absolute)
- [ ] Fix budget category matching (case-insensitive match, case-sensitive display)

### Half-Baked Features
- [ ] Add icon/color pickers to category editor in settings

### Performance
- [ ] Optimize `useShallow` selectors for granular property access
- [ ] Add category-indexed lookup for budget matching

### UI/UX Improvements
- [ ] Add loading states during delete operations
- [ ] Standardize button placement across modals and forms
- [ ] Check color contrast for accessibility (WCAG)

### Code Quality
- [ ] Add stricter TypeScript checks (`noUncheckedIndexedAccess`)

---

## � Future Enhancements
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

### Dead Code Cleanup
- [x] Remove unused imports (TransactionForm, ArrowUpDown)
- [x] Sync `APP_VERSION` with `package.json`

### Performance
- [x] Memoize chart SVG path calculations
- [x] Migrate to Iconify (removed react-icons)

### UI/UX
- [x] Fix pie chart legend (shows all categories)
- [x] Mobile responsiveness (sidebar collapse)

### Code Quality
- [x] Centralize `formatCurrency()` via `useFormatters` hook
- [x] Add input sanitization for data import

---

*Last updated: 2025-12-16*
