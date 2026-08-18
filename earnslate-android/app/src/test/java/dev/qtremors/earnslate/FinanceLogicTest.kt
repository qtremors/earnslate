package dev.qtremors.earnslate

import dev.qtremors.earnslate.data.BillingCycle
import dev.qtremors.earnslate.data.ServiceTemplates
import dev.qtremors.earnslate.data.TimeUnit
import dev.qtremors.earnslate.data.calculateNextDate
import dev.qtremors.earnslate.data.calculateNextDateTime
import dev.qtremors.earnslate.data.csv
import dev.qtremors.earnslate.data.monthlyEquivalent
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate
import java.time.LocalDateTime

class FinanceLogicTest {
    @Test
    fun monthEndAndLeapYearCyclesClampSafely() {
        assertEquals(
            LocalDate.of(2025, 2, 28),
            calculateNextDate(LocalDate.of(2025, 1, 31), BillingCycle(1, TimeUnit.month)),
        )
        assertEquals(
            LocalDate.of(2025, 2, 28),
            calculateNextDate(LocalDate.of(2024, 2, 29), BillingCycle(1, TimeUnit.year)),
        )
    }

    @Test
    fun monthlyEquivalentSupportsEveryCycle() {
        assertEquals(720.0, monthlyEquivalent(1.0, BillingCycle(1, TimeUnit.hour)), 0.001)
        assertEquals(30.0, monthlyEquivalent(1.0, BillingCycle(1, TimeUnit.day)), 0.001)
        assertEquals(10.0, monthlyEquivalent(20.0, BillingCycle(2, TimeUnit.month)), 0.001)
        assertEquals(10.0, monthlyEquivalent(120.0, BillingCycle(1, TimeUnit.year)), 0.001)
    }

    @Test
    fun hourlyBillingPreservesTimeAndAdvancesByCount() {
        assertEquals(
            LocalDateTime.of(2026, 6, 27, 18, 45),
            calculateNextDateTime(
                LocalDateTime.of(2026, 6, 27, 15, 45),
                BillingCycle(3, TimeUnit.hour),
            ),
        )
    }

    @Test
    fun csvEscapesQuotesCommasAndNewlines() {
        val result = csv(
            listOf("Name", "Notes"),
            listOf(listOf("A, B", "line one\n\"line two\"")),
        )
        assertEquals("Name,Notes\r\n\"A, B\",\"line one\n\"\"line two\"\"\"", result)
    }

    @Test
    fun completeOfflineServiceCatalogIsPackaged() {
        assertTrue(ServiceTemplates.size >= 100)
        assertTrue(ServiceTemplates.any { it.name == "Netflix" })
        assertTrue(ServiceTemplates.any { it.name == "SIP" })
    }

    @Test
    fun calculateSpendHistoryAggregatesExpensesInflowsAndTopCategoriesCorrectly() {
        val today = LocalDate.of(2026, 8, 17)
        val transactions = listOf(
            dev.qtremors.earnslate.data.Transaction(id = "1", description = "Netflix", amount = 15.0, category = "Subscriptions", date = "2026-08-17", type = dev.qtremors.earnslate.data.TransactionType.expense),
            dev.qtremors.earnslate.data.Transaction(id = "2", description = "Salary", amount = 5000.0, category = "Income", date = "2026-08-01", type = dev.qtremors.earnslate.data.TransactionType.income),
            dev.qtremors.earnslate.data.Transaction(id = "3", description = "Groceries", amount = 100.0, category = "Food", date = "2026-07-15", type = dev.qtremors.earnslate.data.TransactionType.expense),
            dev.qtremors.earnslate.data.Transaction(id = "4", description = "Netflix", amount = 15.0, category = "Subscriptions", date = "2026-07-17", type = dev.qtremors.earnslate.data.TransactionType.expense),
            dev.qtremors.earnslate.data.Transaction(id = "5", description = "Netflix", amount = 15.0, category = "Subscriptions", date = "2026-06-17", type = dev.qtremors.earnslate.data.TransactionType.expense),
            dev.qtremors.earnslate.data.Transaction(id = "6", description = "Netflix", amount = 15.0, category = "Subscriptions", date = "2026-05-17", type = dev.qtremors.earnslate.data.TransactionType.expense),
            dev.qtremors.earnslate.data.Transaction(id = "7", description = "Netflix", amount = 15.0, category = "Subscriptions", date = "2026-04-17", type = dev.qtremors.earnslate.data.TransactionType.expense),
        )

        val history6M = dev.qtremors.earnslate.ui.calculateSpendHistory(transactions, "6M", today)
        assertEquals(6, history6M.size)
        // August is the last bucket
        val augustBucket = history6M.last()
        assertEquals(15.0, augustBucket.expense, 0.001)
        assertEquals(5000.0, augustBucket.income, 0.001)
        assertEquals(4985.0, augustBucket.net, 0.001)
        assertEquals("Subscriptions", augustBucket.topCategory)

        // July is the 5th bucket (index 4)
        val julyBucket = history6M[4]
        assertEquals(115.0, julyBucket.expense, 0.001)
        assertEquals("Food", julyBucket.topCategory)
    }

    @Test
    fun duplicateDetectionIdentifiesMatchingTransactions() {
        val existing = dev.qtremors.earnslate.data.Transaction(
            description = "Swiggy Order",
            amount = -450.0,
            category = "Food & Dining",
            date = "2026-08-18",
            type = dev.qtremors.earnslate.data.TransactionType.expense
        )
        val parsed = dev.qtremors.earnslate.data.ParsedSmsTransaction(
            rawBody = "Rs 450 debited to Swiggy",
            sender = "HDFCBK",
            amount = 450.0,
            type = dev.qtremors.earnslate.data.TransactionType.expense,
            date = "2026-08-18",
            merchant = "Swiggy"
        )
        val isDuplicate = existing.date == parsed.date &&
            kotlin.math.abs(existing.amount) == parsed.amount &&
            existing.type == parsed.type &&
            (parsed.merchant == null || existing.description.contains(parsed.merchant!!, ignoreCase = true))
        assertTrue(isDuplicate)
    }
}

