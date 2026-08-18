package dev.qtremors.earnslate.data

import androidx.room.Dao
import androidx.room.Database
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.RoomDatabase
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import androidx.room.Upsert
import kotlinx.coroutines.flow.Flow
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class Converters {
    private val json = Json

    @TypeConverter fun cycleToString(value: BillingCycle): String = json.encodeToString(value)
    @TypeConverter fun stringToCycle(value: String): BillingCycle = json.decodeFromString(value)
    @TypeConverter fun transactionTypeToString(value: TransactionType): String = value.name
    @TypeConverter fun stringToTransactionType(value: String): TransactionType = TransactionType.valueOf(value)
}

@Dao
interface TransactionDao {
    @Query("SELECT * FROM transactions ORDER BY date DESC, createdAt DESC")
    fun observeAll(): Flow<List<Transaction>>

    @Query("SELECT * FROM transactions ORDER BY date DESC, createdAt DESC")
    suspend fun all(): List<Transaction>

    @Query("SELECT * FROM transactions WHERE id = :id")
    suspend fun byId(id: String): Transaction?

    @Upsert suspend fun upsert(value: Transaction)
    @Upsert suspend fun upsertAll(values: List<Transaction>)
    @Delete suspend fun delete(value: Transaction)
    @Query("DELETE FROM transactions WHERE id IN (:ids)") suspend fun deleteIds(ids: List<String>)
    @Query("DELETE FROM transactions") suspend fun clear()
}

@Dao
interface BudgetDao {
    @Query("SELECT * FROM budgets ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<Budget>>

    @Query("SELECT * FROM budgets ORDER BY createdAt DESC")
    suspend fun all(): List<Budget>

    @Query("SELECT * FROM budgets WHERE id = :id")
    suspend fun byId(id: String): Budget?

    @Upsert suspend fun upsert(value: Budget)
    @Upsert suspend fun upsertAll(values: List<Budget>)
    @Delete suspend fun delete(value: Budget)
    @Query("DELETE FROM budgets") suspend fun clear()
}

@Dao
interface SubscriptionDao {
    @Query("SELECT * FROM subscriptions ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<Subscription>>

    @Query("SELECT * FROM subscriptions ORDER BY createdAt DESC")
    suspend fun all(): List<Subscription>

    @Query("SELECT * FROM subscriptions WHERE id = :id")
    suspend fun byId(id: String): Subscription?

    @Upsert suspend fun upsert(value: Subscription)
    @Upsert suspend fun upsertAll(values: List<Subscription>)
    @Delete suspend fun delete(value: Subscription)
    @Query("DELETE FROM subscriptions") suspend fun clear()
}

@Dao
interface CategoryDao {
    @Query("SELECT * FROM categories ORDER BY name COLLATE NOCASE")
    fun observeAll(): Flow<List<Category>>

    @Query("SELECT * FROM categories ORDER BY name COLLATE NOCASE")
    suspend fun all(): List<Category>

    @Upsert suspend fun upsert(value: Category)
    @Upsert suspend fun upsertAll(values: List<Category>)
    @Delete suspend fun delete(value: Category)
    @Query("DELETE FROM categories") suspend fun clear()
    @Query("SELECT COUNT(*) FROM categories") suspend fun count(): Int
}

val MIGRATION_1_2 = object : androidx.room.migration.Migration(1, 2) {
    override fun migrate(db: androidx.sqlite.db.SupportSQLiteDatabase) {
        db.execSQL("ALTER TABLE subscriptions ADD COLUMN type TEXT NOT NULL DEFAULT 'expense'")
        db.execSQL("ALTER TABLE subscriptions ADD COLUMN isVariable INTEGER NOT NULL DEFAULT 0")
    }
}

@Database(
    entities = [Transaction::class, Budget::class, Subscription::class, Category::class],
    version = 2,
    exportSchema = false,
)
@TypeConverters(Converters::class)
abstract class EarnslateDatabase : RoomDatabase() {
    abstract fun transactions(): TransactionDao
    abstract fun budgets(): BudgetDao
    abstract fun subscriptions(): SubscriptionDao
    abstract fun categories(): CategoryDao
}
