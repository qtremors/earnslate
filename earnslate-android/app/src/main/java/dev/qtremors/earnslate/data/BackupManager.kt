package dev.qtremors.earnslate.data

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import androidx.room.withTransaction
import dagger.hilt.android.qualifiers.ApplicationContext
import dev.qtremors.earnslate.BuildConfig
import kotlinx.coroutines.flow.first
import kotlinx.serialization.SerializationException
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.time.Instant
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.max

data class ImportPreview(
    val transactions: Int,
    val budgets: Int,
    val subscriptions: Int,
    val categories: Int,
    val hasTransactions: Boolean,
    val hasBudgets: Boolean,
    val hasSubscriptions: Boolean,
    val hasSettings: Boolean,
)

@Singleton
class IconStore @Inject constructor(@ApplicationContext private val context: Context) {
    private val directory = File(context.filesDir, "custom_icons").apply { mkdirs() }
    private val allowed = setOf("image/svg+xml", "image/png", "image/jpeg", "image/webp")

    fun import(uri: Uri): String {
        val resolver = context.contentResolver
        val mime = resolver.getType(uri)?.lowercase() ?: mimeFromName(uri.lastPathSegment.orEmpty())
        require(mime in allowed) { "Choose an SVG, PNG, JPEG, or WebP image." }
        val raw = resolver.openInputStream(uri)?.use { input ->
            readLimited(input, MAX_INPUT_BYTES, "Icon files must be 5 MB or smaller.")
        } ?: error("Unable to open icon.")

        val name = "${UUID.randomUUID()}.${if (mime == "image/svg+xml") "svg" else "png"}"
        val file = File(directory, name)
        if (mime == "image/svg+xml") {
            val text = raw.toString(Charsets.UTF_8)
            require("<svg" in text && "<script" !in text.lowercase() && "<!entity" !in text.lowercase()) {
                "The SVG is invalid or contains unsupported active content."
            }
            file.writeBytes(raw)
        } else {
            val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
            BitmapFactory.decodeByteArray(raw, 0, raw.size, bounds)
            require(bounds.outWidth > 0 && bounds.outHeight > 0) { "The image could not be decoded." }
            var sample = 1
            while (max(bounds.outWidth, bounds.outHeight) / sample > 512) sample *= 2
            val bitmap = BitmapFactory.decodeByteArray(
                raw, 0, raw.size, BitmapFactory.Options().apply { inSampleSize = sample }
            ) ?: error("The image could not be decoded.")
            file.outputStream().use { bitmap.compress(Bitmap.CompressFormat.PNG, 100, it) }
            bitmap.recycle()
        }
        return file.absolutePath
    }

    fun restore(entityId: String, mime: String, encoded: String): String {
        require(mime in allowed) { "Unsupported custom icon type." }
        val bytes = try {
            Base64.decode(encoded, Base64.DEFAULT)
        } catch (error: IllegalArgumentException) {
            throw IllegalArgumentException("A custom icon contains invalid data.", error)
        }
        require(bytes.size <= MAX_BACKUP_ASSET_BYTES) { "A custom icon is too large to restore." }
        val ext = if (mime == "image/svg+xml") "svg" else "png"
        val file = File(directory, "${entityId}_${UUID.randomUUID()}.$ext")
        return try {
            if (mime == "image/svg+xml") {
                validateSvg(bytes)
                file.writeBytes(bytes)
            } else {
                validateRasterSignature(mime, bytes)
                normalizeRaster(bytes, file)
            }
            file.absolutePath
        } catch (error: Throwable) {
            file.delete()
            throw error
        }
    }

    fun delete(path: String?) {
        path?.let(::File)?.takeIf { it.parentFile == directory }?.delete()
    }

    private fun mimeFromName(name: String): String = when (name.substringAfterLast('.').lowercase()) {
        "svg" -> "image/svg+xml"
        "png" -> "image/png"
        "jpg", "jpeg" -> "image/jpeg"
        "webp" -> "image/webp"
        else -> ""
    }

