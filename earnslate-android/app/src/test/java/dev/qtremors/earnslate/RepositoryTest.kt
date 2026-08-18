package dev.qtremors.earnslate

import androidx.room.Room
import dev.qtremors.earnslate.data.Budget
import dev.qtremors.earnslate.data.EarnslateDatabase
import dev.qtremors.earnslate.data.EarnslateRepository
import dev.qtremors.earnslate.data.SettingsStore
import dev.qtremors.earnslate.data.Transaction
import dev.qtremors.earnslate.data.TransactionType
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class RepositoryTest {
    private lateinit var database: EarnslateDatabase
    private lateinit var repository: EarnslateRepository

    @Before
    fun setUp() {
        val context = RuntimeEnvironment.getApplication()
        database = Room.inMemoryDatabaseBuilder(context, EarnslateDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        repository = EarnslateRepository(database, SettingsStore(context))
    }

    @After
    fun tearDown() = database.close()

    @Test
    fun transactionChangesRecalculateMatchingBudgetAtomically() = runTest {
        repository.initialize()
        repository.saveBudget(Budget(id = "food-budget", name = "Food", limit = 500.0, category = "Food"))
        repository.saveTransaction(
            Transaction(
                id = "tx",
                description = "Lunch",
                amount = 25.0,
                category = "Food",
                type = TransactionType.expense,
            )
        )
        assertEquals(25.0, repository.budgets.first().single().spent, 0.001)

        repository.saveTransaction(
            Transaction(
                id = "tx",
                description = "Refund",
                amount = 25.0,
                category = "Food",
                type = TransactionType.income,
            )
        )
        assertEquals(0.0, repository.budgets.first().single().spent, 0.001)
    }

    @Test
    fun pastSubscriptionGeneratesRecurringTransactionsAcrossElapsedCycles() = runTest {
        repository.initialize()
        val today = java.time.LocalDate.of(2026, 8, 17)
        val fourMonthsAgo = java.time.LocalDate.of(2026, 4, 17)

        repository.saveSubscription(
            dev.qtremors.earnslate.data.Subscription(
                id = "sub-netflix",
                name = "Netflix",
                amount = 15.0,
                cycle = dev.qtremors.earnslate.data.BillingCycle(1, dev.qtremors.earnslate.data.TimeUnit.month),
                nextBilling = fourMonthsAgo.toString()
            )
        )

        repository.runMaintenance(today = today)

        val transactions = repository.transactions.first()
        // Should generate 5 transactions: April 17, May 17, June 17, July 17, August 17
        assertEquals(5, transactions.size)
        assertEquals(15.0, kotlin.math.abs(transactions[0].amount), 0.001)

        val updatedSub = repository.subscriptions.first().single()
        // Next billing should advance to 2026-09-17
        assertEquals("2026-09-17", updatedSub.nextBilling)
    }

    @Test
    fun pastSalaryIncomeGeneratesRecurringIncomeTransactionsWithPositiveAmount() = runTest {
        repository.initialize()
        val today = java.time.LocalDate.of(2026, 8, 17)
        val threeMonthsAgo = java.time.LocalDate.of(2026, 5, 17)

        repository.saveSubscription(
            dev.qtremors.earnslate.data.Subscription(
                id = "inc-salary",
                name = "Monthly Salary",
                amount = 5000.0,
                cycle = dev.qtremors.earnslate.data.BillingCycle(1, dev.qtremors.earnslate.data.TimeUnit.month),
                nextBilling = threeMonthsAgo.toString(),
                type = TransactionType.income,
                isVariable = true
            )
        )

        repository.runMaintenance(today = today)

        val transactions = repository.transactions.first()
        // 4 payouts: May 17, June 17, July 17, August 17
        assertEquals(4, transactions.size)
        assertEquals(5000.0, transactions[0].amount, 0.001)
        assertEquals(TransactionType.income, transactions[0].type)
        assertEquals("Income", transactions[0].category)

        val updatedSub = repository.subscriptions.first().single()
        assertEquals("2026-09-17", updatedSub.nextBilling)
        assertEquals(true, updatedSub.isVariable)
        assertEquals(TransactionType.income, updatedSub.type)
    }
}

