# Changelog

All notable changes to Earnslate will be documented in this file.

---

## [1.0.0] - 2025-12-16

### 🎉 Initial Public Release

A complete personal finance management app with offline-first architecture.

### Core Features
- **Dashboard**: Real-time balance, spending pie chart, budget alerts
- **Transactions**: Full CRUD, search, filters, date presets, pagination, batch delete
- **Budgets**: Progress tracking, donut charts, auto-reset on period expiry
- **Subscriptions**: 100+ service templates, treemap visualization, flexible billing
- **Settings**: Custom categories, theme toggle, JSON export/import

### Premium UX
- **Keyboard Shortcuts**: Ctrl+N (new), Ctrl+D/T/B (navigate), Escape (close)
- **Icon System**: 120+ Lucide icons + 100+ brand icons via Iconify
- **Color Customization**: 12-color palette for categories and subscriptions
- **Dark/Light Theme**: System preference or manual toggle
- **Mobile Responsive**: Hamburger menu with slide-in drawer

### Privacy First
- All data stored locally in browser (localStorage)
- No account required, works completely offline
- Full data ownership with JSON export/import

### Technical
- Next.js 15 with App Router
- TypeScript 5 with strict mode
- Zustand for state management
- CSS Modules (no Tailwind)
- Vercel-ready deployment config

---

## Pre-Release History

### [0.8.0] - 2025-12-16
- Date range presets and pagination
- Batch delete for transactions
- Bundle size optimization with Iconify
- Dead code removal (56+ lines)

### [0.7.0] - 2025-12-16
- Iconify integration (100+ brand icons)
- Fixed pie chart visibility bug
- Header username display

### [0.6.0] - 2025-12-15
- Race condition fixes for budget-transaction sync
- Form validation for budgets and subscriptions
- Data import safety improvements

### [0.5.0] - 2025-12-15
- Toast notification system
- Budget period auto-reset
- Subscription billing auto-update
- Mobile hamburger menu

### [0.4.0] - 2025-12-15
- Transaction filters and search
- Budget donut chart overview
- Category manager in settings
- JSON export/import

### [0.3.0] - 2025-12-15
- ServicePicker with 55+ templates
- Treemap subscription visualization
- Icon and color pickers

### [0.2.0] - 2025-12-15
- Core CRUD for all modules
- Zustand hydration fixes

### [0.1.0] - 2025-12-15
- Initial project setup
- Monochrome design system
- Zustand + localStorage persistence
