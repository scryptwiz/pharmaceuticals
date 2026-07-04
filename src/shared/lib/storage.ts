import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV({
  id: "pharmaceuticals-app-storage",
});

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
    } catch {
      return null;
    }
  },

  delete: (key: string) => storage.remove(key),
  clearAll: () => storage.clearAll(),
};
