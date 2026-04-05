# Earnslate Android App — Development Plan

> **Stack:** Kotlin · Jetpack Compose · Material 3 Expressive · Room · DataStore  
> **Min SDK:** 26 (Android 8.0) — **Target SDK:** 36 (Android 16)  
> **Arch pattern:** MVVM + Clean Architecture (UI → ViewModel → Repository → Room/DataStore)

---

## 1. App Overview

Earnslate is a **personal finance manager** currently built as a Next.js web app. This plan covers the creation of a feature-equivalent native Android app, faithful to the same data model and feature set, delivered with a premium Material 3 Expressive look & feel.

> **Note:** The `earnslate-android` project directory is currently an empty Activity project placeholder. The Android version is planned for future development, but no active work is currently being done on it.

### Core Feature Modules (ported from web)

| Module | Web Route | Android Screen |
|---|---|---|
| Dashboard | `/` | `DashboardScreen` |
| Transactions | `/transactions` | `TransactionsScreen` |
| Budgets | `/budgets` | `BudgetsScreen` |
| Subscriptions | `/subscriptions` | `SubscriptionsScreen` |
| Settings | `/settings` | `SettingsScreen` |
| Onboarding | `/onboarding` | `OnboardingScreen` |

---

## 2. Technology Stack

### Core

| Layer | Technology |
|---|---|
| Language | Kotlin 2.x |
| UI Framework | Jetpack Compose (BOM latest stable) |
| Design System | Material 3 Expressive (`androidx.compose.material3:material3:1.4.0-alpha14+`) |
| Navigation | Navigation Compose |
| DI | Hilt |
| Async | Kotlin Coroutines + Flow |

### Data Layer

| Concern | Technology |
|---|---|
| Local DB | Room (entities mirror web data models) |
| App Preferences | DataStore Preferences (replaces Zustand persisted store) |
| Serialization | Kotlinx Serialization (JSON import/export) |

### Charts & Visualisation

| Need | Library |
|---|---|
| Pie / Donut charts | Vico (`com.patrykandpatrick.vico:compose-m3`) or custom Canvas composable |
| Treemap (Subscriptions) | Custom Canvas composable |

---

## 3. Data Models

Direct Kotlin equivalents of the TypeScript types:

```kotlin
// Transaction.kt
data class Transaction(
    val id: String = UUID.randomUUID().toString(),
    val description: String,
    val amount: Double,           // positive = income, negative = expense
    val category: String,
    val date: String,             // ISO date "YYYY-MM-DD"
    val type: TransactionType,    // INCOME | EXPENSE
    val notes: String? = null,
    val createdAt: String = Instant.now().toString()
)

enum class TransactionType { INCOME, EXPENSE }

// Budget.kt
data class Budget(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val limit: Double,
    val spent: Double = 0.0,
    val category: String,
    val icon: String,
    val color: String? = null,
    val period: BillingCycle,
    val periodStartDate: String,
    val createdAt: String = Instant.now().toString()
)

// Subscription.kt
data class Subscription(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val amount: Double,
    val cycle: BillingCycle,
    val nextBilling: String,
    val icon: String,
    val color: String? = null,
    val active: Boolean = true,
    val notes: String? = null,
    val createdAt: String = Instant.now().toString()
)

// BillingCycle.kt
data class BillingCycle(
    val count: Int,
    val unit: TimeUnit   // HOUR | DAY | WEEK | MONTH | YEAR
)

// Category.kt
data class Category(
    val id: String,
    val name: String,
    val icon: String,             // Material / Lucide icon name mapped to ImageVector
    val color: String,
    val type: CategoryType        // INCOME | EXPENSE | BOTH
)

// UserSettings.kt (stored in DataStore)
data class UserSettings(
    val displayName: String = "User",
    val currency: String = "INR",
    val currencySymbol: String = "₹",
    val locale: String = "en-IN",
    val dateFormat: String = "DD/MM/YYYY",
    val theme: AppTheme = AppTheme.SYSTEM,
    val hasCompletedOnboarding: Boolean = false,
    val customCategories: List<Category> = DEFAULT_CATEGORIES
)
```

---

## 4. Architecture

