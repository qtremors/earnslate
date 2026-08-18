package dev.qtremors.earnslate

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import dev.qtremors.earnslate.ui.EmptyState
import dev.qtremors.earnslate.ui.theme.EarnslateTheme
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ComponentsTest {
    @get:Rule val compose = createComposeRule()

    @Test
    fun emptyStateExposesItsMessageAndAction() {
        var clicked = false
        compose.setContent {
            EarnslateTheme {
                EmptyState("No subscriptions yet", "Add subscription") { clicked = true }
            }
        }

        compose.onNodeWithText("No subscriptions yet").assertIsDisplayed()
        compose.onNodeWithText("Add subscription").performClick()
        assertTrue(clicked)
    }
}
