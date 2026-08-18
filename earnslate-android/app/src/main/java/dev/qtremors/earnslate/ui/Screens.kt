@file:OptIn(
    androidx.compose.material3.ExperimentalMaterial3Api::class,
    androidx.compose.material3.ExperimentalMaterial3ExpressiveApi::class
)

package dev.qtremors.earnslate.ui

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Category
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Payments
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Sort
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.materialkolor.ktx.harmonize
import dev.qtremors.earnslate.data.Budget
import dev.qtremors.earnslate.data.Subscription
import dev.qtremors.earnslate.data.Transaction
import dev.qtremors.earnslate.data.TransactionType
import dev.qtremors.earnslate.data.monthlyEquivalent
import dev.qtremors.earnslate.data.parseDate
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import kotlin.math.abs
import kotlin.math.max

// =========================================================================
// Dashboard Screen
// =========================================================================

@Composable
fun DashboardScreen(state: AppState, viewModel: AppViewModel, onSettings: () -> Unit, onNavigate: (String) -> Unit) {
    val month = LocalDate.now().withDayOfMonth(1)
    val monthTransactions = state.transactions.filter { (parseDate(it.date) ?: LocalDate.MIN) >= month }
    val income = monthTransactions.filter { it.type == TransactionType.income }.sumOf { abs(it.amount) }
    val expenses = monthTransactions.filter { it.type == TransactionType.expense }.sumOf { abs(it.amount) }
    val balance = state.transactions.sumOf { if (it.type == TransactionType.income) abs(it.amount) else -abs(it.amount) }
    val spending = monthTransactions.filter { it.type == TransactionType.expense }
        .groupBy(Transaction::category).mapValues { (_, values) -> values.sumOf { abs(it.amount) } }.toList()

    val pendingSms by viewModel.pendingSmsTransactions.collectAsStateWithLifecycle()
    var showSmsSheet by remember { mutableStateOf(false) }
    var quickAddType by remember { mutableStateOf<TransactionType?>(null) }

    Scaffold(
        topBar = { AppTopBar("Dashboard", "Hello, ${state.settings.displayName}", onSettings) },
        containerColor = Color.Transparent
    ) { padding ->
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 120.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            // Living Hero Balance Card with Shortcuts
            item {
                HeroBalanceCard(
                    balance = balance,
                    settings = state.settings,
                    onAddIncome = { quickAddType = TransactionType.income },
                    onAddExpense = { quickAddType = TransactionType.expense },
                    modifier = Modifier.fillMaxWidth()
                )
            }

            // Detected SMS Payments Banner
            if (pendingSms.isNotEmpty()) {
                item {
                    Card(
                        shape = RoundedCornerShape(22.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.75f)
                        ),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.35f)),
                        onClick = { showSmsSheet = true },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Surface(
                                    shape = CircleShape,
                                    color = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(38.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Icon(
                                            Icons.Default.AutoAwesome,
                                            contentDescription = null,
                                            tint = MaterialTheme.colorScheme.onPrimary,
                                            modifier = Modifier.size(20.dp)
                                        )
                                    }
                                }
                                Column(modifier = Modifier.weight(1f, fill = false)) {
                                    Text(
                                        text = "${pendingSms.size} new payment${if (pendingSms.size > 1) "s" else ""} detected",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold,
                                        maxLines = 1,
                                        softWrap = false,
                                        overflow = TextOverflow.Ellipsis,
                                        color = MaterialTheme.colorScheme.onPrimaryContainer
                                    )
                                    Text(
                                        text = "Smart inbox ready for 1-tap review",
                                        style = MaterialTheme.typography.bodySmall,
                                        maxLines = 1,
                                        softWrap = false,
                                        overflow = TextOverflow.Ellipsis,
                                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                                    )
                                }
                            }
                            Spacer(Modifier.width(8.dp))
                            FilledTonalButton(
                                onClick = { showSmsSheet = true },
                                shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.filledTonalButtonColors(
                                    containerColor = MaterialTheme.colorScheme.primary,
                                    contentColor = MaterialTheme.colorScheme.onPrimary
                                )
                            ) {
                                Text("Review", maxLines = 1, softWrap = false, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            // Income & Expense Dual Stat Cards
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard(
                        label = "Month Income",
                        value = currency(income, state.settings),
                        icon = Icons.Default.TrendingUp,
                        tint = Color(0xFF10B981),
                        modifier = Modifier.weight(1f)
                    )
                    StatCard(
                        label = "Month Expense",
                        value = currency(expenses, state.settings),
                        icon = Icons.Default.TrendingDown,
                        tint = MaterialTheme.colorScheme.error,
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // Spend & Cash Flow History Card
            item {
                SpendHistoryCard(
                    transactions = state.transactions,
                    settings = state.settings,
                    modifier = Modifier.fillMaxWidth()
                )
            }

            // Budget Alerts (if any)
            val alerts = state.budgets.filter { it.limit > 0 && it.spent / it.limit >= .8 }
            if (alerts.isNotEmpty()) {
                item {
                    Card(
                        shape = RoundedCornerShape(24.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.6f)),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.error.copy(alpha = 0.3f))
                    ) {
                        Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Warning, null, tint = MaterialTheme.colorScheme.error, modifier = Modifier.size(20.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("Budget Alerts", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onErrorContainer)
                            }
                            alerts.forEach { budget ->
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(budget.name, fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.onErrorContainer)
                                    Text("${(budget.spent / budget.limit * 100).toInt()}% used", fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.error)
                                }
                            }
                        }
                    }
                }
            }

            // Spending by Category Section with Interactive Donut Chart
            item {
                SectionCard("Spending by Category") {
                    if (spending.isEmpty()) {
                        Text("No expenses logged this month yet.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    } else {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            DonutChart(
                                values = spending,
                                modifier = Modifier.size(160.dp)
                            )
                            Spacer(Modifier.width(16.dp))
                            Column(
                                verticalArrangement = Arrangement.spacedBy(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                spending.sortedByDescending { it.second }.take(4).forEach { (categoryName, amount) ->
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            categoryName,
                                            style = MaterialTheme.typography.bodyMedium,
                                            fontWeight = FontWeight.SemiBold,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis,
                                            modifier = Modifier.weight(1f)
                                        )
                                        Text(
                                            currency(amount, state.settings),
                                            style = MaterialTheme.typography.bodyMedium,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Recent Transactions
            item {
                SectionCard("Recent Activity") {
                    if (state.transactions.isEmpty()) {
                        Text("No transactions yet", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    } else {
                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            state.transactions.take(5).forEach { transaction ->
                                TransactionSummary(transaction, state)
                            }
                            Spacer(Modifier.height(4.dp))
                            FilledTonalButton(
                                onClick = { onNavigate("transactions") },
                                shape = CircleShape,
                                modifier = Modifier.fillMaxWidth().height(44.dp)
                            ) {
                                Text("View All Transactions", fontWeight = FontWeight.Bold)
                                Spacer(Modifier.width(6.dp))
                                Icon(Icons.AutoMirrored.Filled.ArrowForward, null, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }
            }

            // Active Budget Status
            item {
                SectionCard("Budget Status") {
                    if (state.budgets.isEmpty()) {
                        Text("No budgets active", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    } else {
                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            state.budgets.take(3).forEach { budget ->
                                BudgetProgress(budget, state)
                            }
                            Spacer(Modifier.height(4.dp))
                            FilledTonalButton(
                                onClick = { onNavigate("budgets") },
                                shape = CircleShape,
                                modifier = Modifier.fillMaxWidth().height(44.dp)
                            ) {
                                Text("Manage Budgets", fontWeight = FontWeight.Bold)
                                Spacer(Modifier.width(6.dp))
                                Icon(Icons.AutoMirrored.Filled.ArrowForward, null, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }
            }
        }
    }

    // Quick Add Modal Trigger
    quickAddType?.let { presetType ->
        TransactionEditor(
            existing = Transaction(description = "", amount = 0.0, category = "", type = presetType),
            categories = state.categories,
            onDismiss = { quickAddType = null },
            onSave = { transaction ->
                viewModel.save(transaction)
                quickAddType = null
            }
        )
    }

    if (showSmsSheet) {
        SmsInboxSheet(
            pendingTransactions = pendingSms,
            categories = state.categories,
            settings = state.settings,
            onApprove = { item, cat -> viewModel.approveSms(item, cat) },
            onDiscard = { item -> viewModel.discardSms(item) },
            onApproveAll = {
                viewModel.approveAllSms()
                showSmsSheet = false
            },
            onDiscardAll = {
                viewModel.discardAllSms()
                showSmsSheet = false
            },
            onDismiss = { showSmsSheet = false }
        )
    }
}

// =========================================================================
// Transactions Screen
// =========================================================================

@Composable
fun TransactionsScreen(state: AppState, viewModel: AppViewModel, onSettings: () -> Unit) {
    val today = LocalDate.now()
    val pendingSms by viewModel.pendingSmsTransactions.collectAsStateWithLifecycle()
    var showSmsSheet by remember { mutableStateOf(false) }
    var editing by remember { mutableStateOf<Transaction?>(null) }
    var editorOpen by remember { mutableStateOf(false) }
    var splitMenuOpen by remember { mutableStateOf(false) }
    var query by remember { mutableStateOf("") }
    var type by remember { mutableStateOf<String?>(null) }
    var category by remember { mutableStateOf<String?>(null) }
    var categoryOpen by remember { mutableStateOf(false) }
    var datePreset by remember { mutableStateOf("All") }
    var dateFrom by remember { mutableStateOf(today.minusMonths(1).toString()) }
    var dateTo by remember { mutableStateOf(today.toString()) }
    var sort by remember { mutableStateOf("Newest") }
    var sortOpen by remember { mutableStateOf(false) }
    var chart by remember { mutableStateOf(false) }
    var page by remember { mutableIntStateOf(0) }
    var selected by remember { mutableStateOf(setOf<String>()) }
    var confirmDelete by remember { mutableStateOf<String?>(null) }
    var exportIds by remember { mutableStateOf<Set<String>?>(null) }
    val csvLauncher = rememberLauncherForActivityResult(ActivityResultContracts.CreateDocument("text/csv")) {
        it?.let { uri -> viewModel.exportCsv(uri, "transactions", exportIds) }
    }

    val filtered = state.transactions.filter { transaction ->
        val transactionDate = parseDate(transaction.date) ?: LocalDate.MIN
        (query.isBlank() || transaction.description.contains(query, true) || transaction.category.contains(query, true)) &&
            (type == null || transaction.type.name == type) &&
            (category == null || transaction.category == category) &&
            when (datePreset) {
                "Today" -> transactionDate == today
                "Month" -> transactionDate >= today.withDayOfMonth(1)
                "90 days" -> transactionDate >= today.minusDays(89)
                "Custom" -> transactionDate >= (parseDate(dateFrom) ?: LocalDate.MIN) &&
                    transactionDate <= (parseDate(dateTo) ?: LocalDate.MAX)
                else -> true
            }
    }.let { list ->
        when (sort) {
            "Oldest" -> list.sortedBy(Transaction::date)
            "Highest" -> list.sortedByDescending { abs(it.amount) }
            "Lowest" -> list.sortedBy { abs(it.amount) }
            "Category" -> list.sortedBy(Transaction::category)
            else -> list.sortedByDescending(Transaction::date)
        }
    }
    val totalPages = ((filtered.size + 24) / 25).coerceAtLeast(1)
    val visible = filtered.drop(page.coerceAtMost(totalPages - 1) * 25).take(25)

    Scaffold(
        topBar = { AppTopBar("Transactions", "${filtered.size} matching records", onSettings) },
        containerColor = Color.Transparent,
        floatingActionButton = {
            Box(Modifier.padding(end = 8.dp, bottom = 88.dp)) {
                EarnslateSplitButton(
                    label = "Transaction",
                    onClick = { editing = null; editorOpen = true },
                    onMenuClick = { splitMenuOpen = true }
                ) {
                    EarnslateDropdownMenu(
                        expanded = splitMenuOpen,
                        onDismissRequest = { splitMenuOpen = false },
                        onClick = {
                            exportIds = filtered.map(Transaction::id).toSet()
                            csvLauncher.launch("transactions_${today}.csv")
                        }
                    )
                }
            }
        },
    ) { padding ->
        Box(Modifier.fillMaxSize()) {
            LazyColumn(
                Modifier.fillMaxSize().padding(padding),
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 130.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                if (pendingSms.isNotEmpty()) {
                    item {
                        Card(
                            shape = RoundedCornerShape(18.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.7f)
                            ),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.35f)),
                            onClick = { showSmsSheet = true },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                                    modifier = Modifier.weight(1f, fill = false)
                                ) {
                                    Icon(
                                        Icons.Default.AutoAwesome,
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Text(
                                        text = "${pendingSms.size} SMS transaction${if (pendingSms.size > 1) "s" else ""} to review",
                                        style = MaterialTheme.typography.titleSmall,
                                        fontWeight = FontWeight.Bold,
                                        maxLines = 1,
                                        softWrap = false,
                                        overflow = TextOverflow.Ellipsis,
                                        color = MaterialTheme.colorScheme.onPrimaryContainer
                                    )
                                }
                                Spacer(Modifier.width(8.dp))
                                TextButton(onClick = { showSmsSheet = true }) {
                                    Text("Review", maxLines = 1, softWrap = false, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
                item { SearchField(query, { query = it; page = 0 }) }
                item {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        // Type Segmented Control
                        SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                            val options = listOf("All", "Expense", "Income")
                            options.forEachIndexed { index, option ->
                                val value = option.lowercase()
                                SegmentedButton(
                                    selected = if (option == "All") type == null else type == value,
                                    onClick = { type = value.takeUnless { it == "all" }; page = 0 },
                                    shape = SegmentedButtonDefaults.itemShape(index = index, count = options.size),
                                    label = { Text(option, maxLines = 1, softWrap = false, fontWeight = FontWeight.Bold) }
                                )
                            }
                        }

                        // Timeframe Segmented Control
                        SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
                            val options = listOf("All", "Today", "Month", "90d", "Custom")
                            options.forEachIndexed { index, option ->
                                val value = if (option == "90d") "90 days" else option
                                SegmentedButton(
                                    selected = datePreset == value,
                                    onClick = { datePreset = value; page = 0 },
                                    shape = SegmentedButtonDefaults.itemShape(index = index, count = options.size),
                                    label = { Text(option, maxLines = 1, softWrap = false, fontWeight = FontWeight.SemiBold) }
                                )
                            }
                        }

                        if (datePreset == "Custom") {
                            DateField("From", dateFrom) { dateFrom = it; page = 0 }
                            DateField("To", dateTo) { dateTo = it; page = 0 }
                        }

                        // Filter Chips Row
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Box {
                                FilterChip(
                                    selected = category != null,
                                    onClick = { categoryOpen = true },
                                    label = { Text(category ?: "All Categories", fontWeight = FontWeight.SemiBold) },
                                    leadingIcon = { Icon(Icons.Default.Category, null, modifier = Modifier.size(16.dp)) },
                                    shape = CircleShape
                                )
                                DropdownMenu(categoryOpen, { categoryOpen = false }) {
                                    DropdownMenuItem(
                                        text = { Text("All Categories") },
                                        onClick = { category = null; categoryOpen = false; page = 0 }
                                    )
                                    state.categories.forEach { item ->
                                        DropdownMenuItem(
                                            text = { Text(item.name) },
                                            onClick = { category = item.name; categoryOpen = false; page = 0 }
                                        )
                                    }
                                }
                            }

                            Box {
                                FilterChip(
                                    selected = sort != "Newest",
                                    onClick = { sortOpen = true },
                                    label = { Text(sort, fontWeight = FontWeight.SemiBold) },
                                    leadingIcon = { Icon(Icons.Default.Sort, null, modifier = Modifier.size(16.dp)) },
                                    shape = CircleShape
                                )
                                DropdownMenu(sortOpen, { sortOpen = false }) {
                                    listOf("Newest", "Oldest", "Highest", "Lowest", "Category").forEach {
                                        DropdownMenuItem(
                                            text = { Text(it) },
                                            onClick = { sort = it; sortOpen = false }
                                        )
                                    }
                                }
                            }

                            Spacer(Modifier.weight(1f))

                            IconButton(
                                onClick = { chart = !chart },
                                modifier = Modifier.size(38.dp)
                            ) {
                                Icon(if (chart) Icons.Default.List else Icons.Default.PieChart, "Change view", tint = MaterialTheme.colorScheme.primary)
                            }
                            IconButton(
                                onClick = {
                                    exportIds = filtered.map(Transaction::id).toSet()
                                    csvLauncher.launch("transactions_${today}.csv")
                                },
                                modifier = Modifier.size(38.dp)
                            ) {
                                Icon(Icons.Default.Download, "Export filtered CSV")
                            }
                        }
                    }
                }

                if (chart) {
                    item {
                        val values = filtered.filter { it.type == TransactionType.expense }
                            .groupBy(Transaction::category).mapValues { (_, items) -> items.sumOf { abs(it.amount) } }.toList()
                        SectionCard("Expense Breakdown") {
                            DonutChart(values, Modifier.fillMaxWidth().height(260.dp))
                        }
                    }
                } else if (visible.isEmpty()) {
                    item { EmptyState("No matching transactions", "Add transaction") { editing = null; editorOpen = true } }
                } else {
                    items(visible, key = Transaction::id) { transaction ->
                        val isSelected = transaction.id in selected
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .animateItem(),
                            shape = RoundedCornerShape(22.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.45f)
                                else MaterialTheme.colorScheme.surfaceContainerLow.copy(alpha = 0.85f)
                            ),
                            border = BorderStroke(
                                1.dp,
                                if (isSelected) MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
                                else MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.2f)
                            )
                        ) {
                            Row(
                                Modifier.fillMaxWidth().padding(14.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Checkbox(
                                    checked = isSelected,
                                    onCheckedChange = {
                                        selected = if (isSelected) selected - transaction.id else selected + transaction.id
                                    },
                                    colors = CheckboxDefaults.colors(checkedColor = MaterialTheme.colorScheme.primary)
                                )
                                Spacer(Modifier.width(8.dp))
                                Column(Modifier.weight(1f)) {
                                    Text(
                                        transaction.description,
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Spacer(Modifier.height(2.dp))
                                    Text(
                                        "${transaction.category} · ${displayDate(transaction.date, state.settings)}",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    transaction.notes?.let {
                                        Text(it, maxLines = 1, overflow = TextOverflow.Ellipsis, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f))
                                    }
                                }
                                Column(horizontalAlignment = Alignment.End) {
                                    val isIncome = transaction.type == TransactionType.income
                                    Surface(
                                        shape = RoundedCornerShape(12.dp),
                                        color = if (isIncome) Color(0xFF10B981).copy(alpha = 0.15f) else MaterialTheme.colorScheme.error.copy(alpha = 0.12f)
                                    ) {
                                        Text(
                                            text = (if (isIncome) "+" else "-") + currency(transaction.amount, state.settings),
                                            style = MaterialTheme.typography.titleSmall,
                                            fontWeight = FontWeight.ExtraBold,
                                            color = if (isIncome) Color(0xFF10B981) else MaterialTheme.colorScheme.error,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                        )
                                    }
                                    ItemActions(
                                        onEdit = { editing = transaction; editorOpen = true },
                                        onDelete = { confirmDelete = transaction.id },
                                    )
                                }
                            }
                        }
                    }
                    item {
                        Row(
                            Modifier.fillMaxWidth().padding(top = 8.dp),
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            TextButton(enabled = page > 0, onClick = { page-- }) { Text("Previous") }
                            Text("${page + 1} / $totalPages", fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 12.dp))
                            TextButton(enabled = page + 1 < totalPages, onClick = { page++ }) { Text("Next") }
                        }
                    }
                }
            }

            // Floating Multi-Select Batch Action Bar
            AnimatedVisibility(
                visible = selected.isNotEmpty(),
                enter = slideInVertically(spring(dampingRatio = Spring.DampingRatioMediumBouncy)) { it } + fadeIn(),
                exit = slideOutVertically { it } + fadeOut(),
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 90.dp)
            ) {
                Surface(
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.surfaceContainerHighest,
                    shadowElevation = 10.dp,
                    tonalElevation = 8.dp,
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f)),
                    modifier = Modifier.padding(horizontal = 24.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 18.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Text("${selected.size} selected", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                        Button(
                            onClick = { confirmDelete = "selected" },
                            shape = CircleShape,
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                        ) {
                            Icon(Icons.Default.DeleteSweep, null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(6.dp))
                            Text("Delete")
                        }
                    }
                }
            }
        }
    }

    if (editorOpen) TransactionEditor(editing, state.categories, { editorOpen = false }, viewModel::save)

    confirmDelete?.let { target ->
        AlertDialog(
            onDismissRequest = { confirmDelete = null },
            title = { Text("Delete transaction?") },
            text = { Text(if (target == "selected") "Delete ${selected.size} selected transactions? This cannot be undone." else "This will permanently remove the transaction.") },
            confirmButton = {
                TextButton(onClick = {
                    if (target == "selected") { viewModel.deleteTransactions(selected); selected = emptySet() }
                    else viewModel.deleteTransaction(target)
                    confirmDelete = null
                }) { Text("Delete", color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.Bold) }
            },
            dismissButton = { TextButton(onClick = { confirmDelete = null }) { Text("Cancel") } },
        )
    }

    if (showSmsSheet) {
        SmsInboxSheet(
            pendingTransactions = pendingSms,
            categories = state.categories,
            settings = state.settings,
            onApprove = { item, cat -> viewModel.approveSms(item, cat) },
            onDiscard = { item -> viewModel.discardSms(item) },
            onApproveAll = {
                viewModel.approveAllSms()
                showSmsSheet = false
            },
            onDiscardAll = {
                viewModel.discardAllSms()
                showSmsSheet = false
            },
            onDismiss = { showSmsSheet = false }
        )
    }
}

// =========================================================================
// Budgets Screen
// =========================================================================

@Composable
fun BudgetsScreen(state: AppState, viewModel: AppViewModel, onSettings: () -> Unit) {
    var editing by remember { mutableStateOf<Budget?>(null) }
    var editorOpen by remember { mutableStateOf(false) }
    var splitMenuOpen by remember { mutableStateOf(false) }
    var chart by remember { mutableStateOf(false) }
    var confirmDelete by remember { mutableStateOf<Budget?>(null) }
    val csvLauncher = rememberLauncherForActivityResult(ActivityResultContracts.CreateDocument("text/csv")) {
        it?.let { viewModel.exportCsv(it, "budgets") }
    }

    val totalLimit = state.budgets.sumOf { it.limit }
    val totalSpent = state.budgets.sumOf { it.spent }

    Scaffold(
        topBar = { AppTopBar("Budgets", "${state.budgets.size} active budgets", onSettings) },
        containerColor = Color.Transparent,
        floatingActionButton = {
            Box(Modifier.padding(end = 8.dp, bottom = 88.dp)) {
                EarnslateSplitButton(
                    label = "Budget",
                    onClick = { editing = null; editorOpen = true },
                    onMenuClick = { splitMenuOpen = true }
                ) {
                    EarnslateDropdownMenu(
                        expanded = splitMenuOpen,
                        onDismissRequest = { splitMenuOpen = false },
                        onClick = { csvLauncher.launch("budgets_${LocalDate.now()}.csv") }
                    )
                }
            }
        },
    ) { padding ->
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 120.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            item {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    StatCard("Total Budget Limit", currency(totalLimit, state.settings), Icons.Default.AccountBalanceWallet, Modifier.weight(1f))
                    StatCard("Total Spent", currency(totalSpent, state.settings), Icons.Default.Payments, Modifier.weight(1f), tint = MaterialTheme.colorScheme.tertiary)
                }
            }
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    IconButton(onClick = { chart = !chart }) { Icon(if (chart) Icons.Default.List else Icons.Default.PieChart, "Change view", tint = MaterialTheme.colorScheme.primary) }
                    IconButton(onClick = { csvLauncher.launch("budgets_${LocalDate.now()}.csv") }) { Icon(Icons.Default.Download, "Export CSV") }
                }
            }
            if (state.budgets.isEmpty()) {
                item { EmptyState("No budgets set up yet", "Create Budget") { editing = null; editorOpen = true } }
            } else if (chart) {
                item {
                    SectionCard("Budget Allocation") {
                        DonutChart(state.budgets.map { it.name to it.spent }, Modifier.fillMaxWidth().height(260.dp))
                    }
                }
            } else {
                items(state.budgets, key = Budget::id) { budget ->
                    Card(
                        modifier = Modifier.fillMaxWidth().animateItem(),
                        shape = RoundedCornerShape(26.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerLow.copy(alpha = 0.85f)),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.25f))
                    ) {
                        Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Column(Modifier.weight(1f)) {
                                    Text(budget.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                                    Text("${budget.category} · Every ${budget.period.count} ${budget.period.unit}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                                ItemActions({ editing = budget; editorOpen = true }, { confirmDelete = budget })
                            }
                            BudgetProgress(budget, state)
                        }
                    }
                }
            }
        }
    }

    if (editorOpen) BudgetEditor(editing, state.categories, { editorOpen = false }, viewModel::save)

    confirmDelete?.let { budget ->
        AlertDialog(
            onDismissRequest = { confirmDelete = null },
            title = { Text("Delete ${budget.name}?") },
            text = { Text("Are you sure you want to remove this budget tracking plan?") },
            confirmButton = { TextButton(onClick = { viewModel.deleteBudget(budget.id); confirmDelete = null }) { Text("Delete", color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.Bold) } },
            dismissButton = { TextButton(onClick = { confirmDelete = null }) { Text("Cancel") } },
        )
    }
}

