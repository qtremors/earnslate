<p align="center">
  <img src="assets/Earnslate.png" alt="Earnslate Logo" width="120"/>
</p>

<h1 align="center"><a href="https://qtremors.github.io/earnslate/">Earnslate</a></h1>

<p align="center">
  A private, modern Android personal finance and subscription tracker.
</p>

<p align="center">
  <a href="https://github.com/qtremors/earnslate/releases/latest">
    <img src="https://img.shields.io/github/v/release/qtremors/earnslate?label=Download%20APK&color=2da44e&logo=android&logoColor=white" alt="Download APK" height="32">
  </a>
</p>

<p align="center">
  <a href="https://github.com/qtremors/earnslate/releases"><img src="https://img.shields.io/github/downloads/qtremors/earnslate/total?label=Total%20Downloads&color=0969da" alt="Total Downloads"></a>
  <a href="https://github.com/qtremors/earnslate/releases"><img src="https://img.shields.io/github/downloads/qtremors/earnslate/latest/total?label=Latest%20Downloads&color=2da44e" alt="Latest Downloads"></a>
  <img src="https://img.shields.io/badge/Android-7.0%2B-34A853?logo=android" alt="Android 7.0+">
  <img src="https://img.shields.io/badge/License-TSL-red" alt="License">
</p>

> [!NOTE]
> **Privacy first:** Earnslate does not request `android.permission.INTERNET`. Your financial data, transactions, and usage stay on your device.

## Why Earnslate

Earnslate is an offline Android personal finance and subscription manager built for speed, privacy, and a clean native interface. It has no ads, trackers, accounts, network access, or hidden data collection.

## Download

Download the latest APK from [GitHub Releases](https://github.com/qtremors/earnslate/releases) and install it on a device running Android 7.0 (API 24) or newer.

Earnslate optionally requests the `READ_SMS` permission only if you wish to use the offline Smart SMS parser to auto-detect financial transactions upon opening the app. This processing is performed 100% locally on your device without network access.

## Features

- **Private and offline:** No ads, accounts, trackers, telemetry, or internet permission.
- **Financial Dashboard:** See real-time net balance, monthly income, expense totals, spending trends, and active budget health.
- **Transaction Tracking:** Add, search, categorize, and filter income and expenses. Date range presets, sorting, selection mode, batch deletion, and formatted CSV export are included.
- **Subscriptions & Recurring Bills:** Manage recurring expenses and income streams with flexible billing cycles (daily, weekly, monthly, yearly, custom), next-billing countdowns, and treemap visualization.
- **Service Directory & Custom Icons:** Pick from 80+ pre-packaged services or import custom SVG, PNG, JPEG, and WebP icons with automatic sanitization and normalization.
- **Category Budgets:** Set spending limits per category, track progress with visual meters, auto-reset across billing periods, and receive over-budget warnings.
- **Smart SMS Parser:** Parse bank and merchant transaction SMS completely offline on your device across 300+ financial brands, extracting amounts, accounts, merchants, UPI references, and suggested categories.
- **Atomic Backup & Restore:** Export and import full application state and custom icons into versioned JSON backup files with transactional rollback safety and web-backup cross-compatibility.
- **Expressive Personalization:** Choose between System, Light, Dark, and OLED pure black themes, 10 MaterialKolor dynamic accent palettes, custom categories, currency formats, and haptic feedback.

## Community and support

- Join the [Discord community](https://discord.gg/QgUjuNj9U8).
- Report bugs or request features through [GitHub Issues](https://github.com/qtremors/earnslate/issues).
- Review changes in the [changelog](CHANGELOG.md) and public [release notes](RELEASES.md).
- Read the [privacy policy](PRIVACY.md).

## Credits

Earnslate is built by [Tremors](https://github.com/qtremors) with Kotlin and the Android platform. Thanks to the maintainers of:

- [AndroidX](https://developer.android.com/jetpack/androidx), [Jetpack Compose](https://developer.android.com/compose), [Material 3](https://m3.material.io/), [Room](https://developer.android.com/training/data-storage/room), and [DataStore](https://developer.android.com/topic/libraries/architecture/datastore)
- [Kotlin](https://kotlinlang.org/), [Kotlin Coroutines](https://github.com/Kotlin/kotlinx.coroutines), and [Kotlin Serialization](https://github.com/Kotlin/kotlinx.serialization)
- [Dagger and Hilt](https://dagger.dev/hilt/), [Coil](https://coil-kt.github.io/coil/), [MaterialKolor](https://github.com/jordond/MaterialKolor), and [Simple Icons](https://github.com/DevSrSouza/compose-icons)
- [Outfit](https://fonts.google.com/specimen/Outfit), [DM Sans](https://fonts.google.com/specimen/DM+Sans), [Manrope](https://fonts.google.com/specimen/Manrope), and [Material Symbols](https://fonts.google.com/icons) for typography and visual assets

The app's **Settings → About** screen lists application details and links. Each third-party dependency remains the property of its respective authors and is used under its own license.

## For developers

Architecture, project structure, technology choices, setup, build commands, testing, and release engineering guidance live in [DEVELOPMENT.md](DEVELOPMENT.md).

## License

Earnslate is source-available under the **Tremors Source License (TSL)**. Viewing, forking, and derivative works require attribution; commercial use requires written permission.

Read [LICENSE.md](LICENSE.md) or the [web version](https://qtremors.github.io/license).

---

<p align="center">
  Made by <a href="https://github.com/qtremors">Tremors</a>
</p>
