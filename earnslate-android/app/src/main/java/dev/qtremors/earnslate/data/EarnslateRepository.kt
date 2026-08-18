package dev.qtremors.earnslate.data

import androidx.room.withTransaction
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.YearMonth
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.abs

@Singleton
class EarnslateRepository @Inject constructor(
    private val database: EarnslateDatabase,
    val settingsStore: SettingsStore,
) {
    val transactions: Flow<List<Transaction>> = database.transactions().observeAll()
    val budgets: Flow<List<Budget>> = database.budgets().observeAll()
    val subscriptions: Flow<List<Subscription>> = database.subscriptions().observeAll()
    val categories: Flow<List<Category>> = database.categories().observeAll()

    suspend fun initialize() {
        database.withTransaction {
            if (database.categories().count() == 0) database.categories().upsertAll(DefaultCategories)
        }
        runMaintenance()
    }

    suspend fun saveTransaction(transaction: Transaction) {
        database.withTransaction {
            database.transactions().upsert(transaction.normalized())
            recalculateBudgetsLocked()
        }
    }

    suspend fun deleteTransaction(id: String) {
        database.withTransaction {
            database.transactions().byId(id)?.let { database.transactions().delete(it) }
            recalculateBudgetsLocked()
        }
    }

    suspend fun deleteTransactions(ids: Collection<String>) {
        if (ids.isEmpty()) return
        database.withTransaction {
            database.transactions().deleteIds(ids.toList())
            recalculateBudgetsLocked()
        }
    }

    suspend fun saveBudget(budget: Budget) {
        database.withTransaction {
            database.budgets().upsert(budget.copy(limit = budget.limit.coerceAtLeast(0.0)))
            recalculateBudgetsLocked()
        }
    }

    suspend fun deleteBudget(id: String) {
        database.budgets().byId(id)?.let { database.budgets().delete(it) }
    }

    suspend fun saveSubscription(subscription: Subscription) {
        database.withTransaction {
            val old = database.subscriptions().byId(subscription.id)
            database.subscriptions().upsert(subscription.copy(amount = abs(subscription.amount)))
            if (old?.customIconPath != null && old.customIconPath != subscription.customIconPath) {
                java.io.File(old.customIconPath).delete()
            }
        }
        runMaintenance()
    }

    suspend fun deleteSubscription(id: String) {
        database.subscriptions().byId(id)?.let {
            database.subscriptions().delete(it)
            it.customIconPath?.let { path -> java.io.File(path).delete() }
        }
    }

    suspend fun saveCategory(category: Category) {
        database.categories().upsert(category)
        syncCategoriesToSettings()
    }

    suspend fun deleteCategory(category: Category) {
        if (database.categories().all().size <= 1) return
        database.categories().delete(category)
        syncCategoriesToSettings()
    }

    suspend fun clearAll() {
        database.subscriptions().all().forEach { it.customIconPath?.let { path -> java.io.File(path).delete() } }
        database.withTransaction {
            database.transactions().clear()
            database.budgets().clear()
            database.subscriptions().clear()
            database.categories().clear()
            database.categories().upsertAll(DefaultCategories)
        }
        settingsStore.replace(UserSettings())
    }

    suspend fun runMaintenance(
        today: LocalDate = LocalDate.now(),
        now: LocalDateTime = LocalDateTime.now(),
    ) {
        database.withTransaction {
            val refreshedBudgets = database.budgets().all().map { budget ->
                var start = parseDate(budget.periodStartDate) ?: today
                while (!calculateNextDate(start, budget.period).isAfter(today)) {
                    start = calculateNextDate(start, budget.period)
                }
                if (start != parseDate(budget.periodStartDate)) {
                    budget.copy(periodStartDate = start.toString())
                } else budget
            }
            database.budgets().upsertAll(refreshedBudgets)
            recalculateBudgetsLocked()

            val existingTransactions = database.transactions().all()
            val newTransactions = mutableListOf<Transaction>()

            val refreshedSubscriptions = database.subscriptions().all().map { subscription ->
                if (!subscription.active) subscription
                else {
                    val txType = subscription.type
                    val categoryName = if (txType == TransactionType.income) "Income" else "Subscriptions"
                    val noteText = when {
                        txType == TransactionType.income && subscription.isVariable -> "Recurring income (variable estimate)"
                        txType == TransactionType.income -> "Recurring income payout"
                        else -> "Recurring subscription payment"
                    }

                    if (subscription.cycle.unit == TimeUnit.hour) {
                        var next = parseDateTime(subscription.nextBilling) ?: today.atStartOfDay()
                        while (next.isBefore(now)) {
                            val billingDateStr = next.toLocalDate().toString()
                            val alreadyExists = existingTransactions.any {
                                it.description.equals(subscription.name, ignoreCase = true) &&
                                it.date == billingDateStr &&
                                it.type == txType
                            } || newTransactions.any {
                                it.description.equals(subscription.name, ignoreCase = true) &&
                                it.date == billingDateStr &&
                                it.type == txType
                            }
                            if (!alreadyExists) {
                                newTransactions.add(
                                    Transaction(
                                        description = subscription.name,
                                        amount = subscription.amount,
                                        category = categoryName,
                                        date = billingDateStr,
                                        type = txType,
                                        notes = noteText
                                    )
                                )
                            }
                            next = calculateNextDateTime(next, subscription.cycle)
                        }
                        subscription.copy(nextBilling = next.toString())
                    }
                    else {
                        var next = parseDate(subscription.nextBilling) ?: today
                        while (next.isBefore(today) || next == today) {
                            val billingDateStr = next.toString()
                            val alreadyExists = existingTransactions.any {
                                it.description.equals(subscription.name, ignoreCase = true) &&
                                it.date == billingDateStr &&
                                it.type == txType
                            } || newTransactions.any {
                                it.description.equals(subscription.name, ignoreCase = true) &&
                                it.date == billingDateStr &&
                                it.type == txType
                            }
                            if (!alreadyExists) {
                                newTransactions.add(
                                    Transaction(
                                        description = subscription.name,
                                        amount = subscription.amount,
                                        category = categoryName,
                                        date = billingDateStr,
                                        type = txType,
                                        notes = noteText
                                    )
                                )
                            }
                            next = calculateNextDate(next, subscription.cycle)
                        }
                        subscription.copy(nextBilling = next.toString())
                    }
                }
            }
            if (newTransactions.isNotEmpty()) {
                val hasSubscriptionCategory = database.categories().all().any { it.name.equals("Subscriptions", ignoreCase = true) }
                if (!hasSubscriptionCategory) {
                    database.categories().upsert(Category("subscriptions", "Subscriptions", "CreditCard", "#6366F1", "expense"))
                }
                database.transactions().upsertAll(newTransactions.map { it.normalized() })
            }
            database.subscriptions().upsertAll(refreshedSubscriptions)
            recalculateBudgetsLocked()
        }
    }

    private suspend fun syncCategoriesToSettings() {
        val categories = database.categories().all()
        settingsStore.update { it.copy(customCategories = categories) }
    }

    private suspend fun recalculateBudgetsLocked() {
        val transactions = database.transactions().all()
        val budgets = database.budgets().all().map { budget ->
            val start = parseDate(budget.periodStartDate) ?: LocalDate.MIN
            val end = calculateNextDate(start, budget.period)
            val spent = transactions.asSequence()
                .filter { it.type == TransactionType.expense }
                .filter { it.category.equals(budget.category, ignoreCase = true) }
                .filter {
                    val date = parseDate(it.date)
                    date != null && !date.isBefore(start) && date.isBefore(end)
                }
                .sumOf { abs(it.amount) }
            budget.copy(spent = spent)
        }
        database.budgets().upsertAll(budgets)
    }

    suspend fun isDuplicateTransaction(amount: Double, date: String, description: String): Boolean {
        val all = database.transactions().all()
        return all.any { tx ->
            tx.date == date &&
                abs(tx.amount) == abs(amount) &&
                (tx.description.contains(description, ignoreCase = true) || description.contains(tx.description, ignoreCase = true))
        }
    }

    private fun Transaction.normalized() = copy(
        description = description.trim().take(500),
        category = category.trim().take(100),
        notes = notes?.trim()?.take(2_000),
        amount = if (type == TransactionType.expense) -abs(amount) else abs(amount),
    )
}

