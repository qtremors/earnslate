# Earnslate Tasks

## 🔴 Bugs & Issues

All resolved ✅

---

## 🟡 Missing Features

### High Priority
- [x] Pagination for transactions list - 25 items per page with prev/next controls
- [x] Keyboard shortcuts for common actions - Ctrl+N (new transaction), Ctrl+D/T/B (navigation)
- [x] Date range presets - All Time, Today, This Week, This Month, Last 30/90 Days, Custom

### Medium Priority
- [ ] Subscription due reminders/notifications (requires notification API)
- [ ] Recurring transactions (not just subscriptions)
- [ ] Undo/redo for deletions
- [ ] Batch delete operations
- [ ] Budget period reset notifications

### Low Priority / Future (Deferred)
- PWA/offline support
- Cloud sync
- Multi-currency support
- Data export to PDF/Excel
- Dark/light mode transitions

---

## 🟢 UI/UX Improvements

### Polish (Deferred)
- Empty states improvements
- Onboarding name collection
- Skeleton loaders
- Chart tooltips

### Accessibility
- [x] ARIA labels present on icon-only buttons

---

## ⚡ Optimization (Deferred)

- Memoization
- Virtual scrolling
- Lazy loading
- Category indexing

---

## 🧹 Code Quality (Deferred)

- TypeScript strictness
- Unit tests
- Icon consolidation
- JSDoc comments
- Chart extraction

---

## ✅ Recently Completed

- [x] Fix `calculateNextBilling()` month boundary bug
- [x] Unify icon handling with `DynamicIcon.tsx`
- [x] Centralize formatting with `useFormatters` hook
- [x] Add input sanitization for data import
- [x] Remove react-icons dependency
- [x] Fix pie chart legend
- [x] Improve color contrast (WCAG AA)
- [x] Add icon/color pickers to category editor
- [x] Mobile responsive sidebar
- [x] Inline DAYS_PER_MONTH in getMonthlyEquivalent
- [x] Replace hardcoded CATEGORY_ICONS with DynamicIcon
- [x] Replace LucideIcons bundle imports with DynamicIcon/Iconify
- [x] Fix BudgetForm icon defaults
- [x] Remove unused ICON_OPTIONS and formatCycle
- [x] Add pagination to transactions (25 items/page)
- [x] Add date range presets (7 quick options)
- [x] Refactor DynamicIcon to use Iconify for all icons
- [x] Add visibility-change listener for budget period reset
- [x] Enhanced JSON import validation
- [x] Add keyboard shortcuts (Ctrl+N, Ctrl+D/T/B)

---

*Deep review completed: 2025-12-16*
*All bugs resolved, high priority features implemented*