    private fun validateSvg(bytes: ByteArray) {
        val text = bytes.toString(Charsets.UTF_8)
        val lower = text.lowercase()
        require("<svg" in lower && "<script" !in lower && "<!entity" !in lower &&
            "<foreignobject" !in lower && "javascript:" !in lower && "onload=" !in lower) {
            "A custom SVG is invalid or contains unsupported active content."
        }
    }

    private fun normalizeRaster(bytes: ByteArray, destination: File) {
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeByteArray(bytes, 0, bytes.size, bounds)
        require(bounds.outWidth in 1..MAX_RASTER_DIMENSION && bounds.outHeight in 1..MAX_RASTER_DIMENSION) {
            "A custom image is corrupt or has unsupported dimensions."
        }
        var sample = 1
        while (max(bounds.outWidth, bounds.outHeight) / sample > 512) sample *= 2
        val bitmap = BitmapFactory.decodeByteArray(
            bytes, 0, bytes.size, BitmapFactory.Options().apply { inSampleSize = sample }
        ) ?: error("A custom image could not be decoded.")
        try {
            destination.outputStream().use {
                check(bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)) {
                    "A custom image could not be normalized."
                }
            }
        } finally {
            bitmap.recycle()
        }
    }

    private fun validateRasterSignature(mime: String, bytes: ByteArray) {
        val valid = when (mime) {
            "image/png" -> bytes.size >= 8 &&
                bytes.take(8) == listOf(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A).map(Int::toByte)
            "image/jpeg" -> bytes.size >= 3 &&
                bytes[0] == 0xFF.toByte() && bytes[1] == 0xD8.toByte() && bytes[2] == 0xFF.toByte()
            "image/webp" -> bytes.size >= 12 &&
                bytes.copyOfRange(0, 4).toString(Charsets.US_ASCII) == "RIFF" &&
                bytes.copyOfRange(8, 12).toString(Charsets.US_ASCII) == "WEBP"
            else -> false
        }
        require(valid) { "A custom image does not match its declared file type." }
    }

    companion object {
        const val MAX_INPUT_BYTES = 5 * 1024 * 1024
        const val MAX_BACKUP_ASSET_BYTES = 2 * 1024 * 1024
        const val MAX_TOTAL_BACKUP_ASSET_BYTES = 10 * 1024 * 1024
        const val MAX_RASTER_DIMENSION = 8_192
    }
}

