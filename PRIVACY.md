# Privacy Policy for Earnslate

**Last Updated:** 2026-08-18

Earnslate is a personal project built with a privacy-first mindset. This policy explains how the application handles your information.

## 1. No Data Collection

Earnslate **does not collect, store, or transmit** any personal data, financial transactions, account balances, usage statistics, or telemetry from your device.

## 2. Offline by Design

Earnslate is designed to operate entirely offline. The application does not declare the `android.permission.INTERNET` permission, so Earnslate cannot upload financial transactions, budgets, subscriptions, telemetry, or activity data over the network.

## 3. No Advertisements or Trackers

The application contains **zero advertisements** and **zero third-party tracking SDKs**.

## 4. Local Financial Storage & SMS Permissions

Earnslate optionally requests the `READ_SMS` permission only if you choose to use the Smart SMS Parser to detect financial transactional SMS messages (such as bank alerts, debit/credit notices, and merchant receipts) from your device. This parsing engine runs entirely offline on your device using local regex heuristics and a local merchant catalog upon app launch. SMS message contents, sender identities, and extracted financial details are processed purely on-device and are never transmitted anywhere.

## 5. Custom Icons & Backup Security

Custom subscription icons imported into Earnslate (SVG, PNG, JPEG, WebP) are sanitized, normalized, and stored locally in the application's private internal storage directory. Exported JSON backup files and CSV exports are written exclusively to the local storage destination you select and contain only your local application state and assets.

## 6. Source Availability

Earnslate's source code is publicly available for inspection. You are welcome to audit it yourself on [GitHub](https://github.com/qtremors/earnslate).

## 7. Changes to This Policy

This policy may be updated as new features are introduced. However, the core principles — **privacy, offline-only operations, and zero data collection** — will remain unchanged.

---
[Back to Home](https://qtremors.github.io/earnslate/)
