# Earnslate Changelog

> **Project:** Earnslate
> **Version:** 2.0.0
> **Last Updated:** 2026-08-18

---

## [2.0.0] - 2026-08-18

- **Native Android Launch**: Rebuilt Earnslate from the ground up as a private, offline native Android application using Kotlin, Jetpack Compose, Material 3, and Room.
- **Smart SMS Parser**: Added a 100% offline, on-device heuristic engine that detects bank and transaction SMS messages across 300+ financial brands and merchants, extracting amounts, debit/credit transaction types, account/card endings, UPI reference numbers, and auto-suggesting categories with zero cloud connectivity.
- **SMS Inbox Sheet**: Added an interactive bottom sheet to scan device SMS inbox messages, preview parsed transactions with confidence indicators, and quickly approve them into transaction records.
- **Financial Dashboard**: Implemented real-time tracking of net balance, total income, total expenses, recent activity timelines, active subscriptions, and visual budget health meters.
- **Transaction Management**: Added full CRUD operations for income and expense transactions, search, category filters, date presets (Today, This Week, This Month, Custom Range), sorting controls, multi-select mode, and batch deletion.
- **Subscriptions & Recurring Bills**: Added recurring income and expense tracking with flexible billing cycles (daily, weekly, monthly, yearly, custom counts), next billing countdowns, variable expense toggles, 80+ pre-packaged service templates, and expense distribution treemaps.
- **Custom Icon Storage**: Added support for custom SVG, PNG, JPEG, and WebP icons with automatic SVG sanitization, raster normalization, and dedicated local storage.
- **Category Budgets**: Added monthly and custom billing cycle budget limits with real-time spending calculations, period auto-resets, visual progress bars, and over-budget warnings.
- **Dynamic Theming & Expressive Design**: Added Material 3 Expressive UI, OLED pure-black, Dark, and Light themes, dynamic MaterialKolor accent palettes (Dynamic, Purple, Blue, Cyan, Teal, Green, Orange, Pink, Red, Monochrome), responsive tablet navigation rails, and floating pill navigation.
- **Atomic JSON Backup & Restore**: Implemented versioned (`v2.0.0`) JSON backup and restore with embedded base64 custom icon assets, strict input validation, and transactional database rollback.
- **CSV Data Export**: Added standard CSV export for transactions with proper escaping and formatting.
- **Offline & Privacy Guarantee**: Built with zero internet permissions (`android.permission.INTERNET` omitted), zero ads, zero trackers, and zero third-party telemetry.
