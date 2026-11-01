import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupportedStorage } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHUNK_SIZE = 1800;
const serverAuthStorage = new Map<string, string>();

function isServerRender() {
  return Platform.OS === 'web' && typeof window === 'undefined';
}

/** SecureStore has a per-value size limit, so split larger auth payloads. */
export const LargeSecureStoreAdapter: SupportedStorage = {
  async getItem(key) {
    if (Platform.OS === 'web') {
      if (isServerRender()) return serverAuthStorage.get(key) ?? null;
      return AsyncStorage.getItem(key);
    }

    const firstChunk = await SecureStore.getItemAsync(`${key}.0`);
    if (firstChunk === null) {
      // Migrate a session written by the previous AsyncStorage adapter.
      const legacyValue = await AsyncStorage.getItem(key);
      if (legacyValue !== null) {
        await this.setItem(key, legacyValue);
        await AsyncStorage.removeItem(key);
      }
      return legacyValue;
    }

    const chunks = [firstChunk];
    for (let index = 1; ; index += 1) {
      const chunk = await SecureStore.getItemAsync(`${key}.${index}`);
      if (chunk === null) break;
      chunks.push(chunk);
    }
    return chunks.join('');
  },
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      if (isServerRender()) serverAuthStorage.set(key, value);
      else await AsyncStorage.setItem(key, value);
      return;
    }

    await this.removeItem(key);
    const chunks = value.match(new RegExp(`.{1,${CHUNK_SIZE}}`, 'gs')) ?? [''];
    await Promise.all(chunks.map((chunk, index) => SecureStore.setItemAsync(`${key}.${index}`, chunk)));
  },
  async removeItem(key) {
    if (Platform.OS === 'web') {
      if (isServerRender()) serverAuthStorage.delete(key);
      else await AsyncStorage.removeItem(key);
      return;
    }

    for (let index = 0; ; index += 1) {
      const chunkKey = `${key}.${index}`;
      if ((await SecureStore.getItemAsync(chunkKey)) === null) break;
      await SecureStore.deleteItemAsync(chunkKey);
    }
    await AsyncStorage.removeItem(key);
  },
};

const configuredUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const configuredApiKey = (
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
)?.trim();

function isValidSupabaseUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function isValidClientApiKey(value: string | undefined): value is string {
  return Boolean(value && (value.startsWith('sb_publishable_') || value.startsWith('eyJ')));
}

const hasSupabaseConfig = isValidSupabaseUrl(configuredUrl) && isValidClientApiKey(configuredApiKey);
if (!hasSupabaseConfig) {
  console.warn('Supabase is not configured. Add the project URL and a publishable (sb_publishable_...) or legacy anon key (eyJ...) to cyberhub/.env to enable authentication.');
}

export const supabase = createClient(
  isValidSupabaseUrl(configuredUrl) ? configuredUrl : 'https://placeholder.supabase.co',
  isValidClientApiKey(configuredApiKey) ? configuredApiKey : 'placeholder-anon-key',
  { auth: { storage: LargeSecureStoreAdapter, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false, flowType: 'pkce' } },
);
