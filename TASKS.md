# Earnslate Tasks

## 🔴 Bugs & Issues

### Bundle Size / Performance
- [x] **Dashboard uses hardcoded CATEGORY_ICONS** - now uses DynamicIcon with settings lookup
- [x] **budgets/page.tsx imports entire LucideIcons bundle** - now uses DynamicIcon
- [ ] **DynamicIcon.tsx imports entire LucideIcons bundle** - consider lazy loading or direct imports (lower priority)

### Dead Code / Unused
- [x] **store/index.ts: `DAYS_PER_MONTH` constant** - inlined into `getMonthlyEquivalent` function
- [ ] **types/index.ts: `ICON_OPTIONS` partially redundant** with IconPicker's own list
- [ ] **types/index.ts: `formatCycle` function** - similar to `formatCycleDisplay` in store (potential duplicate)

### Logic / Data
- [ ] **BudgetForm icon defaults inconsistent** - line 25 uses 'Wallet', line 58 uses 'UtensilsCrossed'
- [ ] **No data validation on JSON import** - could import corrupted data beyond sanitization
- [ ] **Budget period reset only checked on app load** - not real-time if app stays open

---

## 🟡 Missing Features

### High Priority
- [ ] Pagination for transactions list (performance issue with 1000+ items)
- [ ] Keyboard shortcuts for common actions (Ctrl+N for new transaction)
- [ ] Date range presets (This Week, Last Month, Last 90 Days)

### Medium Priority
- [ ] Subscription due reminders/notifications
- [ ] Recurring transactions (not just subscriptions)
- [ ] Undo/redo for deletions
- [ ] Batch delete operations
- [ ] Budget period reset notifications

### Low Priority / Future
- [ ] PWA/offline support
- [ ] Cloud sync (optional)
- [ ] Multi-currency support
- [ ] Data export to PDF/Excel
- [ ] Dark/light mode transitions (currently instant, could animate)

---

## 🟢 UI/UX Improvements

### Polish
- [ ] Empty states could be more engaging (add illustrations or suggestions)
- [ ] Onboarding could collect user name
- [ ] Add skeleton loaders for initial hydration
- [ ] Chart tooltips for better data exploration

### Accessibility
- [ ] Add ARIA labels to icon-only buttons consistently
- [ ] Add focus trap for modals
- [ ] Ensure all interactive elements have focus styles

---

## ⚡ Optimization Opportunities

- [ ] Memoize more expensive calculations (e.g., category totals)
- [ ] Consider virtual scrolling for large transaction lists
- [ ] Lazy load subscription treemap component
- [ ] Add category-indexed lookup for O(1) budget matching

---

## 🧹 Code Quality

- [ ] Add stricter TypeScript checks (`noUncheckedIndexedAccess`)
- [ ] Add unit tests for store actions and utility functions
- [ ] Consolidate duplicate icon handling patterns
- [ ] Add JSDoc comments to utility functions
- [ ] Consider extracting chart rendering logic to reusable components

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
- [x] Replace LucideIcons bundle import in budgets page

---

*Deep review completed: 2025-12-16*
*Scanned: store (411 lines), types (282 lines), 5 pages, 35 components, 2 hooks*
