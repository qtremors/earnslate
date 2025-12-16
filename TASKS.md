# Earnslate Tasks

## 🔴 Critical Bugs
- [x] Fix `calculateNextBilling()` month boundary bug in `src/types/index.ts`
- [x] Remove unused `isFormOpen` state and `TransactionForm` import in `src/app/page.tsx`
- [ ] Fix React hook dependency warnings in forms

## 🟠 Logic Inconsistencies
- [x] Unify 4 different icon handling patterns into single utility
- [ ] Standardize transaction amount sign convention (negative vs absolute)
- [ ] Fix budget category matching (case-insensitive match, case-sensitive display)

## 🟡 Half-Baked Features
- [x] Fix `formatDate()` locale parameter - now uses Intl.DateTimeFormat
- [ ] Add icon/color pickers to category editor in settings
- [x] Integrate `DynamicIcon.tsx` properly or remove dead code

## 💀 Dead Code Cleanup
- [x] Remove unused `TransactionForm` import from dashboard
- [x] Remove unused `ArrowUpDown` import from transactions page
- [x] Remove largely unused `DynamicIcon.tsx` utilities
- [x] Fix `locale` parameter in `formatDate()` function
- [x] Sync `APP_VERSION` constant with `package.json` version

## ⚡ Performance
- [ ] Optimize `useShallow` selectors for granular property access
- [x] Memoize chart SVG path calculations in budgets page
- [x] Consider migrating fully to Iconify (remove react-icons bloat)
- [ ] Add category-indexed lookup for budget matching

## 🎨 UI/UX Improvements
- [ ] Add loading states during delete operations
- [x] Fix pie chart legend showing only 5 items while chart shows all
- [x] Improve mobile responsiveness (sidebar collapse, toolbar overflow)
- [ ] Standardize button placement across modals and forms
- [ ] Check color contrast for accessibility (WCAG)

## 📚 Code Quality
- [x] Centralize `formatCurrency()` - duplicated in 4+ files
- [ ] Add stricter TypeScript checks (`noUncheckedIndexedAccess`)
- [ ] Add input sanitization for form data

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

---

*Last updated: 2025-12-16*