```
earnslate-android/
├── app/
│   └── src/main/
│       ├── data/
│       │   ├── db/               # Room database, DAOs, entities
│       │   ├── datastore/        # UserSettings DataStore
│       │   ├── repository/       # TransactionRepository, BudgetRepository,
│       │   │                     # SubscriptionRepository, SettingsRepository
│       │   └── model/            # Domain data classes
│       ├── domain/
│       │   └── usecase/          # Business logic (budget resets, billing date calc)
│       ├── ui/
│       │   ├── theme/            # M3 Expressive theme, typography, color scheme
│       │   ├── navigation/       # NavGraph, Route sealed class
│       │   ├── dashboard/        # DashboardScreen + ViewModel
│       │   ├── transactions/     # TransactionsScreen + ViewModel
│       │   ├── budgets/          # BudgetsScreen + ViewModel
│       │   ├── subscriptions/    # SubscriptionsScreen + ViewModel
│       │   ├── settings/         # SettingsScreen + ViewModel
│       │   ├── onboarding/       # OnboardingScreen + ViewModel
│       │   └── components/       # Shared composables (AmountText, CategoryChip,
│       │                         # ProgressBar, PieChart, Treemap, ConfirmDialog,
│       │                         # IconSelector, ColorPicker, BillingCyclePicker)
│       └── MainActivity.kt
├── build.gradle.kts
└── PLAN.md
```

---

## 5. Material 3 Expressive — Design Specification

> Material 3 Expressive is available in Jetpack Compose via:
> ```kotlin
> implementation("androidx.compose.material3:material3:1.4.0-alpha14")
> ```
> Experimental APIs require `@OptIn(ExperimentalMaterial3ExpressiveApi::class)`.

### 5.1 Theme

- **Dynamic Color 2.0** — wallpaper-based adaptive theming via `dynamicDarkColorScheme()` / `dynamicLightColorScheme()` (API 31+), with a carefully crafted static fallback for older devices.
- **Typography** — `Typography` using the `Expressive` type scale; headline displays use `Roboto Flex` variable font for weight animations.
- **Shape library** — use M3 Expressive's 35 shape tokens (e.g., `ShapeKeyTokens.CornerFullRound` for cards, `extraLarge` rounded corners on bottom sheets).

### 5.2 Component Mapping

| Web Component | Android M3 Expressive Equivalent |
|---|---|
| Sidebar navigation | `NavigationBar` (phone) / `NavigationRail` (tablet) |
| Card | `Card` with `ElevatedCard` / `OutlinedCard` variant |
| Button variants (primary, ghost, danger) | `Button`, `OutlinedButton`, `TextButton`, `FilledTonalButton` |
| FAB (Add transaction) | `ExtendedFloatingActionButton` → `FloatingActionButtonMenu` (Expressive) |
| Modal / Dialog | `AlertDialog` / `ModalBottomSheet` |
| Toast | `Snackbar` with `SnackbarHost` |
| Progress bar (budget) | `LinearProgressIndicator` |
| Loading spinner | `LoadingIndicator` (M3 Expressive) |
| Search input | `SearchBar` / `DockedSearchBar` |
| Select dropdown | `DropdownMenu` + `ExposedDropdownMenuBox` |
| View toggle (list/chart/treemap) | `ButtonGroup` (M3 Expressive, replaces SegmentedButton) |
| Date picker | `DatePickerDialog` |
| Confirm modal | `AlertDialog` |
| Icon picker | Custom `ModalBottomSheet` grid of `Icon` composables |
| Color picker | Custom `ModalBottomSheet` with `FlowRow` of color swatches |
| Pie / donut chart | Custom `Canvas` composable (or Vico) |
| Subscription treemap | Custom `Canvas` composable |

### 5.3 Motion & Animation

- **Springy transitions** — use `spring()` `AnimationSpec` for screen transitions and list item enter/exit.
- **Shape morphing** — animate card shapes on press using `animateShape()` from M3 Expressive.
- **List animations** — `AnimatedVisibility` + `animateItemPlacement()` on `LazyColumn` for smooth inserts/deletes.
- **FAB expansion** — `FloatingActionButtonMenu` Expressive component for contextual add actions.
- **Shared element transitions** — use Compose Navigation shared element API for transaction detail open/close.

