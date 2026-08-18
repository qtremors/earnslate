@file:OptIn(androidx.compose.material3.ExperimentalMaterial3ExpressiveApi::class)

package dev.qtremors.earnslate.ui.theme




import android.app.Activity
import android.os.Build
import android.provider.Settings
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialExpressiveTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.hapticfeedback.HapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.core.view.WindowCompat
import androidx.compose.ui.graphics.toArgb
import com.materialkolor.hct.Hct
import com.materialkolor.scheme.SchemeTonalSpot
import dev.qtremors.earnslate.data.AppAccent
import dev.qtremors.earnslate.data.AppTheme

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFFD0BCFF),
    secondary = Color(0xFFCCC2DC),
    tertiary = Color(0xFFEFB8C8),
    background = Color(0xFF141318),
    surface = Color(0xFF141318),
    surfaceVariant = Color(0xFF49454F),
    surfaceContainerLowest = Color(0xFF0F0D13),
    surfaceContainerLow = Color(0xFF1D1B20),
    surfaceContainer = Color(0xFF211F26),
    surfaceContainerHigh = Color(0xFF2B2930),
    surfaceContainerHighest = Color(0xFF36343B),
    onSurface = Color(0xFFE6E0E9),
    onBackground = Color(0xFFE6E0E9),
    onSurfaceVariant = Color(0xFFCAC4D0),
    outline = Color(0xFF938F99),
    outlineVariant = Color(0xFF49454F),
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF6750A4),
    secondary = Color(0xFF625B71),
    tertiary = Color(0xFF7D5260),
    background = Color(0xFFFEF7FF),
    surface = Color(0xFFFEF7FF),
    surfaceContainerLowest = Color(0xFFFFFFFF),
    surfaceContainerLow = Color(0xFFF7F2FA),
    surfaceContainer = Color(0xFFF3EDF7),
    surfaceContainerHigh = Color(0xFFECE6F0),
    surfaceContainerHighest = Color(0xFFE6E0E9),
    onSurface = Color(0xFF1D1B20),
    onBackground = Color(0xFF1D1B20),
    onSurfaceVariant = Color(0xFF49454F),
    outline = Color(0xFF79747E),
    outlineVariant = Color(0xFFCAC4D0),
)

private val EarnslateShapes = Shapes(
    extraSmall = RoundedCornerShape(8.dp),
    small = RoundedCornerShape(12.dp),
    medium = RoundedCornerShape(18.dp),
    large = RoundedCornerShape(26.dp),
    extraLarge = RoundedCornerShape(32.dp),
)

val LocalHapticsEnabled = staticCompositionLocalOf { true }
val LocalReducedMotionEnabled = staticCompositionLocalOf { false }


@Composable
fun EarnslateTheme(
    theme: AppTheme = AppTheme.system,
    accent: AppAccent = AppAccent.dynamic,
    hapticsEnabled: Boolean = true,
    content: @Composable () -> Unit
) {
    val systemDark = isSystemInDarkTheme()
    val darkTheme = when (theme) {
        AppTheme.system -> systemDark
        AppTheme.light -> false
        AppTheme.dark, AppTheme.oled -> true
    }
    val context = LocalContext.current
    val colorScheme = when {
        accent == AppAccent.monochrome -> monochromeScheme(darkTheme, theme == AppTheme.oled)
        accent == AppAccent.dynamic && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        accent == AppAccent.dynamic -> if (darkTheme) DarkColorScheme else LightColorScheme
        else -> seededScheme(accent.seedColor(), darkTheme)
    }.let { scheme ->
        if (theme == AppTheme.oled) scheme.copy(
            background = Color.Black,
            surface = Color.Black,
            surfaceContainerLowest = Color.Black,
            surfaceContainerLow = Color(0xFF090909),
            surfaceContainer = Color(0xFF111111),
            surfaceContainerHigh = Color(0xFF191919),
            surfaceContainerHighest = Color(0xFF222222),
        ) else scheme
    }

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = !darkTheme
        }
    }

    val platformHaptics = LocalHapticFeedback.current
    val guardedHaptics = remember(platformHaptics, hapticsEnabled) {
        object : HapticFeedback {
            override fun performHapticFeedback(hapticFeedbackType: HapticFeedbackType) {
                if (hapticsEnabled) platformHaptics.performHapticFeedback(hapticFeedbackType)
            }
        }
    }
    val reducedMotion = remember(context) {
        runCatching {
            Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
        }.getOrDefault(false)
    }
    CompositionLocalProvider(
        LocalHapticFeedback provides guardedHaptics,
        LocalHapticsEnabled provides hapticsEnabled,
        LocalReducedMotionEnabled provides reducedMotion,
    ) {
        MaterialExpressiveTheme(
            colorScheme = colorScheme,
            typography = Typography,
            shapes = EarnslateShapes,
            content = content
        )
    }
}

