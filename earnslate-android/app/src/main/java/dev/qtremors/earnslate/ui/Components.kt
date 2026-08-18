@file:OptIn(androidx.compose.material3.ExperimentalMaterial3ExpressiveApi::class)

package dev.qtremors.earnslate.ui

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.AttachMoney
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Outline
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import coil.compose.AsyncImage
import com.materialkolor.ktx.harmonize
import compose.icons.SimpleIcons
import compose.icons.simpleicons.Adobe
import compose.icons.simpleicons.Amazon
import compose.icons.simpleicons.Apple
import compose.icons.simpleicons.Applemusic
import compose.icons.simpleicons.Bitwarden
import compose.icons.simpleicons.Canva
import compose.icons.simpleicons.Coursera
import compose.icons.simpleicons.Crunchyroll
import compose.icons.simpleicons.Discord
import compose.icons.simpleicons.Dropbox
import compose.icons.simpleicons.Figma
import compose.icons.simpleicons.Github
import compose.icons.simpleicons.Google
import compose.icons.simpleicons.Linkedin
import compose.icons.simpleicons.Medium
import compose.icons.simpleicons.Microsoft
import compose.icons.simpleicons.Netflix
import compose.icons.simpleicons.Nintendo
import compose.icons.simpleicons.Notion
import compose.icons.simpleicons.Openai
import compose.icons.simpleicons.Playstation
import compose.icons.simpleicons.Slack
import compose.icons.simpleicons.Spotify
import compose.icons.simpleicons.Steam
import compose.icons.simpleicons.Strava
import compose.icons.simpleicons.Swiggy
import compose.icons.simpleicons.Udemy
import compose.icons.simpleicons.Xbox
import compose.icons.simpleicons.Youtube
import compose.icons.simpleicons.Zomato
import compose.icons.simpleicons.Zoom
import dev.qtremors.earnslate.R
import dev.qtremors.earnslate.data.BillingCycle
import dev.qtremors.earnslate.data.Subscription
import dev.qtremors.earnslate.data.TimeUnit
import dev.qtremors.earnslate.data.Transaction
import dev.qtremors.earnslate.data.TransactionType
import dev.qtremors.earnslate.data.UserSettings
import dev.qtremors.earnslate.data.parseDate
import dev.qtremors.earnslate.ui.theme.LocalHapticsEnabled
import java.io.File
import java.text.NumberFormat
import java.time.Instant
import java.time.LocalDate
import java.time.YearMonth
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.format.TextStyle
import java.util.Currency
import java.util.Locale
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.max
import kotlin.math.sin

// =========================================================================
// Spring Press & Haptic Micro-Interactions
// =========================================================================

/**
 * Modifier that applies spring squash-and-stretch physics upon press along with tactile haptics.
 */
@Composable
fun Modifier.bouncyClickable(
    enabled: Boolean = true,
    scaleDown: Float = 0.94f,
    onClick: () -> Unit
): Modifier {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val haptic = LocalHapticFeedback.current
    val hapticsEnabled = LocalHapticsEnabled.current

    val animatedScale by animateFloatAsState(
        targetValue = if (isPressed && enabled) scaleDown else 1.0f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessMediumLow
        ),
        label = "BouncyScale"
    )

    return this
        .graphicsLayer {
            scaleX = animatedScale
            scaleY = animatedScale
        }
        .clickable(
            interactionSource = interactionSource,
            indication = null,
            enabled = enabled
        ) {
            if (hapticsEnabled) {
                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
            }
            onClick()
        }
}

// =========================================================================
// Top App Bar
// =========================================================================

@Composable
fun AppTopBar(title: String, subtitle: String? = null, onSettings: (() -> Unit)? = null) {
    TopAppBar(
        title = {
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.ExtraBold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                subtitle?.let {
                    Text(
                        text = it,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        },
        actions = {
            onSettings?.let {
                FilledTonalIconButton(
                    onClick = it,
                    modifier = Modifier.size(42.dp),
                    shape = CircleShape,
                    colors = IconButtonDefaults.filledTonalIconButtonColors(
                        containerColor = MaterialTheme.colorScheme.surfaceContainerHigh.copy(alpha = 0.7f),
                        contentColor = MaterialTheme.colorScheme.onSurface
                    )
                ) {
                    Icon(Icons.Default.Settings, "Settings", modifier = Modifier.size(20.dp))
                }
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = Color.Transparent,
            titleContentColor = MaterialTheme.colorScheme.onSurface,
            navigationIconContentColor = MaterialTheme.colorScheme.onSurface,
            actionIconContentColor = MaterialTheme.colorScheme.onSurfaceVariant
        )
    )
}

// =========================================================================
// Hero Balance & Stat Cards
// =========================================================================

/**
 * Living Hero Balance Card with ambient aura, rolling number counter, and quick shortcuts.
 */
@Composable
fun HeroBalanceCard(
    balance: Double,
    settings: UserSettings,
    onAddIncome: () -> Unit,
    onAddExpense: () -> Unit,
    modifier: Modifier = Modifier
) {
    val primaryColor = MaterialTheme.colorScheme.primary
    val tertiaryColor = MaterialTheme.colorScheme.tertiary
    val surfaceContainer = MaterialTheme.colorScheme.surfaceContainer

    val transition = rememberInfiniteTransition(label = "heroGlow")
    val glowAlpha by transition.animateFloat(
        initialValue = 0.25f,
        targetValue = 0.55f,
        animationSpec = infiniteRepeatable(
            animation = tween(4000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "heroGlowAlpha"
    )

    Card(
        modifier = modifier
            .fillMaxWidth()
            .drawBehind {
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            primaryColor.copy(alpha = glowAlpha),
                            Color.Transparent
                        ),
                        center = Offset(size.width * 0.8f, size.height * 0.2f),
                        radius = size.width * 0.6f
                    )
                )
            },
        shape = RoundedCornerShape(32.dp),
        colors = CardDefaults.cardColors(
            containerColor = surfaceContainer.copy(alpha = 0.75f)
        ),
        border = BorderStroke(
            width = 1.dp,
            brush = Brush.linearGradient(
                listOf(
                    primaryColor.copy(alpha = 0.45f),
                    tertiaryColor.copy(alpha = 0.15f),
                    primaryColor.copy(alpha = 0.05f)
                )
            )
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(if (balance >= 0) Color(0xFF10B981) else MaterialTheme.colorScheme.error)
                    )
                    Spacer(Modifier.width(8.dp))
                    Text(
                        text = "TOTAL NET BALANCE",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        letterSpacing = 1.2.sp
                    )
                }

                Surface(
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
                ) {
                    Text(
                        text = settings.currency,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }

            Spacer(Modifier.height(12.dp))

            // Animated balance text
            AnimatedCurrencyText(
                amount = balance,
                settings = settings,
                style = MaterialTheme.typography.displaySmall,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(Modifier.height(20.dp))

            // Quick Shortcut Action Pills
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .height(44.dp)
                        .bouncyClickable(onClick = onAddIncome),
                    shape = CircleShape,
                    color = Color(0xFF10B981).copy(alpha = 0.15f),
                    border = BorderStroke(1.dp, Color(0xFF10B981).copy(alpha = 0.3f))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            Icons.Default.TrendingUp,
                            contentDescription = null,
                            tint = Color(0xFF10B981),
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(Modifier.width(6.dp))
                        Text(
                            text = "+ Income",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF10B981)
                        )
                    }
                }

                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .height(44.dp)
                        .bouncyClickable(onClick = onAddExpense),
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.error.copy(alpha = 0.12f),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.error.copy(alpha = 0.25f))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            Icons.Default.TrendingDown,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.error,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(Modifier.width(6.dp))
                        Text(
                            text = "+ Expense",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.error
                        )
                    }
                }
            }
        }
    }
}