fun calculateNextDate(date: LocalDate, cycle: BillingCycle): LocalDate {
    val count = cycle.count.coerceAtLeast(1).toLong()
    return when (cycle.unit) {
        TimeUnit.hour -> date.plusDays((count + 23) / 24)
        TimeUnit.day -> date.plusDays(count)
        TimeUnit.week -> date.plusWeeks(count)
        TimeUnit.month -> {
            val target = YearMonth.from(date).plusMonths(count)
            target.atDay(date.dayOfMonth.coerceAtMost(target.lengthOfMonth()))
        }
        TimeUnit.year -> {
            val targetYear = date.year + count.toInt()
            val target = YearMonth.of(targetYear, date.month)
            target.atDay(date.dayOfMonth.coerceAtMost(target.lengthOfMonth()))
        }
    }
}

fun calculateNextDateTime(date: LocalDateTime, cycle: BillingCycle): LocalDateTime =
    if (cycle.unit == TimeUnit.hour) date.plusHours(cycle.count.coerceAtLeast(1).toLong())
    else calculateNextDate(date.toLocalDate(), cycle).atTime(date.toLocalTime())

fun monthlyEquivalent(amount: Double, cycle: BillingCycle): Double {
    val count = cycle.count.coerceAtLeast(1).toDouble()
    return when (cycle.unit) {
        TimeUnit.hour -> amount * 24.0 * 30.0 / count
        TimeUnit.day -> amount * 30.0 / count
        TimeUnit.week -> amount * (30.0 / 7.0) / count
        TimeUnit.month -> amount / count
        TimeUnit.year -> amount / (12.0 * count)
    }
}

fun parseDate(value: String): LocalDate? = runCatching {
    LocalDate.parse(value.take(10))
}.getOrNull()

fun parseDateTime(value: String): LocalDateTime? = runCatching {
    if ('T' in value) LocalDateTime.parse(value) else LocalDate.parse(value.take(10)).atStartOfDay()
}.getOrNull()