---

## 6. Screen-by-Screen Specification

### 6.1 Onboarding (`OnboardingScreen`)

Shown only once (`UserSettings.hasCompletedOnboarding == false`).

**Steps (pager):**
1. Welcome — App name + tagline + animated logo
2. Display name input
3. Currency selection (INR / USD / EUR / GBP)
4. Date format selection
5. Number locale selection
6. Done → navigate to Dashboard

**Components:** `HorizontalPager`, `PagerIndicator`, `OutlinedTextField`, `ButtonGroup`

---

### 6.2 Dashboard (`DashboardScreen`)

**Summary cards (row):**
- Total Balance (`Wallet` icon) — coloured by positive/negative
- Monthly Income (`TrendingUp`, green tint)
- Monthly Expenses (`TrendingDown`, red tint)

**Main content grid (scrollable):**
- Budget Alerts banner (warning/danger) — `AnimatedVisibility`
- Spending by Category — donut chart + legend (current month)
- Recent Transactions — last 5, searchable inline, "View All →" action
- Budget Status — top 3 budgets with `LinearProgressIndicator`

**FAB:** `FloatingActionButtonMenu` → "Add Transaction" / "Add Budget" / "Add Subscription"

---

### 6.3 Transactions (`TransactionsScreen`)

**Toolbar:**
- `DockedSearchBar` (search by description/category)
- Filter chips: Type (All/Income/Expense), Category, Date preset, Sort

**Date Presets:** Today · This Week · This Month · Last 30 · Last 90 · Custom range (`DateRangePicker`)

**Views (ButtonGroup toggle):**
- **List view:** `LazyColumn` of transaction rows with swipe-to-delete + long-press multi-select
- **Chart view:** Donut chart grouped by category for the filtered set

**Bulk actions:** Multi-select toolbar → Bulk delete with `AlertDialog` confirm

**CSV Export:** share intent with generated CSV content

**Pagination:** 25 items per page with `LazyColumn` + `rememberLazyListState` load-more

**FAB:** "Add Transaction" → `ModalBottomSheet` form

**Transaction Form fields:**
- Description (TextField)
- Amount (numeric TextField, positive)
- Type toggle (Income / Expense — ButtonGroup)
- Category dropdown (pre-populated from settings)
- Date (DatePickerDialog)
- Notes (optional, multiline TextField)

---

### 6.4 Budgets (`BudgetsScreen`)

**Summary:** count of active budgets, total budget limits, total spent

**Budget cards (`ElevatedCard`):**
- Icon + colour accent
- Name + category
- `LinearProgressIndicator` (colour: green < 60%, amber 60–80%, red ≥ 80%)
- Spent / Limit amounts
- Period label (Daily/Weekly/Monthly/Yearly/Custom)
- Edit / Delete actions (swipe or icon buttons)

**Alerts:** `Surface` banner for budgets ≥ 80% utilised

**Budget Reset Logic:** implemented in `CheckAndResetBudgetsUseCase`, triggered on app start and `ProcessLifecycleOwner` foreground event

**Budget Form (`ModalBottomSheet`):**
- Name, Category, Limit amount, Icon picker, Color picker, Period (BillingCycle picker — count + unit selectors)

---

### 6.5 Subscriptions (`SubscriptionsScreen`)

**Summary cards:** Active count · Monthly cost · Yearly cost

**Views (ButtonGroup toggle):**
- **List view:** cards with icon, name, cycle, next billing, pause/resume toggle, edit/delete
- **Treemap view:** custom `Canvas` composable, area proportional to monthly equivalent cost, coloured by subscription brand colour

**Inactive subscriptions:** visually dimmed, not included in cost totals

**Billing date auto-advance:** `UpdateSubscriptionBillingDatesUseCase` on app launch

**Subscription Form (`ModalBottomSheet`):**
- Name, Amount, Cycle (custom `BillingCyclePicker`), Next billing date, Icon picker, Color picker (brand colour), Active toggle, Notes

**CSV Export:** share intent

---

### 6.6 Settings (`SettingsScreen`)

Grouped into `ElevatedCard` sections:

