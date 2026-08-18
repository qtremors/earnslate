package dev.qtremors.earnslate

import android.graphics.Bitmap
import android.net.Uri
import androidx.room.Room
import dev.qtremors.earnslate.data.AndroidAsset
import dev.qtremors.earnslate.data.BackupEnvelope
import dev.qtremors.earnslate.data.BackupManager
import dev.qtremors.earnslate.data.Budget
import dev.qtremors.earnslate.data.Category
import dev.qtremors.earnslate.data.EarnslateDatabase
import dev.qtremors.earnslate.data.IconStore
import dev.qtremors.earnslate.data.SettingsStore
import dev.qtremors.earnslate.data.Subscription
import dev.qtremors.earnslate.data.Transaction
import dev.qtremors.earnslate.data.TransactionType
import dev.qtremors.earnslate.data.UserSettings
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.annotation.Config
import java.io.File

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class BackupManagerTest {
    private lateinit var database: EarnslateDatabase
    private lateinit var settings: SettingsStore
    private lateinit var icons: IconStore
    private lateinit var manager: BackupManager
    private val context get() = RuntimeEnvironment.getApplication()

    @Before
    fun setUp() {
        database = Room.inMemoryDatabaseBuilder(context, EarnslateDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        settings = SettingsStore(context)
        icons = IconStore(context)
        manager = BackupManager(context, database, settings, icons)
    }

    @After
    fun tearDown() {
        database.close()
    }

    @Test
    fun fullBackupRoundTripRestoresSettingsRecordsCategoriesAndIcon() = runTest {
        val category = Category("travel", "Travel", "Flight", "#336699", "expense")
        val transaction = Transaction(
            id = "transaction-1",
            description = "Train",
            amount = -42.5,
            category = category.name,
            date = "2026-06-20",
            type = TransactionType.expense,
            notes = "Window seat",
            createdAt = "2026-06-20T10:00:00Z",
        )
        val budget = Budget(
            id = "budget-1",
            name = "Travel",
            limit = 500.0,
            spent = 42.5,
            category = category.name,
            color = "#336699",
            periodStartDate = "2026-06-01",
            createdAt = "2026-06-01T00:00:00Z",
        )
        val sourceImage = File(context.cacheDir, "backup-source.png")
        Bitmap.createBitmap(2, 2, Bitmap.Config.ARGB_8888).run {
            sourceImage.outputStream().use { compress(Bitmap.CompressFormat.PNG, 100, it) }
            recycle()
        }
        val originalIcon = icons.import(Uri.fromFile(sourceImage))
        val subscription = Subscription(
            id = "subscription-1",
            name = "Example",
            amount = 9.99,
            nextBilling = "2026-07-20",
            color = "#663399",
            notes = "Annual plan",
            createdAt = "2026-06-20T10:00:00Z",
            customIconPath = originalIcon,
        )
        val userSettings = UserSettings(
            displayName = "Alex",
            currency = "USD",
            currencySymbol = "$",
            locale = "en-US",
            dateFormat = "MM/DD/YYYY",
            hasCompletedOnboarding = true,
            customCategories = listOf(category),
        )

        database.transactions().upsert(transaction)
        database.budgets().upsert(budget)
        database.subscriptions().upsert(subscription)
        database.categories().upsert(category)
        settings.replace(userSettings)

        val backupFile = File(context.cacheDir, "earnslate-round-trip.json")
        manager.export(Uri.fromFile(backupFile))

        database.transactions().clear()
        database.budgets().clear()
        database.subscriptions().clear()
        database.categories().clear()
        settings.replace(UserSettings())

        val backup = manager.read(Uri.fromFile(backupFile))
        manager.import(backup)

        assertEquals(listOf(transaction), database.transactions().all())
        assertEquals(listOf(budget), database.budgets().all())
        assertEquals(listOf(category), database.categories().all())
        assertEquals(userSettings, settings.settings.first())
        val restoredSubscription = database.subscriptions().all().single()
        assertEquals(subscription.copy(customIconPath = restoredSubscription.customIconPath), restoredSubscription)
        assertNotEquals(originalIcon, restoredSubscription.customIconPath)
        assertTrue(File(restoredSubscription.customIconPath!!).isFile)
    }

    @Test
    fun corruptCustomIconLeavesExistingDataUntouched() = runTest {
        val existing = Subscription(
            id = "existing",
            name = "Existing",
            amount = 4.0,
            nextBilling = "2026-07-01",
        )
        database.subscriptions().upsert(existing)
        val corrupt = BackupEnvelope(
            subscriptions = listOf(
                Subscription(
                    id = "replacement",
                    name = "Replacement",
                    amount = 8.0,
                    nextBilling = "2026-08-01",
                )
            ),
            androidAssets = listOf(
                AndroidAsset("replacement", "image/png", "bm90LWEtcG5n")
            ),
        )

        val result = runCatching { manager.import(corrupt) }

        assertTrue(result.isFailure)
        assertEquals(listOf(existing), database.subscriptions().all())
    }

    @Test
    fun partialBackupLeavesAbsentSectionsUntouched() = runTest {
        val transaction = Transaction(
            id = "existing-transaction",
            description = "Existing",
            amount = 12.0,
            category = "Income",
            type = TransactionType.income,
        )
        val subscription = Subscription(
            id = "existing-subscription",
            name = "Existing",
            amount = 4.0,
            nextBilling = "2026-07-01",
        )
        database.transactions().upsert(transaction)
        database.subscriptions().upsert(subscription)

        manager.import(BackupEnvelope(budgets = emptyList()))

        assertEquals(listOf(transaction), database.transactions().all())
        assertEquals(listOf(subscription), database.subscriptions().all())
    }

    @Test
    fun emptyEnvelopeIsRejected() = runTest {
        assertTrue(runCatching { manager.import(BackupEnvelope()) }.isFailure)
    }
}
