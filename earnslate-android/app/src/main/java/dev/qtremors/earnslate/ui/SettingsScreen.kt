@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)

package dev.qtremors.earnslate.ui

import android.Manifest
import android.content.pm.PackageManager
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
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ColorLens
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.FormatListNumbered
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Palette
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Sms
import androidx.compose.material.icons.filled.Storage
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material.icons.filled.Upload
import androidx.compose.material.icons.filled.Vibration
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LargeTopAppBar
import androidx.compose.material3.ListItem
import androidx.compose.material3.ListItemDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import dev.qtremors.earnslate.data.AppAccent
import dev.qtremors.earnslate.data.AppTheme
import dev.qtremors.earnslate.data.Category
import java.time.LocalDate

@Composable
fun SettingsScreen(
    state: AppState,
    viewModel: AppViewModel,
    onBack: () -> Unit,
    onAbout: () -> Unit,
) {
    val context = LocalContext.current
    var hasSmsPermissions by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.READ_SMS) == PackageManager.PERMISSION_GRANTED
        )
    }
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasSmsPermissions = granted
        if (hasSmsPermissions) {
            viewModel.updateSettings { it.copy(smsDetectionEnabled = true) }
            viewModel.scanSmsInbox(30)
        }
    }
    val isScanningSms by viewModel.isScanningSms.collectAsStateWithLifecycle()

    var editingName by remember { mutableStateOf(false) }
    var name by remember(state.settings.displayName) { mutableStateOf(state.settings.displayName) }
    var categoryEditor by remember { mutableStateOf<Category?>(null) }
    var clearConfirm by remember { mutableStateOf(false) }
    val exportLauncher = rememberLauncherForActivityResult(ActivityResultContracts.CreateDocument("application/json")) {
        it?.let(viewModel::exportBackup)
    }
    val importLauncher = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) {
        it?.let(viewModel::loadImport)
    }
    val pending by viewModel.pendingImport.collectAsStateWithLifecycle()

    val scrollBehavior = TopAppBarDefaults.exitUntilCollapsedScrollBehavior()

    Scaffold(
        modifier = Modifier.nestedScroll(scrollBehavior.nestedScrollConnection),
        containerColor = Color.Transparent,
        topBar = {
            LargeTopAppBar(
                title = { Text("Settings", fontWeight = FontWeight.ExtraBold) },
                scrollBehavior = scrollBehavior,
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back")
                    }
                },
                colors = TopAppBarDefaults.largeTopAppBarColors(
                    containerColor = Color.Transparent,
                    scrolledContainerColor = MaterialTheme.colorScheme.surfaceContainer.copy(alpha = 0.95f)
                )
            )
        }
    ) { padding ->
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 40.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            // Profile
            item {
                SettingsGroup(title = "Profile") {
                    SettingsRow(
                        title = "Display Name",
                        subtitle = state.settings.displayName,
                        icon = Icons.Default.Person,
                        onClick = { editingName = true }
                    )
                }
            }

            // Appearance & Themes
            item {
                SettingsGroup(title = "Appearance") {
                    Column(Modifier.padding(horizontal = 16.dp, vertical = 12.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Palette, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Theme Mode", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        }

                        SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                            val themes = listOf(AppTheme.system, AppTheme.light, AppTheme.dark, AppTheme.oled)
                            themes.forEachIndexed { index, appTheme ->
                                SegmentedButton(
                                    selected = state.settings.theme == appTheme,
                                    onClick = { viewModel.updateSettings { it.copy(theme = appTheme) } },
                                    shape = SegmentedButtonDefaults.itemShape(index = index, count = themes.size),
                                    label = { Text(appTheme.name.replaceFirstChar(Char::uppercase), maxLines = 1, fontWeight = FontWeight.Bold) }
                                )
                            }
                        }

                        HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f), modifier = Modifier.padding(vertical = 4.dp))

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.ColorLens, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Accent Palette", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        }

                        AccentSelectorGrid(selected = state.settings.accent) { accent ->
                            viewModel.updateSettings { it.copy(accent = accent) }
                        }

                        HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f), modifier = Modifier.padding(vertical = 4.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                Icon(Icons.Default.Vibration, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
                                Spacer(Modifier.width(8.dp))
                                Column {
                                    Text("Haptic Feedback", fontWeight = FontWeight.Bold)
                                    Text("Tactile responses on interactions", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                            Switch(
                                checked = state.settings.hapticsEnabled,
                                onCheckedChange = { enabled -> viewModel.updateSettings { it.copy(hapticsEnabled = enabled) } },
                                colors = SwitchDefaults.colors(checkedThumbColor = Color.White)
                            )
                        }
                    }
                }
            }

            // Formats
            item {
                SettingsGroup(title = "Formatting") {
                    Column(Modifier.padding(horizontal = 16.dp, vertical = 12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("Currency Unit", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
                        SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                            val currencies = listOf("INR" to "₹", "USD" to "$", "EUR" to "€", "GBP" to "£")
                            currencies.forEachIndexed { index, (curr, symbol) ->
                                SegmentedButton(
                                    selected = state.settings.currency == curr,
                                    onClick = { viewModel.updateSettings { it.copy(currency = curr, currencySymbol = symbol) } },
                                    shape = SegmentedButtonDefaults.itemShape(index = index, count = currencies.size),
                                    label = { Text("$curr ($symbol)", fontWeight = FontWeight.Bold) }
                                )
                            }
                        }

                        Spacer(Modifier.height(4.dp))
                        Text("Date Format", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
                        SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                            val dateFormats = listOf("DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD")
                            dateFormats.forEachIndexed { index, df ->
                                SegmentedButton(
                                    selected = state.settings.dateFormat == df,
                                    onClick = { viewModel.updateSettings { it.copy(dateFormat = df) } },
                                    shape = SegmentedButtonDefaults.itemShape(index = index, count = dateFormats.size),
                                    label = { Text(df, maxLines = 1, fontWeight = FontWeight.SemiBold) }
                                )
                            }
                        }

                        Spacer(Modifier.height(4.dp))
                        Text("Locale Number Format", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
                        SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                            val locales = listOf("en-IN", "en-US", "de-DE")
                            locales.forEachIndexed { index, loc ->
                                SegmentedButton(
                                    selected = state.settings.locale == loc,
                                    onClick = { viewModel.updateSettings { it.copy(locale = loc) } },
                                    shape = SegmentedButtonDefaults.itemShape(index = index, count = locales.size),
                                    label = { Text(loc, fontWeight = FontWeight.SemiBold) }
                                )
                            }
                        }
                    }
                }
            }

            // Categories
            item {
                SettingsGroup(title = "Categories") {
                    Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        state.categories.forEach { category ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(14.dp))
                                    .padding(horizontal = 8.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(32.dp)
                                        .clip(CircleShape)
                                        .background(parseColor(category.color)?.copy(alpha = 0.2f) ?: MaterialTheme.colorScheme.primaryContainer),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        Icons.Default.AccountBalanceWallet,
                                        contentDescription = null,
                                        tint = parseColor(category.color) ?: MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                                Spacer(Modifier.width(12.dp))
                                Column(Modifier.weight(1f)) {
                                    Text(category.name, fontWeight = FontWeight.Bold)
                                    Text(category.type.replaceFirstChar(Char::uppercase), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                                IconButton(onClick = { categoryEditor = category }, modifier = Modifier.size(34.dp)) {
                                    Icon(Icons.Default.Edit, "Edit", modifier = Modifier.size(18.dp))
                                }
                                IconButton(
                                    onClick = { viewModel.delete(category) },
                                    enabled = state.categories.size > 1,
                                    modifier = Modifier.size(34.dp)
                                ) {
                                    Icon(Icons.Default.Delete, "Delete", tint = MaterialTheme.colorScheme.error, modifier = Modifier.size(18.dp))
                                }
                            }
                        }
                        FilledTonalButton(
                            onClick = { categoryEditor = Category(name = "") },
                            shape = CircleShape,
                            modifier = Modifier.fillMaxWidth().height(42.dp)
                        ) {
                            Icon(Icons.Default.Add, null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(6.dp))
                            Text("Add Category", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            // SMS & Auto-Detection
            item {
                SettingsGroup(title = "SMS & Auto-Detection") {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        if (!hasSmsPermissions) {
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(
                                    containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
                                ),
                                border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(
                                    modifier = Modifier.padding(14.dp),
                                    verticalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        Icon(
                                            Icons.Default.Security,
                                            contentDescription = null,
                                            tint = MaterialTheme.colorScheme.primary,
                                            modifier = Modifier.size(20.dp)
                                        )
                                        Text(
                                            "100% Offline & Private",
                                            fontWeight = FontWeight.Bold,
                                            style = MaterialTheme.typography.titleSmall,
                                            color = MaterialTheme.colorScheme.onPrimaryContainer
                                        )
                                    }
                                    Text(
                                        "EarnSlate parses bank SMS entirely on your device without internet access or data leaving your phone. Grant permissions to enable 1-tap payment detection.",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.85f)
                                    )
                                    Button(
                                        onClick = {
                                            permissionLauncher.launch(Manifest.permission.READ_SMS)
                                        },
                                        shape = CircleShape,
                                        modifier = Modifier.fillMaxWidth().height(42.dp)
                                    ) {
                                        Icon(Icons.Default.Sms, null, Modifier.size(18.dp))
                                        Spacer(Modifier.width(8.dp))
                                        Text("Grant SMS Permission", fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        } else {
                            // Live SMS Detection Toggle
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(14.dp))
                                    .padding(horizontal = 8.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(CircleShape)
                                        .background(MaterialTheme.colorScheme.primaryContainer),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        Icons.Default.Sms,
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                                Spacer(Modifier.width(12.dp))
                                Column(Modifier.weight(1f)) {
                                    Text("SMS Transaction Detection", fontWeight = FontWeight.Bold)
                                    Text(
                                        "Auto-detects bank & payment SMS on app launch",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                                Switch(
                                    checked = state.settings.smsDetectionEnabled,
                                    onCheckedChange = { checked ->
                                        if (checked && !hasSmsPermissions) {
                                            permissionLauncher.launch(Manifest.permission.READ_SMS)
                                        } else {
                                            viewModel.updateSettings { it.copy(smsDetectionEnabled = checked) }
                                            if (checked) viewModel.scanSmsInbox(30)
                                        }
                                    },
                                    colors = SwitchDefaults.colors(
                                        checkedThumbColor = MaterialTheme.colorScheme.primary,
                                        checkedTrackColor = MaterialTheme.colorScheme.primaryContainer
                                    )
                                )
                            }

                            HorizontalDivider(
                                color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f),
                                modifier = Modifier.padding(horizontal = 8.dp)
                            )

                            // Auto-Approve High-Confidence Toggle
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(14.dp))
                                    .padding(horizontal = 8.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(CircleShape)
                                        .background(MaterialTheme.colorScheme.secondaryContainer),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        Icons.Default.AutoAwesome,
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.secondary,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                                Spacer(Modifier.width(12.dp))
                                Column(Modifier.weight(1f)) {
                                    Text("Auto-Approve Payments", fontWeight = FontWeight.Bold)
                                    Text(
                                        "Automatically log high-confidence detected transactions",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                                Switch(
                                    checked = state.settings.smsAutoApprove,
                                    onCheckedChange = { checked ->
                                        viewModel.updateSettings { it.copy(smsAutoApprove = checked) }
                                    },
                                    colors = SwitchDefaults.colors(
                                        checkedThumbColor = MaterialTheme.colorScheme.secondary,
                                        checkedTrackColor = MaterialTheme.colorScheme.secondaryContainer
                                    )
                                )
                            }

                            HorizontalDivider(
                                color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f),
                                modifier = Modifier.padding(horizontal = 8.dp)
                            )

                            // Scan Past SMS Action Button
                            FilledTonalButton(
                                onClick = {
                                    if (!hasSmsPermissions) {
                                        permissionLauncher.launch(Manifest.permission.READ_SMS)
                                    } else {
                                        viewModel.scanSmsInbox(30)
                                    }
                                },
                                enabled = !isScanningSms,
                                shape = CircleShape,
                                modifier = Modifier.fillMaxWidth().height(46.dp)
                            ) {
                                if (isScanningSms) {
                                    CircularProgressIndicator(
                                        modifier = Modifier.size(18.dp),
                                        strokeWidth = 2.5.dp,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                    Spacer(Modifier.width(10.dp))
                                    Text("Scanning SMS Inbox...", fontWeight = FontWeight.Bold)
                                } else {
                                    Icon(Icons.Default.Sync, null, modifier = Modifier.size(18.dp))
                                    Spacer(Modifier.width(8.dp))
                                    Text("Scan Past Bank SMS (Past 30 Days)", fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }

            // Data Management
            item {
                SettingsGroup(title = "Data & Backups") {
                    Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Button(
                            onClick = { exportLauncher.launch("earnslate_backup_${LocalDate.now()}.json") },
                            shape = CircleShape,
                            modifier = Modifier.fillMaxWidth().height(46.dp)
                        ) {
                            Icon(Icons.Default.Download, null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Create JSON Backup", fontWeight = FontWeight.Bold)
                        }
                        FilledTonalButton(
                            onClick = { importLauncher.launch(arrayOf("application/json", "text/json", "text/plain")) },
                            shape = CircleShape,
                            modifier = Modifier.fillMaxWidth().height(46.dp)
                        ) {
                            Icon(Icons.Default.Upload, null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Restore Backup", fontWeight = FontWeight.Bold)
                        }
                        TextButton(
                            onClick = { clearConfirm = true },
                            colors = ButtonDefaults.textButtonColors(contentColor = MaterialTheme.colorScheme.error),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.Delete, null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(6.dp))
                            Text("Clear All Local Data", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            // Information / About
            item {
                SettingsGroup(title = "About") {
                    ListItem(
                        headlineContent = { Text("About EarnSlate", fontWeight = FontWeight.Bold) },
                        supportingContent = { Text("Version, developer info, privacy, and open source") },
                        leadingContent = {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(CircleShape)
                                    .background(MaterialTheme.colorScheme.primaryContainer),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.AccountBalanceWallet, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
                            }
                        },
                        colors = ListItemDefaults.colors(containerColor = Color.Transparent),
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .clickable(onClick = onAbout)
                    )
                }
            }
        }
    }

    if (editingName) {
        AlertDialog(
            onDismissRequest = { editingName = false },
            title = { Text("Display Name") },
            text = {
                OutlinedTextField(
                    name,
                    { name = it.take(100) },
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    viewModel.updateSettings { it.copy(displayName = name.trim().ifBlank { "User" }) }
                    editingName = false
                }) { Text("Save", fontWeight = FontWeight.Bold) }
            },
            dismissButton = { TextButton(onClick = { editingName = false }) { Text("Cancel") } },
        )
    }

    categoryEditor?.let { original ->
        var categoryName by remember(original.id) { mutableStateOf(original.name) }
        var categoryType by remember(original.id) { mutableStateOf(original.type) }
        var categoryColor by remember(original.id) { mutableStateOf(original.color) }
        var categoryIcon by remember(original.id) { mutableStateOf(original.icon) }
        AlertDialog(
            onDismissRequest = { categoryEditor = null },
            title = { Text(if (original.name.isBlank()) "Add Category" else "Edit Category") },
            text = {
                Column(
                    Modifier.heightIn(max = 500.dp).verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    OutlinedTextField(categoryName, { categoryName = it.take(100) }, label = { Text("Name") }, shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth())
                    SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                        val types = listOf("expense", "income", "both")
                        types.forEachIndexed { index, t ->
                            SegmentedButton(
                                selected = categoryType == t,
                                onClick = { categoryType = t },
                                shape = SegmentedButtonDefaults.itemShape(index = index, count = types.size),
                                label = { Text(t.replaceFirstChar(Char::uppercase)) }
                            )
                        }
                    }
                    ColorSelector(categoryColor) { categoryColor = it }
                    IconSelector(categoryIcon) { categoryIcon = it }
                }
            },
            confirmButton = {
                TextButton(enabled = categoryName.isNotBlank(), onClick = {
                    viewModel.save(original.copy(name = categoryName.trim(), type = categoryType, color = categoryColor, icon = categoryIcon))
                    categoryEditor = null
                }) { Text("Save", fontWeight = FontWeight.Bold) }
            },
            dismissButton = { TextButton(onClick = { categoryEditor = null }) { Text("Cancel") } },
        )
    }

    if (clearConfirm) {
        AlertDialog(
            onDismissRequest = { clearConfirm = false },
            title = { Text("Clear all data?") },
            text = { Text("Transactions, budgets, subscriptions, categories, and custom preferences will be permanently wiped.") },
            confirmButton = { TextButton(onClick = { viewModel.clearAll(); clearConfirm = false }) { Text("Delete Everything", color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.Bold) } },
            dismissButton = { TextButton(onClick = { clearConfirm = false }) { Text("Cancel") } },
        )
    }

    pending?.let { (_, preview) ->
        AlertDialog(
            onDismissRequest = viewModel::cancelImport,
            title = { Text("Restore backup?") },
            text = {
                val sections = buildList {
                    if (preview.hasTransactions) add("${preview.transactions} transactions")
                    if (preview.hasBudgets) add("${preview.budgets} budgets")
                    if (preview.hasSubscriptions) add("${preview.subscriptions} subscriptions")
                    if (preview.hasSettings) add("settings and ${preview.categories} categories")
                }
                Text("This will replace ${sections.joinToString()}. Unsaved data will be overwritten.")
            },
            confirmButton = { TextButton(onClick = viewModel::confirmImport) { Text("Restore", fontWeight = FontWeight.Bold) } },
            dismissButton = { TextButton(onClick = viewModel::cancelImport) { Text("Cancel") } },
        )
    }
}

// =========================================================================
// Helpers & Sub-Components
// =========================================================================

@Composable
private fun SettingsGroup(title: String, content: @Composable ColumnScope.() -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
            title,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(horizontal = 8.dp),
        )
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(26.dp),
            color = MaterialTheme.colorScheme.surfaceContainerLow.copy(alpha = 0.85f),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.25f))
        ) {
            Column(
                Modifier.fillMaxWidth().padding(4.dp),
                content = content
            )
        }
    }
}

@Composable
private fun SettingsRow(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onClick: () -> Unit
) {
    ListItem(
        headlineContent = { Text(title, fontWeight = FontWeight.Bold) },
        supportingContent = { Text(subtitle, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant) },
        leadingContent = {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
            }
        },
        trailingContent = {
            FilledTonalButton(onClick = onClick, shape = CircleShape) {
                Text("Edit", fontWeight = FontWeight.Bold)
            }
        },
        colors = ListItemDefaults.colors(containerColor = Color.Transparent)
    )
}

@Composable
private fun AccentSelectorGrid(selected: AppAccent, onSelected: (AppAccent) -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        AppAccent.entries.forEach { accent ->
            val isSelected = accent == selected
            val scale by animateFloatAsState(
                targetValue = if (isSelected) 1.15f else 1.0f,
                animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy),
                label = "accentScale"
            )
            val preview = accent.previewColor()

            Box(
                modifier = Modifier
                    .size(36.dp)
                    .graphicsLayer { scaleX = scale; scaleY = scale }
                    .clip(CircleShape)
                    .background(preview)
                    .then(
                        if (isSelected) Modifier.padding(3.dp).clip(CircleShape).background(Color.White)
                        else Modifier
                    )
                    .clickable { onSelected(accent) },
                contentAlignment = Alignment.Center
            ) {
                if (isSelected) {
                    Box(
                        modifier = Modifier
                            .size(18.dp)
                            .clip(CircleShape)
                            .background(preview)
                    )
                }
            }
        }
    }
}

@Composable
private fun AppAccent.previewColor(): Color = when (this) {
    AppAccent.dynamic -> Color(0xFF6750A4)
    AppAccent.purple -> Color(0xFF9C27B0)
    AppAccent.blue -> Color(0xFF2196F3)
    AppAccent.cyan -> Color(0xFF00BCD4)
    AppAccent.teal -> Color(0xFF009688)
    AppAccent.green -> Color(0xFF4CAF50)
    AppAccent.orange -> Color(0xFFFF9800)
    AppAccent.pink -> Color(0xFFE91E63)
    AppAccent.red -> Color(0xFFF44336)
    AppAccent.monochrome -> Color(0xFF757575)
}

