# Earnslate Changelog

> **Project:** Earnslate  
> **Version:** 1.1.1  
> **Last Updated:** 2026-01-14

---

## v1.1.3 (2026-03-01)

### Fixed
- **Fake Loading State Elimination**: Removed the artificial `isSubmitting` delay on form closures (`TransactionForm`, `SubscriptionForm`, `BudgetForm`) which fixed React unmounted component warnings.
- **Budget Spending Calculation Date Bug**: Ensured that `getSpentInPeriod` logic correctly processes numerical epoch time rather than raw ISO string dates to accurately compute budget spending near period boundaries.
- **CSV Export Formatting Standardization**: Updated the CSV export logic on the Transactions page to enforce matching visual formats with table views (signing & formatting currency).

---

## v1.1.2 (2026-03-01)

### Security
- **XSS via Imported Data**: Added strict sanitization of imported colors and custom categories to prevent CSS injection vulnerabilities.

### Fixed
- **Data Loss on Import**: Implemented a merge strategy for imported data, preventing existing budgets, subscriptions, and settings from being overwritten when importing partial backups.
- **Race Condition in Store Rehydration**: Moved store hydration logic entirely client-side inside `StoreProvider.tsx` to prevent hydration mismatches and the flash of default content during Next.js SSR.

---

## v1.1.1 (2026-01-14)

### Fixed
- **Currency Formatting**: Fixed inconsistencies with negative signs in compact currency mode for `en-IN` locale.
- **Budgets**: Made budget category matching case-insensitive to ensure reliable transaction tracking.
- **Documentation**: Corrected JSDoc comments and Git clone URL in README.

---

## v1.1.0 (2026-01-14)

### Fixed
- **Missing Onboarding Redirect**: Added logic to force redirect new users to the onboarding page.
- **Transaction Selection**: Fixed an issue where selected transactions persisted after filter changes, preventing accidental deletions.
- **CSV Export**: Fixed CSV export to properly escape special characters (commas, quotes, newlines) across all modules.
- **Budget Reset**: Fixed budget reset logic to correctly recalculate spent amount from transactions falling within the new period.
- **Currency Formatting**: Fixed compact currency formatting (e.g. 10k, 1M) to respect user locale (International vs Indian system).
- **Date Pickers**: Standardized date pickers across the app and ensured they respect user's date format settings.

### Added
- **Skip Onboarding**: Added a "Skip" button to the onboarding flow for quick access.
- **CSV Utility**: Centralized CSV generation logic for consistent behavior.

### Refactor
- **Icons**: Replaced emojis in onboarding flow with proper Lucide icons for a more premium feel.
- **Cleanup**: Removed unused variables (`iconType`, `settings`) and redundant fields (`iconType` in `ServiceTemplate`) to improve code quality.
- **Accessibility**: Added missing `data-modal-open` attribute to Modal to ensure keyboard shortcuts (Escape to close) work reliably.

---

## v1.0.0 (2026-01-12)

### Added
- **Dashboard**: Real-time balance, spending pie chart, budget alerts
- **Transactions**: Full CRUD, search, filters, date presets, pagination, batch delete
- **Budgets**: Progress tracking, donut charts, auto-reset on period expiry
- **Subscriptions**: 100+ service templates, treemap visualization, flexible billing
- **Settings**: Custom categories, theme toggle, JSON export/import

### Changed
- **UX**: Premium keyboard shortcuts (Ctrl+N, Ctrl+D/T/B, Escape)
- **Theme**: Dark/Light mode toggle and 12-color system palette

### Fixed
- **Race Condition**: Budget-Transaction sync issues resolved
- **Import**: Data safety improvements during import operations

### Security
- **Privacy**: LocalStorage only, no external server data transmission

---

## [0.8.0] - 2025-12-16

### Added
- Date range presets and pagination
- Batch delete for transactions

### Changed
- Bundle size optimization with Iconify
- Removed 56+ lines of dead code

---

## [0.7.0] - 2025-12-16

### Added
- Iconify integration (100+ brand icons)
- Header username display

### Fixed
- Pie chart visibility bug

---

## [0.6.0] - 2025-12-15

### Fixed
- Race condition fixes for budget-transaction sync
- Form validation for budgets and subscriptions
- Data import safety improvements

---

## [0.5.0] - 2025-12-15

### Added
- Toast notification system
- Budget period auto-reset
- Subscription billing auto-update
- Mobile hamburger menu

---

## [0.4.0] - 2025-12-15

### Added
- Transaction filters and search
- Budget donut chart overview
- Category manager in settings
- JSON export/import

---

## [0.3.0] - 2025-12-15

### Added
- ServicePicker with 55+ templates
- Treemap subscription visualization
- Icon and color pickers

---

## [0.2.0] - 2025-12-15

### Added
- Core CRUD for all modules

### Fixed
- Zustand hydration fixes

---

## [0.1.0] - 2025-12-15

### Added
- Initial project setup
- Monochrome design system
- Zustand + localStorage persistence
