package dev.qtremors.earnslate.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

private val Context.settingsDataStore: DataStore<Preferences> by preferencesDataStore("settings")

@Singleton
class SettingsStore @Inject constructor(@ApplicationContext private val context: Context) {
    private val key = stringPreferencesKey("user_settings")
    private val json = Json { ignoreUnknownKeys = true }

    val settings: Flow<UserSettings> = context.settingsDataStore.data.map { preferences ->
        preferences[key]?.let { runCatching { json.decodeFromString<UserSettings>(it) }.getOrNull() }
            ?: UserSettings()
    }

    suspend fun update(transform: (UserSettings) -> UserSettings) {
        context.settingsDataStore.edit { preferences ->
            val current = preferences[key]
                ?.let { runCatching { json.decodeFromString<UserSettings>(it) }.getOrNull() }
                ?: UserSettings()
            preferences[key] = json.encodeToString(transform(current))
        }
    }

    suspend fun replace(value: UserSettings) {
        context.settingsDataStore.edit { it[key] = json.encodeToString(value) }
    }
}