// =========================================================================
// Subscriptions Screen
// =========================================================================

@Composable
fun SubscriptionsScreen(state: AppState, viewModel: AppViewModel, onSettings: () -> Unit) {
    var editing by remember { mutableStateOf<Subscription?>(null) }
    var editorOpen by remember { mutableStateOf(false) }
    var splitMenuOpen by remember { mutableStateOf(false) }
    var treemap by remember { mutableStateOf(false) }
    var query by remember { mutableStateOf("") }
    var typeFilter by remember { mutableStateOf<TransactionType?>(null) }
    var confirmDelete by remember { mutableStateOf<Subscription?>(null) }
    var quickPayoutTransaction by remember { mutableStateOf<Transaction?>(null) }

    val csvLauncher = rememberLauncherForActivityResult(ActivityResultContracts.CreateDocument("text/csv")) {
        it?.let { viewModel.exportCsv(it, "subscriptions") }
    }

    val activeIncomes = state.subscriptions.filter { it.active && it.type == TransactionType.income }
    val activeExpenses = state.subscriptions.filter { it.active && it.type == TransactionType.expense }
    val monthlyIncome = activeIncomes.sumOf { monthlyEquivalent(it.amount, it.cycle) }
    val monthlyExpense = activeExpenses.sumOf { monthlyEquivalent(it.amount, it.cycle) }
    val netMonthlyFlow = monthlyIncome - monthlyExpense

    val filtered = state.subscriptions.filter {
        (query.isBlank() || it.name.contains(query, true) || it.notes?.contains(query, true) == true) &&
        (typeFilter == null || it.type == typeFilter)
    }

    Scaffold(
        topBar = { AppTopBar("Recurring", "Subscriptions & Incomes", onSettings) },
        containerColor = Color.Transparent,
        floatingActionButton = {
            Box(Modifier.padding(end = 8.dp, bottom = 88.dp)) {
                EarnslateSplitButton(
                    label = "Commitment",
                    onClick = { editing = null; editorOpen = true },
                    onMenuClick = { splitMenuOpen = true }
                ) {
                    EarnslateDropdownMenu(
                        expanded = splitMenuOpen,
                        onDismissRequest = { splitMenuOpen = false },
                        onClick = { csvLauncher.launch("recurring_${LocalDate.now()}.csv") }
                    )
                }
            }
        },
    ) { padding ->
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 120.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            // Metrics Header
            item {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        StatCard("Monthly Inflow", "+" + currency(monthlyIncome, state.settings), Icons.Default.TrendingUp, Modifier.weight(1f), tint = Color(0xFF10B981))
                        StatCard("Monthly Outflow", "-" + currency(monthlyExpense, state.settings), Icons.Default.TrendingDown, Modifier.weight(1f), tint = MaterialTheme.colorScheme.error)
                    }
                    StatCard(
                        "Net Recurring Flow",
                        (if (netMonthlyFlow >= 0) "+" else "") + currency(netMonthlyFlow, state.settings),
                        Icons.Default.Payments,
                        Modifier.fillMaxWidth(),
                        tint = if (netMonthlyFlow >= 0) Color(0xFF10B981) else MaterialTheme.colorScheme.error
                    )
                }
            }

            // Filter Tabs (All / Expenses / Incomes)
            item {
                SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
                    val tabs = listOf(null to "All", TransactionType.expense to "Expenses", TransactionType.income to "Incomes")
                    tabs.forEachIndexed { index, (t, label) ->
                        SegmentedButton(
                            selected = typeFilter == t,
                            onClick = { typeFilter = t },
                            shape = SegmentedButtonDefaults.itemShape(index = index, count = tabs.size),
                            label = { Text(label, fontWeight = FontWeight.Bold) }
                        )
                    }
                }
            }

            item { SearchField(query, { query = it }, placeholder = "Search recurring items...") }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    IconButton(onClick = { treemap = !treemap }) { Icon(if (treemap) Icons.Default.List else Icons.Default.GridView, "Change view", tint = MaterialTheme.colorScheme.primary) }
                    IconButton(onClick = { csvLauncher.launch("recurring_${LocalDate.now()}.csv") }) { Icon(Icons.Default.Download, "Export CSV") }
                }
            }

            if (filtered.isEmpty()) {
                item { EmptyState("No recurring commitments found", "Add Commitment") { editing = null; editorOpen = true } }
            } else if (treemap) {
                item { SectionCard("Monthly Cost Treemap") { SubscriptionTreemap(filtered, Modifier.fillMaxWidth()) } }
            } else {
                items(filtered, key = Subscription::id) { subscription ->
                    val isIncome = subscription.type == TransactionType.income
                    Card(
                        modifier = Modifier.fillMaxWidth().animateItem(),
                        shape = RoundedCornerShape(24.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (subscription.active) {
                                if (isIncome) Color(0xFF10B981).copy(alpha = 0.08f)
                                else MaterialTheme.colorScheme.surfaceContainerLow.copy(alpha = 0.85f)
                            } else MaterialTheme.colorScheme.surfaceContainerLow.copy(alpha = 0.4f)
                        ),
                        border = BorderStroke(
                            1.dp,
                            if (isIncome) Color(0xFF10B981).copy(alpha = 0.3f)
                            else MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.2f)
                        )
                    ) {
                        Row(Modifier.fillMaxWidth().padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                            ServiceIcon(subscription.name, subscription.color, subscription.customIconPath, Modifier.size(48.dp), subscription.icon)
                            Spacer(Modifier.width(14.dp))
                            Column(Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    Text(subscription.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                                    if (subscription.isVariable) {
                                        Surface(
                                            shape = CircleShape,
                                            color = MaterialTheme.colorScheme.tertiaryContainer.copy(alpha = 0.6f),
                                            modifier = Modifier.height(20.dp)
                                        ) {
                                            Text(
                                                "Variable",
                                                style = MaterialTheme.typography.labelSmall,
                                                fontWeight = FontWeight.Bold,
                                                color = MaterialTheme.colorScheme.onTertiaryContainer,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }
                                    }
                                }
                                val time = if (subscription.cycle.unit == dev.qtremors.earnslate.data.TimeUnit.hour && subscription.nextBilling.length >= 16)
                                    " ${subscription.nextBilling.substring(11, 16)}" else ""
                                Text(
                                    "${subscription.cycle.count} ${subscription.cycle.unit} · ${if (isIncome) "Payout" else "Next"}: ${displayDate(subscription.nextBilling, state.settings)}$time",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                subscription.notes?.let {
                                    Text(it, maxLines = 1, overflow = TextOverflow.Ellipsis, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f))
                                }
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    (if (isIncome) "+" else "-") + currency(subscription.amount, state.settings),
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = if (isIncome) Color(0xFF10B981) else MaterialTheme.colorScheme.onSurface
                                )
                                ItemActions(
                                    onEdit = { editing = subscription; editorOpen = true },
                                    onDelete = { confirmDelete = subscription },
                                    active = subscription.active,
                                    onToggle = { viewModel.save(subscription.copy(active = !subscription.active)) },
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    if (editorOpen) SubscriptionEditor(
        editing,
        { editorOpen = false },
        viewModel::save,
        viewModel::importSubscriptionIcon,
        viewModel::discardIcon,
    )

    confirmDelete?.let { subscription ->
        AlertDialog(
            onDismissRequest = { confirmDelete = null },
            title = { Text("Delete ${subscription.name}?") },
            text = { Text("This will remove this recurring ${if (subscription.type == TransactionType.income) "income stream" else "subscription"} from your commitments.") },
            confirmButton = { TextButton(onClick = { viewModel.deleteSubscription(subscription.id); confirmDelete = null }) { Text("Delete", color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.Bold) } },
            dismissButton = { TextButton(onClick = { confirmDelete = null }) { Text("Cancel") } },
        )
    }
}

// =========================================================================
// Helpers & Sub-Views
// =========================================================================

@Composable
private fun SectionCard(title: String, content: @Composable ColumnScope.() -> Unit) {
    Card(
        Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(28.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerLow.copy(alpha = 0.75f)),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.2f))
    ) {
        Column(Modifier.fillMaxWidth().padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.ExtraBold)
            content()
        }
    }
}

@Composable
private fun TransactionSummary(transaction: Transaction, state: AppState) {
    val isIncome = transaction.type == TransactionType.income
    Row(
        Modifier.fillMaxWidth().padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(
                    if (isIncome) Color(0xFF10B981).copy(alpha = 0.15f)
                    else MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f)
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                if (isIncome) Icons.Default.TrendingUp else Icons.Default.TrendingDown,
                contentDescription = null,
                tint = if (isIncome) Color(0xFF10B981) else MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(18.dp)
            )
        }
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(transaction.description, fontWeight = FontWeight.SemiBold, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Text("${transaction.category} · ${displayDate(transaction.date, state.settings)}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Text(
            (if (isIncome) "+" else "-") + currency(transaction.amount, state.settings),
            fontWeight = FontWeight.Bold,
            color = if (isIncome) Color(0xFF10B981) else MaterialTheme.colorScheme.onSurface
        )
    }
}

@Composable
private fun BudgetProgress(budget: Budget, state: AppState) {
    val progress = if (budget.limit > 0) (budget.spent / budget.limit).toFloat() else 0f
    val remaining = max(0.0, budget.limit - budget.spent)
    val primary = MaterialTheme.colorScheme.primary

    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        LinearProgressIndicator(
            progress = { progress.coerceIn(0f, 1f) },
            modifier = Modifier.fillMaxWidth().height(8.dp).clip(CircleShape),
            color = when {
                progress >= 1.0f -> MaterialTheme.colorScheme.error
                progress >= .8f -> Color(0xFFF59E0B).harmonize(primary)
                else -> Color(0xFF10B981).harmonize(primary)
            },
            trackColor = MaterialTheme.colorScheme.surfaceContainerHighest
        )
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("${currency(budget.spent, state.settings)} spent · ${currency(remaining, state.settings)} left", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text("${(progress * 100).toInt()}% of ${currency(budget.limit, state.settings)}", style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold)
        }
    }
}