/**
 * Modern floating Stat Card with subtle glass glow and trend badge.
 */
@Composable
fun StatCard(
    label: String,
    value: String,
    icon: ImageVector,
    modifier: Modifier = Modifier,
    tint: Color = MaterialTheme.colorScheme.primary
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(26.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainerLow.copy(alpha = 0.85f)
        ),
        border = BorderStroke(
            width = 1.dp,
            color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.2f)
        )
    ) {
        Column(
            modifier = Modifier.padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(tint.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, null, tint = tint, modifier = Modifier.size(20.dp))
            }
            Column {
                Text(
                    text = value,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.ExtraBold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(Modifier.height(2.dp))
                Text(
                    text = label,
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

/**
 * Animated Currency text with digit rolling transition.
 */
@Composable
fun AnimatedCurrencyText(
    amount: Double,
    settings: UserSettings,
    modifier: Modifier = Modifier,
    style: androidx.compose.ui.text.TextStyle = MaterialTheme.typography.titleLarge,
    color: Color = MaterialTheme.colorScheme.onSurface
) {
    val formatted = currency(amount, settings)
    AnimatedContent(
        targetState = formatted,
        transitionSpec = {
            (slideInVertically { height -> height / 2 } + fadeIn()) togetherWith
            (slideOutVertically { height -> -height / 2 } + fadeOut())
        },
        label = "CurrencyRoll",
        modifier = modifier
    ) { targetText ->
        Text(
            text = targetText,
            style = style,
            fontWeight = FontWeight.ExtraBold,
            color = color,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

// =========================================================================
// Empty State with Living Morphing Icon
// =========================================================================

@Composable
fun EmptyState(
    message: String,
    action: String? = null,
    onAction: (() -> Unit)? = null
) {
    val primaryColor = MaterialTheme.colorScheme.primary
    val secondaryColor = MaterialTheme.colorScheme.secondary
    val tertiaryColor = MaterialTheme.colorScheme.tertiary
    val titleBrush = remember(primaryColor, secondaryColor, tertiaryColor) {
        Brush.linearGradient(colors = listOf(primaryColor, secondaryColor, tertiaryColor))
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(32.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainer.copy(alpha = 0.5f)
        ),
        border = BorderStroke(
            width = 1.dp,
            color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.25f)
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 36.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            val transition = rememberInfiniteTransition(label = "iconPulse")
            val scale by transition.animateFloat(
                initialValue = 0.95f,
                targetValue = 1.05f,
                animationSpec = infiniteRepeatable(
                    animation = tween(durationMillis = 3000, easing = FastOutSlowInEasing),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "scale"
            )
            val morphProgress by transition.animateFloat(
                initialValue = 0f,
                targetValue = 1f,
                animationSpec = infiniteRepeatable(
                    animation = tween(durationMillis = 8000, easing = LinearEasing),
                    repeatMode = RepeatMode.Restart
                ),
                label = "morphProgress"
            )

            val morphingShape = remember(morphProgress) {
                object : Shape {
                    override fun createOutline(
                        size: Size,
                        layoutDirection: LayoutDirection,
                        density: Density
                    ): Outline {
                        val numPoints = 8
                        val cx = size.width / 2f
                        val cy = size.height / 2f
                        val baseR = size.width.coerceAtMost(size.height) / 2f
                        val points = List(numPoints) { i ->
                            val angle = (i * 2.0 * PI / numPoints).toFloat()
                            val wave = sin(angle * 3f + morphProgress * 2f * PI.toFloat()) * 0.12f +
                                       cos(angle * 2f - morphProgress * 2f * PI.toFloat() * 0.8f) * 0.08f
                            val r = baseR * (0.8f + wave)
                            Offset(cx + r * cos(angle), cy + r * sin(angle))
                        }
                        val path = Path().apply {
                            val firstMid = Offset(
                                (points[0].x + points[numPoints - 1].x) / 2f,
                                (points[0].y + points[numPoints - 1].y) / 2f
                            )
                            moveTo(firstMid.x, firstMid.y)
                            for (i in 0 until numPoints) {
                                val current = points[i]
                                val next = points[(i + 1) % numPoints]
                                val mid = Offset((current.x + next.x) / 2f, (current.y + next.y) / 2f)
                                quadraticTo(current.x, current.y, mid.x, mid.y)
                            }
                            close()
                        }
                        return Outline.Generic(path)
                    }
                }
            }

            val borderBrush = remember(primaryColor, secondaryColor, tertiaryColor) {
                Brush.sweepGradient(
                    colors = listOf(
                        primaryColor.copy(alpha = 0.7f),
                        secondaryColor.copy(alpha = 0.2f),
                        tertiaryColor.copy(alpha = 0.7f),
                        primaryColor.copy(alpha = 0.7f)
                    )
                )
            }

            Surface(
                shape = morphingShape,
                color = MaterialTheme.colorScheme.surfaceContainerHighest.copy(alpha = 0.35f),
                border = BorderStroke(1.5.dp, borderBrush),
                modifier = Modifier
                    .size(96.dp)
                    .graphicsLayer {
                        scaleX = scale
                        scaleY = scale
                    }
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.Default.AccountBalanceWallet,
                        contentDescription = null,
                        modifier = Modifier.size(38.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = message,
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.ExtraBold,
                    brush = titleBrush
                ),
                textAlign = TextAlign.Center
            )

            if (action != null && onAction != null) {
                Spacer(modifier = Modifier.height(20.dp))
                Button(
                    onClick = onAction,
                    shape = CircleShape,
                    modifier = Modifier.height(44.dp)
                ) {
                    Icon(Icons.Default.Add, null, modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(8.dp))
                    Text(action, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

// =========================================================================
// Search & Filter Fields
// =========================================================================

@Composable
fun SearchField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Search..."
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier.fillMaxWidth(),
        placeholder = {
            Text(
                placeholder,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
            )
        },
        leadingIcon = {
            Icon(
                Icons.Default.Search,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(20.dp)
            )
        },
        trailingIcon = {
            if (value.isNotEmpty()) {
                IconButton(onClick = { onValueChange("") }) {
                    Icon(Icons.Default.Clear, "Clear search", modifier = Modifier.size(18.dp))
                }
            }
        },
        singleLine = true,
        shape = CircleShape,
        colors = OutlinedTextFieldDefaults.colors(
            focusedContainerColor = MaterialTheme.colorScheme.surfaceContainerHigh.copy(alpha = 0.5f),
            unfocusedContainerColor = MaterialTheme.colorScheme.surfaceContainerLow.copy(alpha = 0.5f),
            focusedBorderColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.7f),
            unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f)
        )
    )
}

@Composable
fun AmountField(value: String, onValueChange: (String) -> Unit, label: String = "Amount") {
    OutlinedTextField(
        value = value,
        onValueChange = { text ->
            if (text.isEmpty() || text.matches(Regex("\\d{0,12}([.]\\d{0,2})?"))) onValueChange(text)
        },
        modifier = Modifier.fillMaxWidth(),
        label = { Text(label) },
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
        singleLine = true,
        leadingIcon = { Icon(Icons.Default.AttachMoney, null, tint = MaterialTheme.colorScheme.primary) },
        shape = RoundedCornerShape(18.dp),
        textStyle = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
    )
}

@Composable
fun CycleSelector(cycle: BillingCycle, onChange: (BillingCycle) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        OutlinedTextField(
            value = cycle.count.toString(),
            onValueChange = { value ->
                value.toIntOrNull()?.takeIf { it in 1..10_000 }?.let { onChange(cycle.copy(count = it)) }
            },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Every") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            singleLine = true,
            shape = RoundedCornerShape(18.dp)
        )
        SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
            listOf(TimeUnit.day, TimeUnit.week, TimeUnit.month, TimeUnit.year).forEachIndexed { index, unit ->
                SegmentedButton(
                    selected = cycle.unit == unit,
                    onClick = { onChange(cycle.copy(unit = unit)) },
                    shape = SegmentedButtonDefaults.itemShape(index, 4),
                    label = { Text(unit.name.take(1).uppercase() + unit.name.drop(1), maxLines = 1, fontWeight = FontWeight.SemiBold) }
                )
            }
        }
        TextButton(onClick = { onChange(cycle.copy(unit = TimeUnit.hour)) }) {
            Text(if (cycle.unit == TimeUnit.hour) "Hourly selected" else "Use hourly cycle", fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
fun DateField(label: String, value: String, onChange: (String) -> Unit) {
    var open by remember { mutableStateOf(false) }
    Box(modifier = Modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = value,
            onValueChange = {},
            readOnly = true,
            label = { Text(label) },
            modifier = Modifier.fillMaxWidth(),
            trailingIcon = {
                IconButton(onClick = { open = true }) {
                    Icon(Icons.Default.CalendarMonth, "Choose $label", tint = MaterialTheme.colorScheme.primary)
                }
            },
            shape = RoundedCornerShape(18.dp)
        )
        Box(
            modifier = Modifier
                .matchParentSize()
                .clip(RoundedCornerShape(18.dp))
                .clickable { open = true }
        )
    }
    if (open) {
        val initialMillis = runCatching {
            LocalDate.parse(value).atStartOfDay(ZoneId.of("UTC")).toInstant().toEpochMilli()
        }.getOrNull()
        val state = androidx.compose.material3.rememberDatePickerState(initialSelectedDateMillis = initialMillis)
        DatePickerDialog(
            onDismissRequest = { open = false },
            confirmButton = {
                TextButton(onClick = {
                    state.selectedDateMillis?.let {
                        onChange(Instant.ofEpochMilli(it).atZone(ZoneId.of("UTC")).toLocalDate().toString())
                    }
                    open = false
                }) { Text("Choose", fontWeight = FontWeight.Bold) }
            },
            dismissButton = { TextButton(onClick = { open = false }) { Text("Cancel") } }
        ) { DatePicker(state) }
    }
}

// =========================================================================
// Interactive Donut Chart with Sweep Animation & Touch Inspection
// =========================================================================

@Composable
fun DonutChart(
    values: List<Pair<String, Double>>,
    modifier: Modifier = Modifier
) {
    val positive = values.filter { it.second > 0 }
    val total = positive.sumOf { it.second }.coerceAtLeast(1.0)
    val primary = MaterialTheme.colorScheme.primary
    val colors = listOf(
        MaterialTheme.colorScheme.primary,
        MaterialTheme.colorScheme.tertiary,
        MaterialTheme.colorScheme.secondary,
        Color(0xFFF59E0B).harmonize(primary),
        Color(0xFF10B981).harmonize(primary),
        Color(0xFFEF4444).harmonize(primary),
        Color(0xFF8B5CF6).harmonize(primary),
        Color(0xFF06B6D4).harmonize(primary)
    )

    var animatedProgress by remember { mutableStateOf(0f) }
    LaunchedEffect(values) {
        animatedProgress = 0f
        animatedProgress = 1f
    }
    val sweepProgress by animateFloatAsState(
        targetValue = animatedProgress,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioLowBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "DonutSweep"
    )

    var selectedIndex by remember { mutableIntStateOf(-1) }

    Box(
        modifier = modifier.aspectRatio(1f),
        contentAlignment = Alignment.Center
    ) {
        Canvas(
            modifier = Modifier
                .aspectRatio(1f)
                .pointerInput(positive) {
                    detectTapGestures { offset ->
                        val center = Offset(size.width / 2f, size.height / 2f)
                        val angle = (Math.toDegrees(atan2((offset.y - center.y).toDouble(), (offset.x - center.x).toDouble())).toFloat() + 450f) % 360f
                        var accumulated = 0f
                        var tappedIdx = -1
                        positive.forEachIndexed { idx, (_, amount) ->
                            val slice = (amount / total * 360).toFloat()
                            if (angle >= accumulated && angle < accumulated + slice) {
                                tappedIdx = idx
                            }
                            accumulated += slice
                        }
                        selectedIndex = if (selectedIndex == tappedIdx) -1 else tappedIdx
                    }
                }
                .semantics { contentDescription = "Donut chart with ${positive.size} categories" }
        ) {
            var start = -90f
            val baseStrokeWidth = size.width * 0.16f
            val activeStrokeWidth = size.width * 0.22f

            positive.forEachIndexed { index, (_, value) ->
                val sweep = (value / total * 360 * sweepProgress).toFloat()
                val isSelected = (index == selectedIndex)
                val stroke = if (isSelected) activeStrokeWidth else baseStrokeWidth
                val color = colors[index % colors.size]

                drawArc(
                    color = color,
                    startAngle = start,
                    sweepAngle = sweep,
                    useCenter = false,
                    style = Stroke(stroke, cap = StrokeCap.Round)
                )
                start += sweep
            }
        }

        // Center Inspection Label
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            if (selectedIndex in positive.indices) {
                val item = positive[selectedIndex]
                Text(
                    text = item.first,
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1
                )
                Text(
                    text = "${((item.second / total) * 100).toInt()}%",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.primary
                )
            } else {
                Text(
                    text = "Total",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = "${positive.size} items",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}

// =========================================================================
// Subscription Treemap
// =========================================================================

@Composable
fun SubscriptionTreemap(subscriptions: List<Subscription>, modifier: Modifier = Modifier) {
    val active = subscriptions.filter { it.active }
    val total = active.sumOf { dev.qtremors.earnslate.data.monthlyEquivalent(it.amount, it.cycle) }.coerceAtLeast(1.0)
    val primaryColor = MaterialTheme.colorScheme.primary

    Canvas(
        modifier = modifier
            .height(240.dp)
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .semantics { contentDescription = "Subscription cost treemap with ${active.size} active subscriptions" }
    ) {
        var x = 0f
        active.forEach { subscription ->
            val fraction = (dev.qtremors.earnslate.data.monthlyEquivalent(subscription.amount, subscription.cycle) / total).toFloat()
            val width = size.width * fraction
            val baseColor = parseColor(subscription.color) ?: Color(0xFF64748B)
            val harmonizedColor = baseColor.harmonize(primaryColor)
            drawRoundRect(
                color = harmonizedColor,
                topLeft = Offset(x + 2, 2f),
                size = Size((width - 4).coerceAtLeast(1f), size.height - 4),
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(14f, 14f)
            )
            x += width
        }
    }
}

// =========================================================================
// Service Icon & Brand Art
// =========================================================================

@Composable
fun ServiceIcon(
    name: String,
    color: String?,
    customPath: String?,
    modifier: Modifier = Modifier,
    iconName: String? = null
) {
    val rawTint = parseColor(color) ?: MaterialTheme.colorScheme.primary
    val tint = rawTint.harmonize(MaterialTheme.colorScheme.primary)

    if (customPath != null && File(customPath).isFile) {
        AsyncImage(
            model = File(customPath),
            contentDescription = "$name icon",
            modifier = modifier.clip(RoundedCornerShape(16.dp))
        )
    } else {
        val resolvedName = iconName ?: name
        val artwork = bundledServiceArtwork(resolvedName)
        if (artwork != null) {
            Image(
                painter = painterResource(artwork),
                contentDescription = "$name logo",
                contentScale = ContentScale.Crop,
                modifier = modifier.clip(RoundedCornerShape(16.dp))
            )
        } else {
            Box(
                modifier = modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(tint.copy(alpha = 0.16f)),
                contentAlignment = Alignment.Center
            ) {
                val vector = brandIcon(resolvedName)
                if (vector != null) {
                    Icon(vector, "$name logo", Modifier.padding(10.dp), tint = tint)
                } else {
                    Text(
                        text = name.trim().take(1).uppercase(),
                        color = tint,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Black
                    )
                }
            }
        }
    }
}

private fun bundledServiceArtwork(value: String): Int? = when (value.lowercase().replace(" ", "")) {
    "applemusic" -> R.drawable.service_apple_music
    "crunchyroll" -> R.drawable.service_crunchyroll
    "openai", "chatgpt", "chatgptplus" -> R.drawable.service_chatgpt
    "googlegemini", "gemini" -> R.drawable.service_gemini
    "codex" -> R.drawable.service_codex
    else -> null
}

private fun brandIcon(value: String): ImageVector? = when (value.lowercase().replace(" ", "")) {
    "netflix" -> SimpleIcons.Netflix
    "crunchyroll" -> SimpleIcons.Crunchyroll
    "spotify" -> SimpleIcons.Spotify
    "youtube", "youtubepremium", "youtubemusic" -> SimpleIcons.Youtube
    "amazon", "amazonprime", "primevideo", "amazonmusic", "amazonaws" -> SimpleIcons.Amazon
    "applemusic" -> SimpleIcons.Applemusic
    "apple", "appletv", "icloud", "applearcade" -> SimpleIcons.Apple
    "openai", "chatgpt", "chatgptplus", "codex" -> SimpleIcons.Openai
    "github", "githubcopilot", "githubpro" -> SimpleIcons.Github
    "dropbox" -> SimpleIcons.Dropbox
    "steam" -> SimpleIcons.Steam
    "discord", "discordnitro" -> SimpleIcons.Discord
    "slack" -> SimpleIcons.Slack
    "zoom" -> SimpleIcons.Zoom
    "microsoft", "microsoft365", "microsoftteams", "microsoftazure", "onedrive" -> SimpleIcons.Microsoft
    "google", "googledrive", "googlecloud", "googleplay" -> SimpleIcons.Google
    "adobe" -> SimpleIcons.Adobe
    "figma" -> SimpleIcons.Figma
    "notion" -> SimpleIcons.Notion
    "canva" -> SimpleIcons.Canva
    "xbox" -> SimpleIcons.Xbox
    "playstation" -> SimpleIcons.Playstation
    "nintendoswitch", "nintendo" -> SimpleIcons.Nintendo
    "bitwarden" -> SimpleIcons.Bitwarden
    "coursera" -> SimpleIcons.Coursera
    "udemy" -> SimpleIcons.Udemy
    "medium" -> SimpleIcons.Medium
    "linkedin" -> SimpleIcons.Linkedin
    "strava" -> SimpleIcons.Strava
    "swiggy" -> SimpleIcons.Swiggy
    "zomato" -> SimpleIcons.Zomato
    else -> null
}

// =========================================================================
// Item Actions
// =========================================================================

@Composable
fun ItemActions(
    onEdit: () -> Unit,
    onDelete: () -> Unit,
    active: Boolean? = null,
    onToggle: (() -> Unit)? = null
) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        if (active != null && onToggle != null) {
            IconButton(
                onClick = onToggle,
                modifier = Modifier.size(36.dp)
            ) {
                Icon(
                    imageVector = if (active) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = if (active) "Pause" else "Resume",
                    tint = if (active) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
        IconButton(
            onClick = onEdit,
            modifier = Modifier.size(36.dp)
        ) {
            Icon(Icons.Default.Edit, "Edit", modifier = Modifier.size(18.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        IconButton(
            onClick = onDelete,
            modifier = Modifier.size(36.dp)
        ) {
            Icon(Icons.Default.Delete, "Delete", tint = MaterialTheme.colorScheme.error.copy(alpha = 0.85f), modifier = Modifier.size(18.dp))
        }
    }
}

// =========================================================================
// Floaty Split Button FAB & Menu
// =========================================================================

@Composable
fun EarnslateSplitButton(
    label: String,
    onClick: () -> Unit,
    onMenuClick: () -> Unit,
    modifier: Modifier = Modifier,
    dropdownContent: @Composable () -> Unit = {}
) {
    val leftInteractionSource = remember { MutableInteractionSource() }
    val leftPressed by leftInteractionSource.collectIsPressedAsState()
    val leftScale by animateFloatAsState(
        targetValue = if (leftPressed) 0.92f else 1.0f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessMedium),
        label = "LeftButtonScale"
    )

    val rightInteractionSource = remember { MutableInteractionSource() }
    val rightPressed by rightInteractionSource.collectIsPressedAsState()
    val rightScale by animateFloatAsState(
        targetValue = if (rightPressed) 0.92f else 1.0f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessMedium),
        label = "RightButtonScale"
    )

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically
    ) {
        FilledTonalButton(
            onClick = onClick,
            shape = RoundedCornerShape(topStartPercent = 50, bottomStartPercent = 50, topEndPercent = 18, bottomEndPercent = 18),
            contentPadding = PaddingValues(start = 18.dp, end = 14.dp, top = 10.dp, bottom = 10.dp),
            interactionSource = leftInteractionSource,
            modifier = Modifier
                .height(52.dp)
                .graphicsLayer {
                    scaleX = leftScale
                    scaleY = leftScale
                }
        ) {
            Icon(Icons.Default.Add, null, modifier = Modifier.size(20.dp))
            Spacer(Modifier.width(6.dp))
            Text(label, style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.width(2.dp))
        Box {
            FilledTonalButton(
                onClick = onMenuClick,
                shape = RoundedCornerShape(topStartPercent = 18, bottomStartPercent = 18, topEndPercent = 50, bottomEndPercent = 50),
                contentPadding = PaddingValues(horizontal = 12.dp),
                interactionSource = rightInteractionSource,
                modifier = Modifier
                    .height(52.dp)
                    .graphicsLayer {
                        scaleX = rightScale
                        scaleY = rightScale
                    }
            ) {
                Icon(Icons.Default.ArrowDropDown, "More options", modifier = Modifier.size(20.dp))
            }
            dropdownContent()
        }
    }
}

@Composable
fun EarnslateDropdownMenu(
    expanded: Boolean,
    onDismissRequest: () -> Unit,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    label: String = "Export CSV",
    icon: ImageVector = Icons.Default.Download
) {
    if (expanded) {
        val density = LocalDensity.current
        val yOffsetPx = remember(density) { with(density) { -60.dp.roundToPx() } }

        Popup(
            alignment = Alignment.TopEnd,
            offset = IntOffset(x = 0, y = yOffsetPx),
            onDismissRequest = onDismissRequest,
            properties = PopupProperties(focusable = true)
        ) {
            var animatedVisible by remember { mutableStateOf(false) }
            LaunchedEffect(Unit) { animatedVisible = true }

            val menuInteractionSource = remember { MutableInteractionSource() }
            val menuPressed by menuInteractionSource.collectIsPressedAsState()
            val menuScale by animateFloatAsState(
                targetValue = if (menuPressed) 0.92f else 1.0f,
                animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessMedium),
                label = "MenuButtonScale"
            )

            AnimatedVisibility(
                visible = animatedVisible,
                enter = scaleIn(
                    animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow)
                ) + fadeIn(),
                modifier = modifier
            ) {
                Surface(
                    onClick = {
                        onDismissRequest()
                        onClick()
                    },
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.surfaceContainerHigh,
                    shadowElevation = 8.dp,
                    tonalElevation = 8.dp,
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f)),
                    interactionSource = menuInteractionSource,
                    modifier = Modifier
                        .width(184.dp)
                        .height(50.dp)
                        .graphicsLayer {
                            scaleX = menuScale
                            scaleY = menuScale
                        }
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(horizontal = 18.dp)
                    ) {
                        Icon(icon, contentDescription = null, modifier = Modifier.size(20.dp), tint = MaterialTheme.colorScheme.primary)
                        Spacer(Modifier.width(12.dp))
                        Text(label, style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                    }
                }
            }
        }
    }
}

// =========================================================================
// Spend & Cash Flow History Graph
// =========================================================================

data class SpendHistoryBucket(
    val key: String,
    val label: String,
    val fullLabel: String,
    val expense: Double,
    val income: Double,
    val net: Double,
    val topCategory: String? = null,
    val topCategoryAmount: Double = 0.0,
)

fun calculateSpendHistory(
    transactions: List<Transaction>,
    timeRange: String,
    today: LocalDate = LocalDate.now()
): List<SpendHistoryBucket> {
    return when (timeRange) {
        "7D" -> {
            (6 downTo 0).map { daysAgo ->
                val date = today.minusDays(daysAgo.toLong())
                val dayTransactions = transactions.filter {
                    val txDate = parseDate(it.date)
                    txDate == date
                }
                val expense = dayTransactions.filter { it.type == TransactionType.expense }.sumOf { abs(it.amount) }
                val income = dayTransactions.filter { it.type == TransactionType.income }.sumOf { abs(it.amount) }
                val topCat = dayTransactions.filter { it.type == TransactionType.expense }
                    .groupBy(Transaction::category)
                    .maxByOrNull { (_, items) -> items.sumOf { abs(it.amount) } }
                SpendHistoryBucket(
                    key = date.toString(),
                    label = date.dayOfWeek.getDisplayName(TextStyle.SHORT, Locale.getDefault()),
                    fullLabel = "${date.dayOfWeek.getDisplayName(TextStyle.FULL, Locale.getDefault())}, ${date.dayOfMonth} ${date.month.getDisplayName(TextStyle.SHORT, Locale.getDefault())}",
                    expense = expense,
                    income = income,
                    net = income - expense,
                    topCategory = topCat?.key,
                    topCategoryAmount = topCat?.value?.sumOf { abs(it.amount) } ?: 0.0
                )
            }
        }
        "30D" -> {
            (4 downTo 0).map { bucketIndex ->
                val start = today.minusDays((bucketIndex * 6 + 5).toLong())
                val end = today.minusDays((bucketIndex * 6).toLong())
                val bucketTransactions = transactions.filter {
                    val txDate = parseDate(it.date)
                    txDate != null && !txDate.isBefore(start) && !txDate.isAfter(end)
                }
                val expense = bucketTransactions.filter { it.type == TransactionType.expense }.sumOf { abs(it.amount) }
                val income = bucketTransactions.filter { it.type == TransactionType.income }.sumOf { abs(it.amount) }
                val topCat = bucketTransactions.filter { it.type == TransactionType.expense }
                    .groupBy(Transaction::category)
                    .maxByOrNull { (_, items) -> items.sumOf { abs(it.amount) } }
                SpendHistoryBucket(
                    key = "b-$bucketIndex",
                    label = "${start.dayOfMonth}-${end.dayOfMonth}",
                    fullLabel = "${start.dayOfMonth} ${start.month.getDisplayName(TextStyle.SHORT, Locale.getDefault())} - ${end.dayOfMonth} ${end.month.getDisplayName(TextStyle.SHORT, Locale.getDefault())}",
                    expense = expense,
                    income = income,
                    net = income - expense,
                    topCategory = topCat?.key,
                    topCategoryAmount = topCat?.value?.sumOf { abs(it.amount) } ?: 0.0
                )
            }
        }
        "6M" -> {
            (5 downTo 0).map { monthsAgo ->
                val ym = YearMonth.from(today).minusMonths(monthsAgo.toLong())
                val monthTransactions = transactions.filter {
                    val txDate = parseDate(it.date)
                    txDate != null && YearMonth.from(txDate) == ym
                }
                val expense = monthTransactions.filter { it.type == TransactionType.expense }.sumOf { abs(it.amount) }
                val income = monthTransactions.filter { it.type == TransactionType.income }.sumOf { abs(it.amount) }
                val topCat = monthTransactions.filter { it.type == TransactionType.expense }
                    .groupBy(Transaction::category)
                    .maxByOrNull { (_, items) -> items.sumOf { abs(it.amount) } }
                SpendHistoryBucket(
                    key = ym.toString(),
                    label = ym.month.getDisplayName(TextStyle.SHORT, Locale.getDefault()),
                    fullLabel = "${ym.month.getDisplayName(TextStyle.FULL, Locale.getDefault())} ${ym.year}",
                    expense = expense,
                    income = income,
                    net = income - expense,
                    topCategory = topCat?.key,
                    topCategoryAmount = topCat?.value?.sumOf { abs(it.amount) } ?: 0.0
                )
            }
        }
        "1Y" -> {
            (11 downTo 0).map { monthsAgo ->
                val ym = YearMonth.from(today).minusMonths(monthsAgo.toLong())
                val monthTransactions = transactions.filter {
                    val txDate = parseDate(it.date)
                    txDate != null && YearMonth.from(txDate) == ym
                }
                val expense = monthTransactions.filter { it.type == TransactionType.expense }.sumOf { abs(it.amount) }
                val income = monthTransactions.filter { it.type == TransactionType.income }.sumOf { abs(it.amount) }
                val topCat = monthTransactions.filter { it.type == TransactionType.expense }
                    .groupBy(Transaction::category)
                    .maxByOrNull { (_, items) -> items.sumOf { abs(it.amount) } }
                SpendHistoryBucket(
                    key = ym.toString(),
                    label = ym.month.getDisplayName(TextStyle.NARROW, Locale.getDefault()),
                    fullLabel = "${ym.month.getDisplayName(TextStyle.FULL, Locale.getDefault())} ${ym.year}",
                    expense = expense,
                    income = income,
                    net = income - expense,
                    topCategory = topCat?.key,
                    topCategoryAmount = topCat?.value?.sumOf { abs(it.amount) } ?: 0.0
                )
            }
        }
        else -> { // "All"
            val allDates = transactions.mapNotNull { parseDate(it.date) }
            val earliestYM = allDates.minOrNull()?.let { YearMonth.from(it) } ?: YearMonth.from(today).minusMonths(5)
            val currentYM = YearMonth.from(today)
            val monthsCount = ((currentYM.year - earliestYM.year) * 12 + (currentYM.monthValue - earliestYM.monthValue)).coerceIn(2, 24)
            (monthsCount downTo 0).map { monthsAgo ->
                val ym = currentYM.minusMonths(monthsAgo.toLong())
                val monthTransactions = transactions.filter {
                    val txDate = parseDate(it.date)
                    txDate != null && YearMonth.from(txDate) == ym
                }
                val expense = monthTransactions.filter { it.type == TransactionType.expense }.sumOf { abs(it.amount) }
                val income = monthTransactions.filter { it.type == TransactionType.income }.sumOf { abs(it.amount) }
                val topCat = monthTransactions.filter { it.type == TransactionType.expense }
                    .groupBy(Transaction::category)
                    .maxByOrNull { (_, items) -> items.sumOf { abs(it.amount) } }
                SpendHistoryBucket(
                    key = ym.toString(),
                    label = if (monthsCount > 12) "${ym.monthValue}/${ym.year % 100}" else ym.month.getDisplayName(TextStyle.SHORT, Locale.getDefault()),
                    fullLabel = "${ym.month.getDisplayName(TextStyle.FULL, Locale.getDefault())} ${ym.year}",
                    expense = expense,
                    income = income,
                    net = income - expense,
                    topCategory = topCat?.key,
                    topCategoryAmount = topCat?.value?.sumOf { abs(it.amount) } ?: 0.0
                )
            }
        }
    }
}

@Composable
fun SpendHistoryCard(
    transactions: List<Transaction>,
    settings: UserSettings,
    modifier: Modifier = Modifier
) {
    var timeRange by remember { mutableStateOf("6M") }
    var viewMode by remember { mutableStateOf("Spending") } // "Spending", "In vs Out", "Net Flow"
    var selectedIndex by remember { mutableIntStateOf(-1) }

    val buckets = remember(transactions, timeRange) {
        calculateSpendHistory(transactions, timeRange)
    }

    val totalExpense = remember(buckets) { buckets.sumOf { it.expense } }
    val totalIncome = remember(buckets) { buckets.sumOf { it.income } }
    val netCashFlow = totalIncome - totalExpense

    val maxVal = remember(buckets, viewMode) {
        val peak = when (viewMode) {
            "Spending" -> buckets.maxOfOrNull { it.expense } ?: 1.0
            "In vs Out" -> buckets.maxOfOrNull { max(it.expense, it.income) } ?: 1.0
            else -> buckets.maxOfOrNull { abs(it.net) } ?: 1.0
        }
        if (peak <= 0.0) 1.0 else peak
    }

    val selectedBucket = buckets.getOrNull(selectedIndex)

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(28.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerLow.copy(alpha = 0.85f)),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.25f))
    ) {
        Column(
            modifier = Modifier.fillMaxWidth().padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header: Title & Time Range Chips
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.7f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            Icons.Default.TrendingDown,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Spacer(Modifier.width(10.dp))
                    Column {
                        Text(
                            "Spend History",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            "Trends & Cash Flow",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                // Timeframe Segmented Switch
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    listOf("7D", "30D", "6M", "1Y", "All").forEach { range ->
                        val isSelected = timeRange == range
                        Surface(
                            onClick = { timeRange = range; selectedIndex = -1 },
                            shape = CircleShape,
                            color = if (isSelected) MaterialTheme.colorScheme.primary else Color.Transparent,
                            border = if (!isSelected) BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.35f)) else null,
                            modifier = Modifier.height(28.dp)
                        ) {
                            Box(
                                modifier = Modifier.padding(horizontal = 8.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = range,
                                    style = MaterialTheme.typography.labelSmall,
                                    fontWeight = if (isSelected) FontWeight.ExtraBold else FontWeight.Medium,
                                    color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }

            // View Mode Pill Switch
            SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
                val modes = listOf("Spending", "In vs Out", "Net Flow")
                modes.forEachIndexed { index, mode ->
                    SegmentedButton(
                        selected = viewMode == mode,
                        onClick = { viewMode = mode; selectedIndex = -1 },
                        shape = SegmentedButtonDefaults.itemShape(index = index, count = modes.size),
                        label = { Text(mode, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.labelMedium) }
                    )
                }
            }

            // Summary Metrics Badges
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MaterialTheme.colorScheme.error.copy(alpha = 0.1f),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.error.copy(alpha = 0.2f)),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(Modifier.padding(10.dp)) {
                        Text("Spent", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.Bold)
                        Text(currency(totalExpense, settings), style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.ExtraBold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    }
                }

                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = Color(0xFF10B981).copy(alpha = 0.1f),
                    border = BorderStroke(1.dp, Color(0xFF10B981).copy(alpha = 0.2f)),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(Modifier.padding(10.dp)) {
                        Text("Inflow", style = MaterialTheme.typography.labelSmall, color = Color(0xFF10B981), fontWeight = FontWeight.Bold)
                        Text(currency(totalIncome, settings), style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.ExtraBold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    }
                }

                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = if (netCashFlow >= 0) Color(0xFF10B981).copy(alpha = 0.08f) else MaterialTheme.colorScheme.error.copy(alpha = 0.08f),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.2f)),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(Modifier.padding(10.dp)) {
                        Text("Net", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant, fontWeight = FontWeight.Bold)
                        Text(
                            (if (netCashFlow >= 0) "+" else "") + currency(netCashFlow, settings),
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.ExtraBold,
                            color = if (netCashFlow >= 0) Color(0xFF10B981) else MaterialTheme.colorScheme.error,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }

            // Interactive Tooltip on Active Bar Selection
            selectedBucket?.let { bucket ->
                Surface(
                    shape = RoundedCornerShape(18.dp),
                    color = MaterialTheme.colorScheme.surfaceContainerHighest,
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.4f)),
                    shadowElevation = 4.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(bucket.fullLabel, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.ExtraBold)
                            bucket.topCategory?.let {
                                Text("Top: $it (${currency(bucket.topCategoryAmount, settings)})", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                "Spend: -" + currency(bucket.expense, settings),
                                style = MaterialTheme.typography.bodySmall,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.error
                            )
                            if (bucket.income > 0) {
                                Text(
                                    "Earn: +" + currency(bucket.income, settings),
                                    style = MaterialTheme.typography.bodySmall,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF10B981)
                                )
                            }
                        }
                    }
                }
            }

            // Chart Bar Graph
            if (buckets.all { it.expense == 0.0 && it.income == 0.0 }) {
                Box(
                    modifier = Modifier.fillMaxWidth().height(140.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        "No spending recorded in this period",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(170.dp)
                        .padding(top = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    buckets.forEachIndexed { index, bucket ->
                        val isSelected = selectedIndex == index
                        val expenseRatio = (bucket.expense / maxVal).toFloat().coerceIn(0f, 1f)
                        val incomeRatio = (bucket.income / maxVal).toFloat().coerceIn(0f, 1f)
                        val netRatio = (abs(bucket.net) / maxVal).toFloat().coerceIn(0f, 1f)

                        val animatedExpenseRatio by animateFloatAsState(
                            targetValue = expenseRatio,
                            animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow),
                            label = "expRatio"
                        )
                        val animatedIncomeRatio by animateFloatAsState(
                            targetValue = incomeRatio,
                            animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow),
                            label = "incRatio"
                        )
                        val animatedNetRatio by animateFloatAsState(
                            targetValue = netRatio,
                            animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow),
                            label = "netRatio"
                        )

                        Column(
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    selectedIndex = if (selectedIndex == index) -1 else index
                                }
                                .padding(horizontal = 2.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Bottom
                        ) {
                            // Bar Container
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(130.dp),
                                contentAlignment = Alignment.BottomCenter
                            ) {
                                when (viewMode) {
                                    "Spending" -> {
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth(if (isSelected) 0.85f else 0.75f)
                                                .height((130.dp * animatedExpenseRatio).coerceAtLeast(4.dp))
                                                .clip(RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp, bottomStart = 2.dp, bottomEnd = 2.dp))
                                                .background(
                                                    Brush.verticalGradient(
                                                        colors = if (isSelected) listOf(MaterialTheme.colorScheme.error, MaterialTheme.colorScheme.errorContainer)
                                                        else listOf(MaterialTheme.colorScheme.error.copy(alpha = 0.85f), MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.5f))
                                                    )
                                                )
                                                .then(
                                                    if (isSelected) Modifier.border(1.5.dp, MaterialTheme.colorScheme.onSurface, RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp, bottomStart = 2.dp, bottomEnd = 2.dp))
                                                    else Modifier
                                                )
                                        )
                                    }
                                    "In vs Out" -> {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.Center,
                                            verticalAlignment = Alignment.Bottom
                                        ) {
                                            // Income bar (green)
                                            Box(
                                                modifier = Modifier
                                                    .weight(1f)
                                                    .height((130.dp * animatedIncomeRatio).coerceAtLeast(3.dp))
                                                    .clip(RoundedCornerShape(topStart = 6.dp, topEnd = 6.dp))
                                                    .background(Color(0xFF10B981).copy(alpha = if (isSelected) 1f else 0.8f))
                                            )
                                            Spacer(Modifier.width(2.dp))
                                            // Expense bar (red)
                                            Box(
                                                modifier = Modifier
                                                    .weight(1f)
                                                    .height((130.dp * animatedExpenseRatio).coerceAtLeast(3.dp))
                                                    .clip(RoundedCornerShape(topStart = 6.dp, topEnd = 6.dp))
                                                    .background(MaterialTheme.colorScheme.error.copy(alpha = if (isSelected) 1f else 0.8f))
                                            )
                                        }
                                    }
                                    else -> { // "Net Flow"
                                        val isPositive = bucket.net >= 0
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth(if (isSelected) 0.85f else 0.75f)
                                                .height((130.dp * animatedNetRatio).coerceAtLeast(4.dp))
                                                .clip(RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp))
                                                .background(
                                                    if (isPositive) Color(0xFF10B981).copy(alpha = if (isSelected) 1f else 0.8f)
                                                    else MaterialTheme.colorScheme.error.copy(alpha = if (isSelected) 1f else 0.8f)
                                                )
                                        )
                                    }
                                }
                            }

                            Spacer(Modifier.height(6.dp))

                            // X-axis label
                            Text(
                                text = bucket.label,
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = if (isSelected) FontWeight.ExtraBold else FontWeight.Medium,
                                color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
                                maxLines = 1
                            )
                        }
                    }
                }
            }
        }
    }
}

// =========================================================================
// Formatting Helpers
// =========================================================================

fun currency(amount: Double, settings: UserSettings): String = runCatching {
    val format = NumberFormat.getCurrencyInstance(Locale.forLanguageTag(settings.locale))
    format.currency = Currency.getInstance(settings.currency)
    format.format(amount)
}.getOrElse { "${settings.currencySymbol}${"%,.2f".format(abs(amount))}" }

fun displayDate(value: String, settings: UserSettings): String {
    val date = runCatching { LocalDate.parse(value.take(10)) }.getOrNull() ?: return value
    val pattern = when (settings.dateFormat) {
        "MM/DD/YYYY" -> "MM/dd/yyyy"
        "YYYY-MM-DD" -> "yyyy-MM-dd"
        else -> "dd/MM/yyyy"
    }
    return date.format(DateTimeFormatter.ofPattern(pattern))
}

fun parseColor(value: String?): Color? = value?.takeIf { Regex("^#[0-9A-Fa-f]{6}$").matches(it) }?.let {
    Color(android.graphics.Color.parseColor(it))
}

