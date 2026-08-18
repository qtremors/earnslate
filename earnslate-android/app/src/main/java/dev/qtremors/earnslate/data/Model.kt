package dev.qtremors.earnslate.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@Serializable
enum class TransactionType { income, expense }

@Serializable
enum class TimeUnit { hour, day, week, month, year }

@Serializable
data class BillingCycle(val count: Int = 1, val unit: TimeUnit = TimeUnit.month)

@Serializable
@Entity(tableName = "transactions")
data class Transaction(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val description: String,
    val amount: Double,
    val category: String,
    val date: String = LocalDate.now().toString(),
    val type: TransactionType,
    val notes: String? = null,
    val createdAt: String = Instant.now().toString(),
)

@Serializable
@Entity(tableName = "budgets")
data class Budget(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val name: String,
    val limit: Double,
    val spent: Double = 0.0,
    val category: String,
    val icon: String = "Wallet",
    val color: String? = null,
    val period: BillingCycle = BillingCycle(),
    val periodStartDate: String = LocalDate.now().toString(),
    val createdAt: String = Instant.now().toString(),
)

@Serializable
@Entity(tableName = "subscriptions")
data class Subscription(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val name: String,
    val amount: Double,
    val cycle: BillingCycle = BillingCycle(),
    val nextBilling: String = LocalDate.now().toString(),
    val icon: String = "CreditCard",
    val color: String? = null,
    val active: Boolean = true,
    val notes: String? = null,
    val createdAt: String = Instant.now().toString(),
    val customIconPath: String? = null,
    val type: TransactionType = TransactionType.expense,
    val isVariable: Boolean = false,
)

@Serializable
@Entity(tableName = "categories")
data class Category(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val name: String,
    val icon: String = "Tag",
    val color: String = "#64748B",
    val type: String = "both",
)

@Serializable
enum class AppTheme { system, light, dark, oled }

@Serializable
enum class AppAccent {
    dynamic, purple, blue, cyan, teal, green, orange, pink, red, monochrome
}

@Serializable
data class UserSettings(
    val displayName: String = "User",
    val currency: String = "INR",
    val currencySymbol: String = "₹",
    val locale: String = "en-IN",
    val dateFormat: String = "DD/MM/YYYY",
    val theme: AppTheme = AppTheme.system,
    val accent: AppAccent = AppAccent.dynamic,
    val hapticsEnabled: Boolean = true,
    val hasCompletedOnboarding: Boolean = true,
    val customCategories: List<Category> = DefaultCategories,
    val smsDetectionEnabled: Boolean = false,
    val smsAutoApprove: Boolean = false,
)

@Serializable
data class ParsedSmsTransaction(
    val id: String = UUID.randomUUID().toString(),
    val rawBody: String,
    val sender: String,
    val amount: Double,
    val type: TransactionType,
    val date: String,
    val accountOrCard: String? = null,
    val merchant: String? = null,
    val suggestedCategory: String = "other",
    val referenceId: String? = null,
    val confidence: Float = 1.0f,
)

@Serializable
data class AndroidAsset(
    val entityId: String,
    val mimeType: String,
    val data: String,
    val fallbackIcon: String? = null,
)

@Serializable
data class BackupEnvelope(
    val version: String = "2.0.0",
    val exportDate: String = Instant.now().toString(),
    val settings: UserSettings? = null,
    val transactions: List<Transaction>? = null,
    val budgets: List<Budget>? = null,
    val subscriptions: List<Subscription>? = null,
    val androidAssets: List<AndroidAsset>? = null,
)

val DefaultCategories = listOf(
    Category("food", "Food & Dining", "Restaurant", "#F59E0B", "expense"),
    Category("transport", "Transport", "DirectionsCar", "#3693F3", "expense"),
    Category("entertainment", "Entertainment", "Movie", "#8B5CF6", "expense"),
    Category("shopping", "Shopping", "ShoppingCart", "#EC4899", "expense"),
    Category("utilities", "Utilities", "Lightbulb", "#10B981", "expense"),
    Category("health", "Health", "Favorite", "#EF4444", "expense"),
    Category("subscriptions", "Subscriptions", "CreditCard", "#6366F1", "expense"),
    Category("income", "Income", "Work", "#1DB954", "income"),
    Category("other", "Other", "AutoAwesome", "#64748B", "both"),
)

data class ServiceTemplate(
    val name: String,
    val icon: String,
    val color: String,
    val category: String,
)

/**
 * Kept as compact source data so every template is available without network access.
 * Brand names and colors are packaged in the APK; [ServiceIcon] renders a local monogram
 * when a dedicated vector is unavailable.
 */
