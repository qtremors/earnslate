// =========================================================================
// EarnSlate Smart SMS Inbox Scanner (100% Offline & Private)
// =========================================================================

package dev.qtremors.earnslate.data

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.provider.Telephony
import androidx.core.content.ContextCompat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlin.math.abs

// -----------------------------------------------------------------------------
// Inbox Scanner for Bank SMS
// -----------------------------------------------------------------------------
object SmsInboxScanner {

    suspend fun scanInbox(
        context: Context,
        daysAgo: Int = 30,
        existingTransactions: List<Transaction> = emptyList(),
    ): List<ParsedSmsTransaction> = withContext(Dispatchers.IO) {
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED) {
            return@withContext emptyList()
        }

        val results = mutableListOf<ParsedSmsTransaction>()
        val seenSignatures = mutableSetOf<String>()
        val cutoffMillis = System.currentTimeMillis() - (daysAgo.toLong() * 24 * 60 * 60 * 1000)

        val projection = arrayOf(
            Telephony.Sms.ADDRESS,
            Telephony.Sms.BODY,
            Telephony.Sms.DATE,
        )
        val selection = "${Telephony.Sms.DATE} >= ?"
        val selectionArgs = arrayOf(cutoffMillis.toString())
        val sortOrder = "${Telephony.Sms.DATE} DESC"

        val resolver = context.contentResolver
        val cursor = runCatching {
            resolver.query(
                Telephony.Sms.Inbox.CONTENT_URI,
                projection,
                selection,
                selectionArgs,
                sortOrder,
            )
        }.getOrNull() ?: return@withContext emptyList()

        cursor.use { c ->
            val addressIdx = c.getColumnIndex(Telephony.Sms.ADDRESS)
            val bodyIdx = c.getColumnIndex(Telephony.Sms.BODY)
            val dateIdx = c.getColumnIndex(Telephony.Sms.DATE)

            while (c.moveToNext()) {
                val sender = if (addressIdx >= 0) c.getString(addressIdx).orEmpty() else ""
                val body = if (bodyIdx >= 0) c.getString(bodyIdx).orEmpty() else ""
                val timestamp = if (dateIdx >= 0) c.getLong(dateIdx) else System.currentTimeMillis()

                val parsed = SmsParser.parse(sender, body, timestamp) ?: continue

                // Check for duplicate signatures within the batch
                val signature = "${parsed.amount}_${parsed.date}_${parsed.type.name}_${parsed.merchant.orEmpty()}"
                if (signature in seenSignatures) continue
                seenSignatures.add(signature)

                // Check for duplicates against existing transactions
                val isDuplicate = existingTransactions.any { existing ->
                    existing.date == parsed.date &&
                        abs(existing.amount) == parsed.amount &&
                        existing.type == parsed.type &&
                        (parsed.merchant == null || existing.description.contains(parsed.merchant, ignoreCase = true) ||
                            parsed.merchant.contains(existing.description, ignoreCase = true))
                }

                if (!isDuplicate) {
                    results.add(parsed)
                }
            }
        }

        results
    }
}