@Singleton
class BackupManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val database: EarnslateDatabase,
    private val settingsStore: SettingsStore,
    private val iconStore: IconStore,
) {
    private val json = Json {
        prettyPrint = true
        ignoreUnknownKeys = true
        explicitNulls = false
        encodeDefaults = true
    }

    suspend fun export(uri: Uri) {
        val snapshot = database.withTransaction {
            BackupSnapshot(
                categories = database.categories().all(),
                subscriptions = database.subscriptions().all(),
                transactions = database.transactions().all(),
                budgets = database.budgets().all(),
            )
        }
        var assetBytes = 0L
        val assets = snapshot.subscriptions.mapNotNull { subscription ->
            subscription.customIconPath?.let(::File)?.takeIf(File::isFile)?.let { file ->
                require(file.length() <= IconStore.MAX_BACKUP_ASSET_BYTES) { "A custom icon is too large to back up." }
                assetBytes += file.length()
                require(assetBytes <= IconStore.MAX_TOTAL_BACKUP_ASSET_BYTES) {
                    "Custom icons exceed the 10 MB backup limit."
                }
                AndroidAsset(
                    entityId = subscription.id,
                    mimeType = if (file.extension.equals("svg", true)) "image/svg+xml" else "image/png",
                    data = Base64.encodeToString(file.readBytes(), Base64.NO_WRAP),
                    fallbackIcon = subscription.icon,
                )
            }
        }
        val portableSubscriptions = snapshot.subscriptions.map {
            if (it.customIconPath == null) it else it.copy(icon = "Image", customIconPath = null)
        }
        val envelope = BackupEnvelope(
            version = BuildConfig.VERSION_NAME,
            exportDate = Instant.now().toString(),
            settings = settingsStore.settings.first().copy(customCategories = snapshot.categories),
            transactions = snapshot.transactions,
            budgets = snapshot.budgets,
            subscriptions = portableSubscriptions,
            androidAssets = assets,
        )
        context.contentResolver.openOutputStream(uri, "wt")?.bufferedWriter()?.use {
            it.write(json.encodeToString(envelope))
        } ?: error("Unable to create backup file.")
    }

    fun read(uri: Uri): BackupEnvelope {
        val text = context.contentResolver.openInputStream(uri)?.use { input ->
            readLimited(input, 25 * 1024 * 1024, "Backup files must be 25 MB or smaller.").toString(Charsets.UTF_8)
        } ?: error("Unable to open backup file.")
        return try {
            json.decodeFromString<BackupEnvelope>(text).also(::validate)
        } catch (error: SerializationException) {
            throw IllegalArgumentException("This is not a valid EarnSlate backup.", error)
        }
    }

    fun preview(envelope: BackupEnvelope) = ImportPreview(
        envelope.transactions?.size ?: 0,
        envelope.budgets?.size ?: 0,
        envelope.subscriptions?.size ?: 0,
        envelope.settings?.customCategories?.size ?: 0,
        envelope.transactions != null,
        envelope.budgets != null,
        envelope.subscriptions != null,
        envelope.settings != null,
    )

    suspend fun import(envelope: BackupEnvelope) {
        validate(envelope)
        val oldTransactions = database.transactions().all()
        val oldBudgets = database.budgets().all()
        val oldSubscriptions = database.subscriptions().all()
        val oldCategories = database.categories().all()
        val oldSettings = settingsStore.settings.first()
        val restoredPaths = mutableListOf<String>()
        try {
            val restoredAssets = envelope.androidAssets.orEmpty().associate { asset ->
                asset.entityId to RestoredAsset(
                    path = iconStore.restore(asset.entityId, asset.mimeType, asset.data).also(restoredPaths::add),
                    fallbackIcon = asset.fallbackIcon,
                )
            }
            database.withTransaction {
                envelope.transactions?.let {
                    database.transactions().clear()
                    database.transactions().upsertAll(it.map { transaction ->
                        transaction.copy(
                            amount = if (transaction.type == TransactionType.expense) {
                                -kotlin.math.abs(transaction.amount)
                            } else kotlin.math.abs(transaction.amount),
                            description = transaction.description.trim(),
                            category = transaction.category.trim(),
                            notes = transaction.notes?.trim(),
                        )
                    })
                }
                envelope.budgets?.let {
                    database.budgets().clear()
                    database.budgets().upsertAll(it)
                }
                envelope.subscriptions?.let { values ->
                    database.subscriptions().clear()
                    database.subscriptions().upsertAll(values.map { value ->
                        val asset = restoredAssets[value.id]
                        value.copy(
                            icon = asset?.fallbackIcon ?: value.icon,
                            customIconPath = asset?.path,
                        )
                    })
                }
                envelope.settings?.customCategories?.let {
                    database.categories().clear()
                    database.categories().upsertAll(it)
                }
            }
            envelope.settings?.let { settingsStore.replace(it) }
            if (envelope.subscriptions != null) {
                val retained = database.subscriptions().all().mapNotNull(Subscription::customIconPath).toSet()
                oldSubscriptions.mapNotNull(Subscription::customIconPath)
                    .filterNot(retained::contains)
                    .forEach(iconStore::delete)
            }
        } catch (error: Throwable) {
            restoredPaths.forEach(iconStore::delete)
            database.withTransaction {
                database.transactions().clear(); database.transactions().upsertAll(oldTransactions)
                database.budgets().clear(); database.budgets().upsertAll(oldBudgets)
                database.subscriptions().clear(); database.subscriptions().upsertAll(oldSubscriptions)
                database.categories().clear(); database.categories().upsertAll(oldCategories)
            }
            settingsStore.replace(oldSettings)
            throw error
        }
    }

    private fun validate(envelope: BackupEnvelope) {
        require(
            envelope.settings != null || envelope.transactions != null ||
                envelope.budgets != null || envelope.subscriptions != null
        ) { "The backup does not contain any restorable EarnSlate data." }
        envelope.transactions?.also { values ->
            unique(values.map(Transaction::id), "transaction")
            values.forEach {
                requireId(it.id); require(it.description.isNotBlank() && it.description.length <= 500)
                require(it.amount.isFinite() && it.amount != 0.0)
                requireDate(it.date)
            }
        }
        envelope.budgets?.also { values ->
            unique(values.map(Budget::id), "budget")
            values.forEach {
                requireId(it.id); require(it.name.isNotBlank() && it.name.length <= 500)
                require(it.limit.isFinite() && it.limit > 0)
                require(it.spent.isFinite() && it.spent >= 0)
                requireCycle(it.period); requireDate(it.periodStartDate); requireColor(it.color)
            }
        }
        envelope.subscriptions?.also { values ->
            unique(values.map(Subscription::id), "subscription")
            values.forEach {
                requireId(it.id); require(it.name.isNotBlank() && it.name.length <= 500)
                require(it.amount.isFinite() && it.amount > 0)
                requireCycle(it.cycle); requireDate(it.nextBilling); requireColor(it.color)
            }
        }
        envelope.settings?.customCategories?.also { values ->
            require(values.isNotEmpty()) { "A backup must contain at least one category." }
            unique(values.map(Category::id), "category")
            require(values.map { it.name.lowercase() }.distinct().size == values.size) { "Duplicate category names." }
            values.forEach {
                requireId(it.id); require(it.name.isNotBlank() && it.name.length <= 100)
                require(it.type in setOf("income", "expense", "both")); requireColor(it.color)
            }
        }
        val subscriptionIds = envelope.subscriptions?.map(Subscription::id)?.toSet().orEmpty()
        envelope.androidAssets?.also { assets ->
            unique(assets.map(AndroidAsset::entityId), "asset")
            require(assets.size <= 100)
            var decodedBytes = 0L
            assets.forEach {
                require(it.entityId in subscriptionIds)
                require(it.mimeType in setOf("image/svg+xml", "image/png", "image/jpeg", "image/webp"))
                require(it.data.length <= 3 * 1024 * 1024)
                require(it.fallbackIcon == null || it.fallbackIcon.isNotBlank() && it.fallbackIcon.length <= 100)
                val estimatedBytes = (it.data.length.toLong() * 3L) / 4L
                require(estimatedBytes <= IconStore.MAX_BACKUP_ASSET_BYTES)
                decodedBytes += estimatedBytes
                require(decodedBytes <= IconStore.MAX_TOTAL_BACKUP_ASSET_BYTES) {
                    "Custom icons exceed the 10 MB restore limit."
                }
            }
        }
    }

    private fun requireId(id: String) = require(id.isNotBlank() && id.length <= 100) { "Invalid record ID." }
    private fun requireDate(date: String) = require(parseDate(date) != null) { "Invalid date: $date" }
    private fun requireCycle(cycle: BillingCycle) = require(cycle.count in 1..10_000) { "Invalid billing cycle." }
    private fun requireColor(color: String?) = require(color == null || Regex("^#[0-9A-Fa-f]{6}$").matches(color)) { "Invalid color." }
    private fun unique(ids: List<String>, label: String) =
        require(ids.size == ids.toSet().size) { "Duplicate $label IDs." }

    private data class RestoredAsset(val path: String, val fallbackIcon: String?)

    private data class BackupSnapshot(
        val categories: List<Category>,
        val subscriptions: List<Subscription>,
        val transactions: List<Transaction>,
        val budgets: List<Budget>,
    )
}

fun csv(headers: List<String>, rows: List<List<Any?>>): String {
    fun escape(value: Any?): String {
        val raw = value?.toString().orEmpty()
        return if (raw.any { it == ',' || it == '"' || it == '\n' || it == '\r' })
            "\"${raw.replace("\"", "\"\"")}\"" else raw
    }
    return (listOf(headers) + rows).joinToString("\r\n") { row ->
        row.joinToString(",") { value -> escape(value) }
    }
}

private fun readLimited(input: InputStream, maximum: Int, error: String): ByteArray {
    val output = ByteArrayOutputStream(minOf(maximum, 64 * 1024))
    val buffer = ByteArray(16 * 1024)
    var total = 0
    while (true) {
        val count = input.read(buffer)
        if (count < 0) break
        total += count
        require(total <= maximum) { error }
        output.write(buffer, 0, count)
    }
    return output.toByteArray()
}
