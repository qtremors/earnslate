package dev.qtremors.earnslate

import dev.qtremors.earnslate.data.AppTheme
import dev.qtremors.earnslate.data.BackupEnvelope
import dev.qtremors.earnslate.data.TransactionType
import kotlinx.serialization.json.Json
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class WebBackupContractTest {
    private val json = Json { ignoreUnknownKeys = true }

    @Test
    fun readsWebBackupFieldAndEnumNames() {
        val backup = json.decodeFromString<BackupEnvelope>(
            """
            {
              "version":"1.1.1",
              "exportDate":"2026-01-01T00:00:00Z",
              "settings":{
                "displayName":"Alex","currency":"USD","currencySymbol":"$",
                "locale":"en-US","dateFormat":"MM/DD/YYYY","theme":"dark",
                "hasCompletedOnboarding":true,"customCategories":[]
              },
              "transactions":[{
                "id":"tx-1","description":"Coffee","amount":-4.5,"category":"Food",
                "date":"2026-01-01","type":"expense","createdAt":"2026-01-01T00:00:00Z"
              }],
              "budgets":[],
              "subscriptions":[]
            }
            """.trimIndent()
        )

        assertEquals(AppTheme.dark, backup.settings?.theme)
        assertEquals(TransactionType.expense, backup.transactions?.single()?.type)
        assertNull(backup.androidAssets)
    }
}
