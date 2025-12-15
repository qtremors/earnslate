# Tasks

> **Project:** Earnslate  
> **Version:** v0.1.0  
> **Last Updated:** 2025-12-15

---

## 🔴 Critical (Fix Now)

*No critical issues*

---

## 🟠 High Priority

### [ ] Design System Foundation
- **Problem:** Need to establish monochrome theme with inverted accents
- **Fix:** Create CSS variables, typography, and base styles in `globals.css`
- **Files:** `src/app/globals.css`

### [ ] App Shell & Navigation
- **Problem:** Need sidebar navigation and layout structure
- **Fix:** Create Sidebar component and update root layout
- **Files:** `src/app/layout.tsx`, `src/components/Sidebar.tsx`

### [ ] Dashboard Page
- **Problem:** Replace default Next.js page with dashboard
- **Fix:** Build financial overview with summary cards and recent transactions
- **Files:** `src/app/page.tsx`

---

## 🟡 Medium Priority

### [ ] Transactions Page
- **Problem:** Need transaction tracking functionality
- **Fix:** Create transactions list with filters and add form
- **Files:** `src/app/transactions/page.tsx`

### [ ] Budgets Page
- **Problem:** Need budget management
- **Fix:** Create budget cards with progress indicators
- **Files:** `src/app/budgets/page.tsx`

### [ ] Subscriptions Page
- **Problem:** Need recurring payment tracking
- **Fix:** Create subscriptions list with cost summary
- **Files:** `src/app/subscriptions/page.tsx`

### [ ] Settings Page
- **Problem:** Need user preferences management
- **Fix:** Create settings form with profile and preferences
- **Files:** `src/app/settings/page.tsx`

---

## 🟢 Low Priority / Nice to Have

### [ ] Onboarding Flow
- **Problem:** First-time users need guided setup
- **Fix:** Create multi-step onboarding wizard
- **Files:** `src/app/onboarding/page.tsx`

### [ ] Toast Notifications
- **Problem:** Need user feedback system
- **Fix:** Implement toast component for success/error messages
- **Files:** `src/components/Toast.tsx`

---

## ✅ Completed

### [x] Project Setup - 2025-12-15
- **Problem:** Need Next.js project foundation
- **Fix:** Scaffold Next.js 16 with TypeScript
- **Files:** `earnslate-app/`

### [x] Project Documentation - 2025-12-15
- **Problem:** Need project-specific documentation
- **Fix:** Create README, AGENTS.md, CHANGELOG, TASKS from templates
- **Files:** `README.md`, `AGENTS.md`, `CHANGELOG.md`, `TASKS.md`

---

## 📋 Backlog / Future Ideas

- [ ] Data persistence with local storage
- [ ] Charts and visualizations with Chart.js
- [ ] CSV import/export functionality
- [ ] Multi-currency support
- [ ] PWA support for offline use
- [ ] Dark/Light theme toggle
