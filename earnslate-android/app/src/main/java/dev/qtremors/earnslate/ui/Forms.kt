@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)

package dev.qtremors.earnslate.ui

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.BottomSheetDefaults
import androidx.compose.material3.Button
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import dev.qtremors.earnslate.data.BillingCycle
import dev.qtremors.earnslate.data.Budget
import dev.qtremors.earnslate.data.Category
import dev.qtremors.earnslate.data.ServiceTemplates
import dev.qtremors.earnslate.data.Subscription
import dev.qtremors.earnslate.data.Transaction
import dev.qtremors.earnslate.data.TransactionType
import java.time.LocalDate
import java.time.LocalTime
import kotlin.math.abs

private val palette = listOf(
    "#E50914", "#1DB954", "#FF9900", "#3693F3", "#6366F1", "#8B5CF6",
    "#EC4899", "#10B981", "#F59E0B", "#EF4444", "#64748B", "#0EA5E9",
)

@Composable
fun TransactionEditor(
    existing: Transaction?,
    categories: List<Category>,
    onDismiss: () -> Unit,
    onSave: (Transaction) -> Unit,
) {
    var description by remember(existing) { mutableStateOf(existing?.description.orEmpty()) }
    var amount by remember(existing) { mutableStateOf(existing?.amount?.let { abs(it).toString() }.orEmpty()) }
    var type by remember(existing) { mutableStateOf(existing?.type ?: TransactionType.expense) }
    var category by remember(existing, categories) {
        mutableStateOf(existing?.category ?: categories.firstOrNull { it.type != "income" }?.name.orEmpty())
    }
    var date by remember(existing) { mutableStateOf(existing?.date ?: LocalDate.now().toString()) }
    var notes by remember(existing) { mutableStateOf(existing?.notes.orEmpty()) }
    val valid = description.isNotBlank() && (amount.toDoubleOrNull() ?: 0.0) > 0 && category.isNotBlank()

    EditorSheet(if (existing == null) "Add Transaction" else "Edit Transaction", onDismiss) {
        OutlinedTextField(
            value = description,
            onValueChange = { description = it.take(500) },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Description") },
            singleLine = true,
            shape = RoundedCornerShape(16.dp)
        )
        AmountField(amount, { amount = it })
        ChoiceRow(listOf("Expense", "Income"), if (type == TransactionType.expense) "Expense" else "Income") {
            type = if (it == "Expense") TransactionType.expense else TransactionType.income
        }
        CategorySelector(
            categories.filter { it.type == "both" || it.type == type.name },
            category,
            onSelected = { category = it.name },
        )
        DateField("Date", date) { date = it }
        OutlinedTextField(
            value = notes,
            onValueChange = { notes = it.take(2_000) },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Notes (optional)") },
            minLines = 2,
            shape = RoundedCornerShape(16.dp),
        )
        Button(
            onClick = {
                onSave(
                    (existing ?: Transaction(description = "", amount = 0.0, category = "", type = type)).copy(
                        description = description.trim(),
                        amount = amount.toDouble(),
                        category = category,
                        date = date,
                        type = type,
                        notes = notes.trim().ifBlank { null },
                    )
                )
                onDismiss()
            },
            enabled = valid,
            shape = CircleShape,
            modifier = Modifier.fillMaxWidth().height(50.dp),
        ) {
            Text("Save Transaction", fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun BudgetEditor(
    existing: Budget?,
    categories: List<Category>,
    onDismiss: () -> Unit,
    onSave: (Budget) -> Unit,
) {
    var name by remember(existing) { mutableStateOf(existing?.name.orEmpty()) }
    var limit by remember(existing) { mutableStateOf(existing?.limit?.toString().orEmpty()) }
    var category by remember(existing, categories) {
        mutableStateOf(existing?.category ?: categories.firstOrNull { it.type != "income" }?.name.orEmpty())
    }
    var cycle by remember(existing) { mutableStateOf(existing?.period ?: BillingCycle()) }
    var color by remember(existing) { mutableStateOf(existing?.color ?: "#6366F1") }
    var icon by remember(existing) { mutableStateOf(existing?.icon ?: "Wallet") }
    val valid = name.isNotBlank() && (limit.toDoubleOrNull() ?: 0.0) > 0 && category.isNotBlank()

    EditorSheet(if (existing == null) "Add Budget" else "Edit Budget", onDismiss) {
        OutlinedTextField(
            value = name,
            onValueChange = { name = it.take(500) },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Budget Name") },
            singleLine = true,
            shape = RoundedCornerShape(16.dp)
        )
        AmountField(limit, { limit = it }, "Limit Amount")
        CategorySelector(categories.filter { it.type != "income" }, category) { category = it.name }
        Text("Renewal Period", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
        CycleSelector(cycle) { cycle = it }
        IconSelector(icon) { icon = it }
        ColorSelector(color) { color = it }
        Button(
            onClick = {
                onSave(
                    (existing ?: Budget(name = "", limit = 0.0, category = "")).copy(
                        name = name.trim(),
                        limit = limit.toDouble(),
                        category = category,
                        period = cycle,
                        color = color,
                        icon = icon,
                    )
                )
                onDismiss()
            },
            enabled = valid,
            shape = CircleShape,
            modifier = Modifier.fillMaxWidth().height(50.dp),
        ) {
            Text("Save Budget", fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun SubscriptionEditor(
    existing: Subscription?,
    onDismiss: () -> Unit,
    onSave: (Subscription) -> Unit,
    importIcon: (android.net.Uri, (String) -> Unit) -> Unit,
    discardIcon: (String?) -> Unit,
) {
    var type by remember(existing) { mutableStateOf(existing?.type ?: TransactionType.expense) }
    var isVariable by remember(existing) { mutableStateOf(existing?.isVariable ?: false) }
    var name by remember(existing) { mutableStateOf(existing?.name.orEmpty()) }
    var amount by remember(existing) { mutableStateOf(existing?.amount?.toString().orEmpty()) }
    var cycle by remember(existing) { mutableStateOf(existing?.cycle ?: BillingCycle()) }
    var nextBilling by remember(existing) { mutableStateOf(existing?.nextBilling?.take(10) ?: LocalDate.now().toString()) }
    var icon by remember(existing) { mutableStateOf(existing?.icon ?: (if (existing?.type == TransactionType.income) "Work" else "CreditCard")) }
    var color by remember(existing) { mutableStateOf(existing?.color ?: (if (existing?.type == TransactionType.income) "#10B981" else "#6366F1")) }
    var active by remember(existing) { mutableStateOf(existing?.active ?: true) }
    var notes by remember(existing) { mutableStateOf(existing?.notes.orEmpty()) }
    var customIcon by remember(existing) { mutableStateOf(existing?.customIconPath) }
    var saved by remember(existing) { mutableStateOf(false) }
    val close = {
        if (!saved && customIcon != existing?.customIconPath) discardIcon(customIcon)
        onDismiss()
    }
    var templateSearch by remember { mutableStateOf("") }
    var showTemplates by remember { mutableStateOf(existing == null) }
    val iconLauncher = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        uri?.let {
            importIcon(it) { path ->
                if (customIcon != existing?.customIconPath) discardIcon(customIcon)
                customIcon = path
                icon = "Image"
            }
        }
    }
    val valid = name.isNotBlank() && (amount.toDoubleOrNull() ?: 0.0) > 0 && cycle.count > 0

    val sheetTitle = when {
        existing == null && type == TransactionType.income -> "Add Recurring Income"
        existing == null -> "Add Subscription / Bill"
        type == TransactionType.income -> "Edit Recurring Income"
        else -> "Edit Subscription"
    }

    EditorSheet(sheetTitle, close) {
        // Type Selector: Expense vs Income
        SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
            val options = listOf(TransactionType.expense to "Expense", TransactionType.income to "Income (Salary)")
            options.forEachIndexed { index, (optType, label) ->
                SegmentedButton(
                    selected = type == optType,
                    onClick = {
                        type = optType
                        if (existing == null) {
                            if (optType == TransactionType.income) {
                                color = "#10B981"
                                icon = "Work"
                            } else {
                                color = "#6366F1"
                                icon = "CreditCard"
                            }
                        }
                    },
                    shape = SegmentedButtonDefaults.itemShape(index = index, count = options.size),
                    label = { Text(label, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis) }
                )
            }
        }

        FilledTonalButton(
            onClick = { showTemplates = !showTemplates },
            shape = CircleShape,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                if (showTemplates) "Hide Templates"
                else if (type == TransactionType.income) "Choose from Income Templates (Salary, Retainer...)"
                else "Choose from 100+ Popular Services",
                fontWeight = FontWeight.SemiBold
            )
        }
        if (showTemplates) {
            OutlinedTextField(
                value = templateSearch,
                onValueChange = { templateSearch = it },
                modifier = Modifier.fillMaxWidth(),
                label = { Text(if (type == TransactionType.income) "Search income (Salary, Retainer...)" else "Search services (Netflix, Spotify...)") },
                leadingIcon = { Icon(Icons.Default.Search, null) },
                shape = RoundedCornerShape(16.dp),
            )
            val filteredTemplates = ServiceTemplates.filter {
                if (type == TransactionType.income) it.category.equals("Income", ignoreCase = true)
                else !it.category.equals("Income", ignoreCase = true)
            }
            val matches = filteredTemplates.filter {
                templateSearch.isBlank() || it.name.contains(templateSearch, true) || it.category.contains(templateSearch, true)
            }.take(12)
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                matches.forEach { template ->
                    Surface(
                        onClick = {
                            name = template.name
                            icon = template.icon
                            color = template.color
                            customIcon = null
                            showTemplates = false
                        },
                        shape = RoundedCornerShape(14.dp),
                        color = Color.Transparent,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            Modifier.fillMaxWidth().padding(horizontal = 8.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            ServiceIcon(template.name, template.color, null, Modifier.size(36.dp), template.icon)
                            Spacer(Modifier.width(12.dp))
                            Column {
                                Text(template.name, fontWeight = FontWeight.Bold)
                                Text(template.category, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    }
                }
            }
        }

        OutlinedTextField(
            value = name,
            onValueChange = { name = it.take(500) },
            modifier = Modifier.fillMaxWidth(),
            label = { Text(if (type == TransactionType.income) "Income Source (e.g. Salary, Rent)" else "Service Name") },
            singleLine = true,
            shape = RoundedCornerShape(16.dp)
        )
        AmountField(amount, { amount = it })
        CycleSelector(cycle) { cycle = it }
        DateField(if (type == TransactionType.income) "Start / Estimated Payout Date" else "Start / Billing Date", nextBilling) { nextBilling = it }

        // Variable Date & Amount Toggle (for Salary / Freelance / Fluctuation)
        Surface(
            shape = RoundedCornerShape(18.dp),
            color = MaterialTheme.colorScheme.surfaceContainerLow.copy(alpha = 0.7f),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.25f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                Modifier.fillMaxWidth().padding(14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(Modifier.weight(1f)) {
                    Text(
                        if (type == TransactionType.income) "Variable Amount & Date" else "Variable / Usage-based Bill",
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.bodyMedium
                    )
                    Text(
                        if (type == TransactionType.income) "Payout date or amount may fluctuate monthly (e.g. salary, overtime, deductions)"
                        else "Bill amount fluctuates with usage",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Spacer(Modifier.width(12.dp))
                Switch(
                    checked = isVariable,
                    onCheckedChange = { isVariable = it },
                    colors = SwitchDefaults.colors(checkedThumbColor = Color.White)
                )
            }
        }

        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            ServiceIcon(name.ifBlank { if (type == TransactionType.income) "I" else "S" }, color, customIcon, Modifier.size(48.dp), icon)
            Spacer(Modifier.width(14.dp))
            FilledTonalButton(
                onClick = { iconLauncher.launch(arrayOf("image/svg+xml", "image/png", "image/jpeg", "image/webp")) },
                shape = CircleShape
            ) {
                Icon(Icons.Default.Image, null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(6.dp))
                Text("Custom Icon")
            }
        }
        ColorSelector(color) { color = it }
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(if (type == TransactionType.income) "Active Income Stream" else "Active Subscription", fontWeight = FontWeight.Bold)
            Switch(
                checked = active,
                onCheckedChange = { active = it },
                colors = SwitchDefaults.colors(checkedThumbColor = Color.White)
            )
        }
        OutlinedTextField(
            value = notes,
            onValueChange = { notes = it.take(2_000) },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Notes (optional)") },
            minLines = 2,
            shape = RoundedCornerShape(16.dp)
        )
        Button(
            onClick = {
                saved = true
                onSave(
                    (existing ?: Subscription(name = "", amount = 0.0)).copy(
                        name = name.trim(),
                        amount = amount.toDouble(),
                        cycle = cycle,
                        nextBilling = if (cycle.unit == dev.qtremors.earnslate.data.TimeUnit.hour) {
                            "${nextBilling.take(10)}T${LocalTime.now().withSecond(0).withNano(0)}"
                        } else nextBilling.take(10),
                        icon = icon,
                        color = color,
                        active = active,
                        notes = notes.trim().ifBlank { null },
                        customIconPath = customIcon,
                        type = type,
                        isVariable = isVariable,
                    )
                )
                onDismiss()
            },
            enabled = valid,
            shape = CircleShape,
            modifier = Modifier.fillMaxWidth().height(50.dp),
        ) {
            Text(if (type == TransactionType.income) "Save Recurring Income" else "Save Subscription", fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun EditorSheet(title: String, onDismiss: () -> Unit, content: @Composable ColumnScope.() -> Unit) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        shape = RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp),
        containerColor = MaterialTheme.colorScheme.surfaceContainerHigh,
        dragHandle = { BottomSheetDefaults.DragHandle() }
    ) {
        Column(
            Modifier
                .fillMaxWidth()
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Text(title, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.ExtraBold)
            content()
            Spacer(Modifier.height(32.dp))
        }
    }
}

@Composable
private fun CategorySelector(categories: List<Category>, selected: String, onSelected: (Category) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    ExposedDropdownMenuBox(expanded, { expanded = it }) {
        OutlinedTextField(
            value = selected,
            onValueChange = {},
            readOnly = true,
            modifier = Modifier.menuAnchor().fillMaxWidth(),
            label = { Text("Category") },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded) },
            shape = RoundedCornerShape(16.dp),
        )
        ExposedDropdownMenu(expanded, { expanded = false }) {
            categories.forEach { category ->
                androidx.compose.material3.DropdownMenuItem(
                    text = { Text(category.name, fontWeight = FontWeight.SemiBold) },
                    onClick = { onSelected(category); expanded = false },
                )
            }
        }
    }
}

@Composable
private fun ChoiceRow(values: List<String>, selected: String, onSelected: (String) -> Unit) {
    SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
        values.forEachIndexed { index, value ->
            SegmentedButton(
                selected = selected == value,
                onClick = { onSelected(value) },
                shape = SegmentedButtonDefaults.itemShape(index = index, count = values.size),
                label = { Text(value, fontWeight = FontWeight.Bold) }
            )
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ColorSelector(selected: String, onSelected: (String) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("Accent Color", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            palette.forEach { value ->
                val isSelected = selected == value
                val scale by animateFloatAsState(
                    targetValue = if (isSelected) 1.15f else 1.0f,
                    animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy),
                    label = "colorScale"
                )

                Box(
                    modifier = Modifier
                        .size(38.dp)
                        .graphicsLayer { scaleX = scale; scaleY = scale }
                        .clip(CircleShape)
                        .background(parseColor(value) ?: Color.Gray)
                        .then(
                            if (isSelected) Modifier.padding(2.dp).clip(CircleShape).background(Color.White)
                            else Modifier
                        )
                        .clickable { onSelected(value) },
                    contentAlignment = Alignment.Center,
                ) {
                    if (isSelected) {
                        Box(
                            modifier = Modifier
                                .size(20.dp)
                                .clip(CircleShape)
                                .background(parseColor(value) ?: Color.Gray),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Check, null, tint = Color.White, modifier = Modifier.size(14.dp))
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun IconSelector(selected: String, onSelected: (String) -> Unit) {
    val icons = listOf("Wallet", "CreditCard", "Restaurant", "DirectionsCar", "Movie", "ShoppingCart", "Lightbulb", "Favorite", "Work", "Home", "FitnessCenter", "Cloud", "Tag")
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("Icon Symbol", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            icons.forEach { value ->
                FilterChip(
                    selected = selected == value,
                    onClick = { onSelected(value) },
                    label = { Text(value, fontWeight = FontWeight.SemiBold) },
                    shape = CircleShape
                )
            }
        }
    }
}
