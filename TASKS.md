# Earnslate Tasks

## 🔴 Critical
*None identified*

---

## 🟠 High Priority

### Code Consistency
- [ ] TransactionForm missing `loading` prop on submit button (inconsistent with BudgetForm/SubscriptionForm)
- [ ] Budgets page has local `chartColors` array instead of using shared `CHART_COLORS` from types

### Store Optimizations
- [ ] Transactions, Budgets, Subscriptions pages not using `useShallow` (only Settings and Dashboard use it)
- [ ] TransactionForm, BudgetForm, SubscriptionForm not using `useShallow` for store selectors

---

## 🟡 Medium Priority

### Bundle Size / Performance
- [ ] DynamicIcon.tsx created but not used anywhere - components still use `import * as LucideIcons`
  - SubscriptionTreemap.tsx
  - SubscriptionForm.tsx
  - IconPicker.tsx
  - Budgets page
  - Subscriptions page
  - ServicePicker.tsx
- [ ] `formatCycleDisplay` is imported but unused in SubscriptionTreemap (has local `getCycleLabel` instead)

### Missing Features
- [ ] Onboarding doesn't set locale when selecting currency (should match currency to locale)
- [ ] TransactionForm has no category icon/color picker (unlike BudgetForm)
- [ ] No date range filter on transactions page (only category/type filters)
- [ ] No sorting options on any list page (transactions, budgets, subscriptions)

### UI/UX Improvements
- [ ] Dashboard "Add Transaction" button missing (only modal triggered from external TransactionForm)
- [ ] Empty state buttons not consistent across pages (some use `+` icon, some don't)
- [ ] Mobile view toggle buttons lack text labels (only icons)

---

## 🟢 Low Priority

### Code Quality
- [ ] Consider using 30.44 for DAYS_PER_MONTH accuracy (currently 30)
- [ ] `dateFormat` setting is stored but not actually used anywhere for formatting dates

### Cleanup
- [ ] Dashboard page imports `CreditCard` icon but doesn't use it
- [ ] Dashboard page imports `Plus` but doesn't use it (no floating add button)

---

## 🔜 Future Enhancements
- Subscription due reminders (notifications/badges)
- Dark/Light theme toggle
- PWA/offline support  
- Data export to CSV (transactions page has this, extend to budgets/subscriptions)
- Recurring transactions
- Category management with icon/color editing
- Budget history/trends chart
- Subscription spending trends over time

---

*Last updated: 2025-12-16*