private fun AppAccent.seedColor(): Color = when (this) {
    AppAccent.purple -> Color(0xFF9C27B0)
    AppAccent.blue -> Color(0xFF2196F3)
    AppAccent.cyan -> Color(0xFF00BCD4)
    AppAccent.teal -> Color(0xFF009688)
    AppAccent.green -> Color(0xFF4CAF50)
    AppAccent.orange -> Color(0xFFFF9800)
    AppAccent.pink -> Color(0xFFE91E63)
    AppAccent.red -> Color(0xFFF44336)
    AppAccent.monochrome -> Color(0xFF757575)
    AppAccent.dynamic -> Color(0xFF6750A4)
}

private fun seededScheme(seed: Color, dark: Boolean): ColorScheme {
    val hct = Hct.fromInt(seed.toArgb())
    val scheme = SchemeTonalSpot(hct, dark, 0.0)
    return if (dark) {
        darkColorScheme(
            primary = Color(scheme.primary),
            onPrimary = Color(scheme.onPrimary),
            primaryContainer = Color(scheme.primaryContainer),
            onPrimaryContainer = Color(scheme.onPrimaryContainer),
            secondary = Color(scheme.secondary),
            onSecondary = Color(scheme.onSecondary),
            secondaryContainer = Color(scheme.secondaryContainer),
            onSecondaryContainer = Color(scheme.onSecondaryContainer),
            tertiary = Color(scheme.tertiary),
            onTertiary = Color(scheme.onTertiary),
            tertiaryContainer = Color(scheme.tertiaryContainer),
            onTertiaryContainer = Color(scheme.onTertiaryContainer),
            background = Color(scheme.background),
            onBackground = Color(scheme.onBackground),
            surface = Color(scheme.surface),
            onSurface = Color(scheme.onSurface),
            surfaceVariant = Color(scheme.surfaceVariant),
            onSurfaceVariant = Color(scheme.onSurfaceVariant),
            outline = Color(scheme.outline),
            outlineVariant = Color(scheme.outlineVariant),
            error = Color(scheme.error),
            onError = Color(scheme.onError),
            errorContainer = Color(scheme.errorContainer),
            onErrorContainer = Color(scheme.onErrorContainer),
            surfaceContainerLowest = Color(scheme.surfaceContainerLowest),
            surfaceContainerLow = Color(scheme.surfaceContainerLow),
            surfaceContainer = Color(scheme.surfaceContainer),
            surfaceContainerHigh = Color(scheme.surfaceContainerHigh),
            surfaceContainerHighest = Color(scheme.surfaceContainerHighest),
        )
    } else {
        lightColorScheme(
            primary = Color(scheme.primary),
            onPrimary = Color(scheme.onPrimary),
            primaryContainer = Color(scheme.primaryContainer),
            onPrimaryContainer = Color(scheme.onPrimaryContainer),
            secondary = Color(scheme.secondary),
            onSecondary = Color(scheme.onSecondary),
            secondaryContainer = Color(scheme.secondaryContainer),
            onSecondaryContainer = Color(scheme.onSecondaryContainer),
            tertiary = Color(scheme.tertiary),
            onTertiary = Color(scheme.onTertiary),
            tertiaryContainer = Color(scheme.tertiaryContainer),
            onTertiaryContainer = Color(scheme.onTertiaryContainer),
            background = Color(scheme.background),
            onBackground = Color(scheme.onBackground),
            surface = Color(scheme.surface),
            onSurface = Color(scheme.onSurface),
            surfaceVariant = Color(scheme.surfaceVariant),
            onSurfaceVariant = Color(scheme.onSurfaceVariant),
            outline = Color(scheme.outline),
            outlineVariant = Color(scheme.outlineVariant),
            error = Color(scheme.error),
            onError = Color(scheme.onError),
            errorContainer = Color(scheme.errorContainer),
            onErrorContainer = Color(scheme.onErrorContainer),
            surfaceContainerLowest = Color(scheme.surfaceContainerLowest),
            surfaceContainerLow = Color(scheme.surfaceContainerLow),
            surfaceContainer = Color(scheme.surfaceContainer),
            surfaceContainerHigh = Color(scheme.surfaceContainerHigh),
            surfaceContainerHighest = Color(scheme.surfaceContainerHighest),
        )
    }
}

private fun monochromeScheme(dark: Boolean, oled: Boolean): ColorScheme =
    if (dark) darkColorScheme(
        primary = Color(0xFFE0E0E0),
        onPrimary = Color(0xFF1A1A1A),
        primaryContainer = Color(0xFF3A3A3A),
        background = if (oled) Color.Black else Color(0xFF121212),
        surface = if (oled) Color.Black else Color(0xFF121212),
        surfaceContainer = Color(0xFF1F1F1F),
        onBackground = Color(0xFFEDEDED),
        onSurface = Color(0xFFEDEDED),
    ) else lightColorScheme(
        primary = Color(0xFF424242),
        onPrimary = Color.White,
        primaryContainer = Color(0xFFE0E0E0),
        background = Color(0xFFFAFAFA),
        surface = Color(0xFFFAFAFA),
        surfaceContainer = Color(0xFFEFEFEF),
        onBackground = Color(0xFF1B1B1B),
        onSurface = Color(0xFF1B1B1B),
    )
