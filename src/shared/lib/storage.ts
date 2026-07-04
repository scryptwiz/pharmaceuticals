let mmkvInstance: any;

if (process.env.NODE_ENV === "test") {
  class MockMMKV {
    store = new Map<string, any>();
    set(key: string, value: any) {
      this.store.set(key, String(value));
    }
    getString(key: string) {
      return this.store.get(key) || undefined;
    }
    getNumber(key: string) {
      const val = this.store.get(key);
      return val ? Number(val) : undefined;
    }
    getBoolean(key: string) {
      const val = this.store.get(key);
      return val ? val === "true" : undefined;
    }
    remove(key: string) {
      this.store.delete(key);
    }
    clearAll() {
      this.store.clear();
    }
  }
  mmkvInstance = new MockMMKV();
} else {
  const { createMMKV } = require("react-native-mmkv");

  const SECURE_STORAGE_KEY = "amrutam-app-secure-local-persistence-key";

  mmkvInstance = createMMKV({
    id: "pharmaceuticals-app-storage",
    encryptionKey: SECURE_STORAGE_KEY,
  });
}

export const storage = mmkvInstance;

export const StorageHelpers = {
  setString: (key: string, value: string) => storage.set(key, value),
  getString: (key: string) => storage.getString(key),

  setNumber: (key: string, value: number) => storage.set(key, value),
  getNumber: (key: string) => storage.getNumber(key),

  setBoolean: (key: string, value: boolean) => storage.set(key, value),
  getBoolean: (key: string) => storage.getBoolean(key),

  setObject: <T>(key: string, value: T) =>
    storage.set(key, JSON.stringify(value)),
  getObject: <T>(key: string): T | null => {
    const raw = storage.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[StorageHelpers] Failed to parse key "${key}":`, e);
      return null;
    }
  },

  delete: (key: string) => storage.remove(key),
  clearAll: () => storage.clearAll(),
};