**Profile**
- Display Name (edit via `AlertDialog` inline text field)

**Categories**
- List with colour dot + name + edit/delete per category
- `IconSelector` bottom sheet (searchable grid of Material icons)
- `ColorPicker` bottom sheet (12-swatch palette)
- Add new category inline text field

**Preferences**
- Currency (dropdown: INR/USD/EUR/GBP)
- Date Format (DD/MM/YYYY · MM/DD/YYYY · YYYY-MM-DD)
- Number Format / Locale
- Theme (Dark / Light / System — `ButtonGroup` with Moon/Sun/Monitor icons)

**Data Management**
- Export JSON backup → share intent
- Import JSON backup → file picker intent + `AlertDialog` confirm
- Clear All Data → `AlertDialog` with destructive confirm

**About**
- App version + tagline

---

## 7. Navigation

```kotlin
sealed class Route {
    object Onboarding : Route()
    object Dashboard : Route()
    object Transactions : Route()
    object Budgets : Route()
    object Subscriptions : Route()
    object Settings : Route()
}
```

- Bottom `NavigationBar` with 4 primary destinations: Dashboard · Transactions · Budgets · Subscriptions
- Settings accessible via top-bar icon (gear icon) from any screen
- `Onboarding` replaces entire graph until completed
- Back stack managed by `rememberNavController()`

---

## 8. Persistence & State

### Room Database

```
AppDatabase
├── TransactionDao    CRUD + Flow<List<Transaction>>
├── BudgetDao         CRUD + Flow<List<Budget>>
├── SubscriptionDao   CRUD + Flow<List<Subscription>>
└── CategoryDao       CRUD + Flow<List<Category>>
```

All DAOs expose `Flow` for reactive UI updates. Budget `spent` is recomputed atomically when transactions are inserted/deleted/updated (mirrors web store logic).

### DataStore

`UserSettings` serialized as proto-JSON in `DataStore<Preferences>` — covers display name, currency, locale, theme, date format, onboarding flag.

---

## 9. Business Logic (Use Cases)

| Use Case | Description |
|---|---|
| `AddTransactionUseCase` | Insert transaction + update matching budget's `spent` |
| `UpdateTransactionUseCase` | Update transaction + recalculate affectedbudgets atomically |
| `DeleteTransactionUseCase` | Delete transaction + subtract from matching budget |
| `CheckAndResetBudgetsUseCase` | Advance budget period if `now >= nextPeriodStart`, recalculate `spent` from existing transactions for new period |
| `UpdateSubscriptionBillingDatesUseCase` | Advance `nextBilling` for active subscriptions whose date has passed |
| `CalculateNextBillingUseCase` | Pure function: given a date + `BillingCycle`, return next billing date (handles month/year edge cases, ported exactly from web) |
| `FormatCurrencyUseCase` | Locale-aware currency formatting (compact: K/L/Cr for en-IN) |
| `ImportDataUseCase` | Validate + sanitise JSON import, replace local data |
| `ExportDataUseCase` | Serialise all data to JSON for share intent / CSV for transactions/subscriptions |

---

## 10. Formatting & Localisation

| Feature | Implementation |
|---|---|
| Currency | `NumberFormat.getCurrencyInstance(Locale)` + compact suffixes (K/L/Cr) for `en-IN` |
| Date display | `DateTimeFormatter` with user-selected pattern |
| Locale | Passed as `Locale` to all formatters, stored in `UserSettings.locale` |
| Theme | `isSystemInDarkTheme()` + stored preference; `DynamicColorScheme` on API 31+ |

---

## 11. Project Setup Checklist

