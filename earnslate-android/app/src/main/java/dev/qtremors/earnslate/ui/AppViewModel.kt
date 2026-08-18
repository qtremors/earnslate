package dev.qtremors.earnslate.ui

import android.content.Context
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import dev.qtremors.earnslate.data.BackupEnvelope
import dev.qtremors.earnslate.data.BackupManager
import dev.qtremors.earnslate.data.Budget
import dev.qtremors.earnslate.data.Category
import dev.qtremors.earnslate.data.EarnslateRepository
import dev.qtremors.earnslate.data.IconStore
import dev.qtremors.earnslate.data.ImportPreview
import dev.qtremors.earnslate.data.Subscription
import dev.qtremors.earnslate.data.Transaction
import dev.qtremors.earnslate.data.UserSettings
import dev.qtremors.earnslate.data.csv
import dev.qtremors.earnslate.data.monthlyEquivalent
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import javax.inject.Inject

data class AppState(
    val transactions: List<Transaction> = emptyList(),
    val budgets: List<Budget> = emptyList(),
    val subscriptions: List<Subscription> = emptyList(),
    val categories: List<Category> = emptyList(),
    val settings: UserSettings = UserSettings(),
    val ready: Boolean = false,
)

@HiltViewModel
class AppViewModel @Inject constructor(
    private val repository: EarnslateRepository,
    private val backupManager: BackupManager,
    private val iconStore: IconStore,
    @ApplicationContext private val context: Context,
) : ViewModel() {
    val state: StateFlow<AppState> = combine(
        repository.transactions,
        repository.budgets,
        repository.subscriptions,
        repository.categories,
        repository.settingsStore.settings,
    ) { transactions, budgets, subscriptions, categories, settings ->
        AppState(transactions, budgets, subscriptions, categories, settings, true)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), AppState())

    val messages = MutableSharedFlow<String>(extraBufferCapacity = 8)
    val pendingImport = MutableStateFlow<Pair<BackupEnvelope, ImportPreview>?>(null)

    private val _pendingSmsTransactions = MutableStateFlow<List<dev.qtremors.earnslate.data.ParsedSmsTransaction>>(emptyList())
    val pendingSmsTransactions: StateFlow<List<dev.qtremors.earnslate.data.ParsedSmsTransaction>> = _pendingSmsTransactions

    private val _isScanningSms = MutableStateFlow(false)
    val isScanningSms: StateFlow<Boolean> = _isScanningSms

    init {
        launch("Unable to initialize data") { repository.initialize() }
    }

    fun save(transaction: Transaction) = launch("Could not save transaction") {
        repository.saveTransaction(transaction)
    }

    fun deleteTransaction(id: String) = launch("Could not delete transaction") {
        repository.deleteTransaction(id)
    }

    fun deleteTransactions(ids: Collection<String>) = launch("Could not delete transactions") {
        repository.deleteTransactions(ids)
    }

    fun save(budget: Budget) = launch("Could not save budget") { repository.saveBudget(budget) }
    fun deleteBudget(id: String) = launch("Could not delete budget") { repository.deleteBudget(id) }
    fun save(subscription: Subscription) = launch("Could not save subscription") { repository.saveSubscription(subscription) }
    fun deleteSubscription(id: String) = launch("Could not delete subscription") { repository.deleteSubscription(id) }
    fun save(category: Category) = launch("Could not save category") { repository.saveCategory(category) }
    fun delete(category: Category) = launch("Could not delete category") { repository.deleteCategory(category) }

    fun updateSettings(transform: (UserSettings) -> UserSettings) = launch("Could not save settings") {
        repository.settingsStore.update(transform)
    }

    fun clearAll() = launch("Could not clear data") {
        repository.clearAll()
        messages.emit("All local data cleared")
    }

    fun maintenance() = launch("Could not refresh recurring data") {
        repository.runMaintenance()
        autoScanSmsIfEnabled()
    }

    private suspend fun autoScanSmsIfEnabled() {
        val currentSettings = state.value.settings
        if (!currentSettings.smsDetectionEnabled) return
        val hasPermission = androidx.core.content.ContextCompat.checkSelfPermission(
            context,
            android.Manifest.permission.READ_SMS
        ) == android.content.pm.PackageManager.PERMISSION_GRANTED
        if (!hasPermission) return

        val currentTxs = state.value.transactions
        val detected = withContext(Dispatchers.IO) {
            dev.qtremors.earnslate.data.SmsInboxScanner.scanInbox(context, 30, currentTxs)
        }
        val existingIds = _pendingSmsTransactions.value.map { it.id }.toSet()
        val newItems = detected.filter { it.id !in existingIds }
        if (newItems.isNotEmpty()) {
            if (currentSettings.smsAutoApprove) {
                for (item in newItems) {
                    if (item.confidence >= 1.0f) {
                        val desc = item.merchant ?: "SMS Payment"
                        val tx = Transaction(
                            description = desc,
                            amount = item.amount,
                            category = item.suggestedCategory,
                            date = item.date,
                            type = item.type,
                            notes = "Auto-detected from SMS (${item.sender})" + if (item.accountOrCard != null) " • ${item.accountOrCard}" else "",
                        )
                        repository.saveTransaction(tx)
                    } else {
                        _pendingSmsTransactions.value = listOf(item) + _pendingSmsTransactions.value
                    }
                }
            } else {
                _pendingSmsTransactions.value = newItems + _pendingSmsTransactions.value
            }
        }
    }

    fun loadImport(uri: Uri) = launch("Invalid backup file") {
        val envelope = withContext(Dispatchers.IO) { backupManager.read(uri) }
        pendingImport.value = envelope to backupManager.preview(envelope)
    }

    fun cancelImport() {
        pendingImport.value = null
    }

    fun confirmImport() = launch("Import failed") {
        val envelope = pendingImport.value?.first ?: return@launch
        withContext(Dispatchers.IO) { backupManager.import(envelope) }
        repository.runMaintenance()
        pendingImport.value = null
        messages.emit("Backup restored")
    }

    fun exportBackup(uri: Uri) = launch("Export failed") {
        withContext(Dispatchers.IO) { backupManager.export(uri) }
        messages.emit("Backup exported")
    }

    fun importSubscriptionIcon(uri: Uri, onImported: (String) -> Unit) = launch("Icon import failed") {
        val path = withContext(Dispatchers.IO) { iconStore.import(uri) }
        onImported(path)
    }

    fun discardIcon(path: String?) {
        viewModelScope.launch(Dispatchers.IO) { iconStore.delete(path) }
    }

    fun exportCsv(uri: Uri, type: String, transactionIds: Set<String>? = null) = launch("CSV export failed") {
        val current = state.value
        val content = when (type) {
            "transactions" -> csv(
                listOf("Date", "Description", "Category", "Type", "Amount", "Notes"),
                current.transactions
                    .filter { transactionIds == null || it.id in transactionIds }
                    .map { listOf(it.date, it.description, it.category, it.type.name, it.amount, it.notes) },
            )
            "budgets" -> csv(
                listOf("Name", "Category", "Limit", "Spent", "Period", "Utilization"),
                current.budgets.map {
                    listOf(it.name, it.category, it.limit, it.spent, "${it.period.count} ${it.period.unit}", it.spent / it.limit)
                },
            )
            else -> csv(
                listOf("Name", "Amount", "Cycle", "Next Billing", "Active", "Monthly Equivalent"),
                current.subscriptions.map {
                    listOf(it.name, it.amount, "${it.cycle.count} ${it.cycle.unit}", it.nextBilling, it.active, monthlyEquivalent(it.amount, it.cycle))
                },
            )
        }
        withContext(Dispatchers.IO) {
            context.contentResolver.openOutputStream(uri, "wt")?.bufferedWriter()?.use { it.write(content) }
                ?: error("Unable to create CSV file")
        }
        messages.emit("CSV exported")
    }

    fun scanSmsInbox(daysAgo: Int = 30) = launch("SMS scan failed") {
        _isScanningSms.value = true
        try {
            val currentTxs = state.value.transactions
            val detected = withContext(Dispatchers.IO) {
                dev.qtremors.earnslate.data.SmsInboxScanner.scanInbox(context, daysAgo, currentTxs)
            }
            val existingIds = _pendingSmsTransactions.value.map { it.id }.toSet()
            val newItems = detected.filter { it.id !in existingIds }
            _pendingSmsTransactions.value = newItems + _pendingSmsTransactions.value
            if (newItems.isEmpty()) {
                messages.emit("No new bank SMS transactions found")
            } else {
                messages.emit("Found ${newItems.size} transaction${if (newItems.size > 1) "s" else ""} from SMS")
            }
        } finally {
            _isScanningSms.value = false
        }
    }

    fun approveSms(
        item: dev.qtremors.earnslate.data.ParsedSmsTransaction,
        category: String = item.suggestedCategory,
        notes: String? = null,
    ) = launch("Could not approve transaction") {
        val noteParts = listOfNotNull(
            notes?.takeIf { it.isNotBlank() },
            "SMS (${item.sender})",
            item.accountOrCard
        )
        val tx = Transaction(
            description = item.merchant ?: "SMS Transaction",
            amount = item.amount,
            category = category,
            date = item.date,
            type = item.type,
            notes = noteParts.joinToString(" • "),
        )
        repository.saveTransaction(tx)
        _pendingSmsTransactions.value = _pendingSmsTransactions.value.filter { it.id != item.id }
        messages.emit("Transaction approved")
    }

    fun discardSms(item: dev.qtremors.earnslate.data.ParsedSmsTransaction) {
        _pendingSmsTransactions.value = _pendingSmsTransactions.value.filter { it.id != item.id }
    }

    fun approveAllSms() = launch("Could not approve all") {
        val items = _pendingSmsTransactions.value
        for (item in items) {
            val noteParts = listOfNotNull(
                "SMS (${item.sender})",
                item.accountOrCard
            )
            val tx = Transaction(
                description = item.merchant ?: "SMS Transaction",
                amount = item.amount,
                category = item.suggestedCategory,
                date = item.date,
                type = item.type,
                notes = noteParts.joinToString(" • "),
            )
            repository.saveTransaction(tx)
        }
        _pendingSmsTransactions.value = emptyList()
        messages.emit("Approved ${items.size} transaction${if (items.size > 1) "s" else ""}")
    }

    fun discardAllSms() {
        _pendingSmsTransactions.value = emptyList()
    }

    private fun launch(fallback: String, block: suspend () -> Unit) {
        viewModelScope.launch {
            runCatching { block() }.onFailure { messages.emit(it.message ?: fallback) }
        }
    }
}
