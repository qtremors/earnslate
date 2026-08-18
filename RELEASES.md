# Earnslate - Releases

> **Project:** Earnslate
> **Version:** 2.0.0
> **Last Updated:** 2026-08-18

| Version | Release Date | Key Focus |
| :--- | :--- | :--- |
| [v2.0.0](#v200) | 2026-08-18 | Initial Android release - Native Jetpack Compose, Material 3, offline Room storage, Smart SMS parsing, custom icons, and dynamic theming |

---

# v2.0.0

**Release Date:** August 18, 2026

**Development range included:** v2.0.0

**Known issues & roadmap:** Track active issues and ongoing engineering tasks in [TASKS.md](TASKS.md).

Earnslate v2.0.0 introduces the complete native Android application, replacing the earlier web prototype with a modern, private, offline-first personal finance and subscription manager.

> [!NOTE]
> **Privacy first:** Earnslate operates 100% offline and does not request `android.permission.INTERNET`. All financial transactions, budgets, subscriptions, and parsed SMS data stay strictly on your device.

## What's New in v2.0.0

### Native Jetpack Compose and Material 3 UI

- Built with modern Jetpack Compose, Material 3 Expressive UI, and dynamic color schemes.
- Expressive bottom navigation pill with smooth micro-interactions, spring animations, and bottom list scrim.
- Responsive tablet and landscape support with an adaptive side `NavigationRail` for wide displays (`>= 840dp`).
- Dynamic theme selection supporting System Default, Pure Light, Dark, and OLED pure black modes.
- MaterialKolor palette engine with 10 vibrant accent themes (Dynamic, Purple, Blue, Cyan, Teal, Green, Orange, Pink, Red, Monochrome) and tactile haptic feedback.

### Smart SMS Transaction Parsing (100% Offline)

- Heuristic pattern-matching engine that parses bank and financial transactional SMS messages completely on-device.
- Filters out non-financial noise such as OTPs, security login alerts, and general spam.
- Recognizes debits and credits across 300+ popular financial institutions, UPI apps, delivery services, and merchants.
- Extracts amounts, account/card ending numbers, and UPI/RRN reference identifiers.
- Interactive SMS Inbox bottom sheet allowing users to review, filter, and batch-approve detected transactions with confidence scoring.

### Subscriptions, Budgets, and Cash Flow Tracking

- Real-time financial dashboard displaying net balance, total monthly income, total expenses, and spending cash flow trends.
- Comprehensive transaction management with search, category filtering, date presets (Today, This Week, This Month, Custom Range), sorting, and multi-select batch deletion.
- Recurring subscription tracker supporting daily, weekly, monthly, yearly, and custom billing cycles.
- Next-billing countdowns, variable expense flags, and income subscription support (salaries, dividends, retainers).
- Built-in directory of 80+ pre-packaged service templates across Streaming, Music, Storage, Gaming, Productivity, VPN, Security, Communication, AI, Developer, Food, Fitness, Reading, Learning, Utility, Insurance, Housing, and Finance.
- Category-scoped budget limits with real-time spending calculations, period auto-resets, visual progress bars, and over-budget warnings.

### Atomic Backup, Custom Icons, and Data Portability

- Transactional JSON backup and restore engine with full rollback safety to prevent data corruption.
- Custom subscription icon imports (SVG, PNG, JPEG, WebP) with on-device sanitization against active scripts/entities, raster normalization, and base64 backup bundling.
- Backward compatibility with legacy web backup envelopes.
- Formatted CSV export for transaction ledgers with proper quote and comma escaping.
