# Changelog

## [0.3.0] - 2025-12-15

### Added - God-Tier Customization
- **ServicePicker**: 55+ popular services with brand icons (Netflix, Spotify, YouTube, etc.)
- **Search & Filter**: Search services by name or category
- **Flexible Billing Cycles**: Every N hours/days/weeks/months/years
- **Icon Picker**: 100+ searchable Lucide icons for custom subscriptions
- **Color Picker**: 12-color palette for subscription customization
- **Quick Templates**: One-click add for popular services with suggested pricing
- **Notes Field**: Add memos to subscriptions (displayed on cards)
- **Left Border Accent**: Subscription cards show color as left border

### Fixed
- Missing brand icons (Disney+, JioCinema, Headspace, Claude) now use Lucide fallbacks
- Icons now properly fill container (28x28px)
- Removed colored hue background from icons (per user preference)

---

## [0.2.0] - 2025-12-15

### Added - Core CRUD
- Full CRUD for Transactions, Budgets, and Subscriptions
- Modal forms with validation
- Dashboard with real-time stats
- Settings page with data clear option

### Fixed
- Zustand hydration mismatch with Next.js SSR
- Dashboard infinite loop from selector reference issues

---

## [0.1.0] - 2025-12-15

### Added - Initial Setup
- Next.js 15 project with TypeScript
- Monochrome design system with inverted accents
- Sidebar navigation with Lucide icons
- Page scaffolding for all routes
- Zustand store with localStorage persistence