val ServiceTemplates: List<ServiceTemplate> = """
Netflix|netflix|#E50914|Streaming
Amazon Prime|primevideo|#00A8E1|Streaming
Disney+ Hotstar|hotstar|#113CCF|Streaming
JioCinema|jio|#0A2540|Streaming
YouTube Premium|youtube|#FF0000|Streaming
Sony LIV|sony|#000000|Streaming
Zee5|tv|#8B5CF6|Streaming
HBO Max|hbo|#5822B4|Streaming
Hulu|hulu|#1CE783|Streaming
Apple TV+|appletv|#000000|Streaming
Crunchyroll|crunchyroll|#F47521|Streaming
Paramount+|paramount|#0064FF|Streaming
Peacock|peacock|#000000|Streaming
Nebula|nebula|#2A40FF|Streaming
Spotify|spotify|#1DB954|Music
Apple Music|applemusic|#FA243C|Music
YouTube Music|youtubemusic|#FF0000|Music
Amazon Music|amazonmusic|#25D1DA|Music
Tidal|tidal|#000000|Music
Deezer|deezer|#FEAA2D|Music
SoundCloud|soundcloud|#FF5500|Music
Gaana|music|#E72C30|Music
Wynk Music|music|#EE4D5F|Music
iCloud|icloud|#3693F3|Storage
Google One|googledrive|#4285F4|Storage
Dropbox|dropbox|#0061FF|Storage
OneDrive|onedrive|#0078D4|Storage
Box|box|#0061D5|Storage
pCloud|pcloud|#01AFEF|Storage
Xbox Game Pass|xbox|#107C10|Gaming
PlayStation Plus|playstation|#003087|Gaming
Nintendo Online|nintendoswitch|#E60012|Gaming
Steam|steam|#1B2838|Gaming
Epic Games|epicgames|#313131|Gaming
EA Play|ea|#000000|Gaming
Ubisoft+|ubisoft|#000000|Gaming
GeForce NOW|nvidia|#76B900|Gaming
Apple Arcade|applearcade|#000000|Gaming
Google Play Pass|googleplay|#01875F|Gaming
Microsoft 365|microsoft365|#05A6F0|Productivity
Notion|notion|#000000|Productivity
Canva|canva|#00C4CC|Productivity
Adobe Creative Cloud|adobe|#FF0000|Productivity
Figma|figma|#F24E1E|Productivity
Miro|miro|#FFD02F|Productivity
Todoist|todoist|#E44332|Productivity
Evernote|evernote|#00A82D|Productivity
Grammarly|grammarly|#15C39A|Productivity
Linear|linear|#5E6AD2|Productivity
Airtable|airtable|#18BFFF|Productivity
NordVPN|nordvpn|#4687FF|VPN
ExpressVPN|expressvpn|#DA3940|VPN
Surfshark|surfshark|#178BF4|VPN
ProtonVPN|protonvpn|#6D4AFF|VPN
1Password|1password|#3B66BC|Security
LastPass|lastpass|#D32D27|Security
Bitwarden|bitwarden|#175DDC|Security
Dashlane|dashlane|#0E353D|Security
Slack|slack|#4A154B|Communication
Discord Nitro|discord|#5865F2|Communication
Zoom|zoom|#0B5CFF|Communication
Microsoft Teams|microsoftteams|#6264A7|Communication
X Premium|x|#000000|Communication
Patreon|patreon|#FF424D|Creator
ChatGPT Plus|openai|#10A37F|AI
Codex|codex|#111111|AI
Claude Pro|anthropic|#D97706|AI
Midjourney|midjourney|#000000|AI
GitHub Copilot|githubcopilot|#000000|AI
Perplexity|perplexity|#1FB8CD|AI
Gemini|googlegemini|#4285F4|AI
GitHub Pro|github|#181717|Developer
GitLab|gitlab|#FC6D26|Developer
Vercel|vercel|#000000|Developer
Netlify|netlify|#00C7B7|Developer
DigitalOcean|digitalocean|#0080FF|Developer
AWS|amazonaws|#FF9900|Developer
Google Cloud|googlecloud|#4285F4|Developer
Azure|microsoftazure|#0078D4|Developer
Swiggy One|swiggy|#FC8019|Food
Zomato Gold|zomato|#E23744|Food
DoorDash|doordash|#FF3008|Food
Uber Eats|ubereats|#06C167|Food
Strava|strava|#FC4C02|Fitness
Headspace|headspace|#F47D31|Fitness
Calm|calm|#7FCFCF|Fitness
Peloton|peloton|#000000|Fitness
Cult.fit|fitness|#FF3366|Fitness
Gym Membership|fitness|#EF4444|Fitness
Kindle Unlimited|amazon|#FF9900|Reading
Audible|audible|#F8991C|Reading
Medium|medium|#000000|Reading
Coursera|coursera|#0056D2|Learning
Udemy|udemy|#A435F0|Learning
Skillshare|skillshare|#00FF84|Learning
LinkedIn Premium|linkedin|#0A66C2|Learning
Duolingo|duolingo|#58CC02|Learning
Electricity Bill|electricity|#F59E0B|Utility
Internet Bill|wifi|#8B5CF6|Utility
Mobile Recharge|smartphone|#10B981|Utility
Health Insurance|health|#EF4444|Insurance
Car Insurance|car|#3B82F6|Insurance
Life Insurance|shield|#10B981|Insurance
Rent|home|#6366F1|Housing
EMI|banknote|#F59E0B|Finance
SIP|trendingup|#10B981|Investment
Salary|work|#1DB954|Income
Freelance Retainer|laptop|#3693F3|Income
Rental Income|home|#F59E0B|Income
Dividends & Staking|trendingup|#8B5CF6|Income
Interest Payout|accountbalance|#10B981|Income
Consulting|business|#00A8E1|Income
YouTube Creator Payout|youtube|#FF0000|Income
""".trim().lineSequence().map { line ->
    val (name, icon, color, category) = line.split('|')
    ServiceTemplate(name, icon, color, category)
}.toList()