```
[ ] Create Android project in Android Studio (Kotlin, Compose, min SDK 26)
[ ] Configure build.gradle.kts — BOM, Material3 alpha, Room, Hilt, DataStore, Vico, Navigation
[ ] Set up Hilt application class + module bindings
[ ] Define Room entities + type converters (BillingCycle ↔ JSON string)
[ ] Define DAOs + AppDatabase
[ ] Define DataStore for UserSettings
[ ] Implement repositories
[ ] Implement use cases
[ ] Define M3 Expressive theme (ColorScheme, Typography, Shapes)
[ ] Build shared UI components (AmountText, CategoryChip, LinearProgressBar, DonutChart, Treemap, ConfirmDialog, IconSelector, ColorPicker, BillingCyclePicker)
[ ] Implement OnboardingScreen + ViewModel
[ ] Implement DashboardScreen + ViewModel
[ ] Implement TransactionsScreen + ViewModel (list + chart views, filters, form)
[ ] Implement BudgetsScreen + ViewModel (cards, progress, form)
[ ] Implement SubscriptionsScreen + ViewModel (list + treemap, form)
[ ] Implement SettingsScreen + ViewModel (all sections)
[ ] Set up Navigation graph + BottomNavigation
[ ] Wire FAB menu
[ ] JSON export/import (share intent + file picker)
[ ] CSV export (share intent)
[ ] Budget reset + subscription billing auto-advance on app launch
[ ] Light/Dark/System theme toggle
[ ] Write unit tests for use cases
[ ] Write UI tests (Compose test) for critical flows
```

---

## 12. Gradle Dependencies (Key)

```kotlin
// build.gradle.kts (app)
val composeBom = platform("androidx.compose:compose-bom:2025.xx.xx")
implementation(composeBom)
implementation("androidx.compose.ui:ui")
implementation("androidx.compose.ui:ui-tooling-preview")
implementation("androidx.compose.material3:material3:1.4.0-alpha14") // M3 Expressive
implementation("androidx.navigation:navigation-compose:2.8.x")
implementation("androidx.hilt:hilt-navigation-compose:1.2.x")
implementation("com.google.dagger:hilt-android:2.5x")
kapt("com.google.dagger:hilt-compiler:2.5x")
implementation("androidx.room:room-runtime:2.6.x")
implementation("androidx.room:room-ktx:2.6.x")
kapt("androidx.room:room-compiler:2.6.x")
implementation("androidx.datastore:datastore-preferences:1.1.x")
implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.x")
implementation("com.patrykandpatrick.vico:compose-m3:2.x") // charts (optional)

// Testing
testImplementation("junit:junit:4.13.2")
testImplementation("io.mockk:mockk:1.13.x")
testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.8.x")
androidTestImplementation("androidx.compose.ui:ui-test-junit4")
```

> ⚠️ M3 Expressive APIs (`ButtonGroup`, `FloatingActionButtonMenu`, `LoadingIndicator`, shape morphing) require `@OptIn(ExperimentalMaterial3ExpressiveApi::class)`. Pin the alpha version until stable release.

---

## 13. M3 Expressive Features to Leverage

| Feature | Where Used |
|---|---|
| `FloatingActionButtonMenu` | Dashboard, Transactions — contextual quick-add |
| `ButtonGroup` | View mode toggles (list/chart/treemap), Type filters, Theme selector |
| `LoadingIndicator` / `ContainedLoadingIndicator` | Data load states |
| Shape morphing animations | Transaction card press, budget card hover state |
| Springy spring animations | List item entrance, screen transitions |
| Dynamic Color 2.0 | Wallpaper-adaptive theming (API 31+) |
| 35 shape tokens | Category chips, avatar icons, card corners |
| `SplitButton` | "Save & Add Another" in forms |
| Expressive typography scale | Dashboard summary numbers (extraLarge bold) |

---

## 14. Key Design Decisions

1. **No network layer** — fully offline, local-first (mirrors web's localStorage approach).
2. **Data migration path** — JSON export from web app can be imported via Settings → Import Data using the same schema.
3. **Budget–Transaction coupling** — budget `spent` is managed atomically by use cases (not Room triggers) for predictability, mirroring the web store logic exactly.
4. **Icon system** — Lucide icon names from web categories are mapped to `androidx.compose.material:material-icons-extended`. A mapping table will be maintained for full compatibility.
5. **Treemap** — implemented as a custom `Canvas` composable using a Squarified Treemap algorithm, matching the web's `SubscriptionTreemap` component visually.
6. **Tablet / foldable support** — `NavigationRail` on `WindowSizeClass.Medium/Expanded`, `NavigationBar` on `Compact`. Adaptive two-pane layout for Transactions on large screens.
