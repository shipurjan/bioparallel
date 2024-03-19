import { Store } from "@tauri-apps/plugin-store";
import { StateStorage } from "zustand/middleware";

export function tauriStorage(store: Store): StateStorage {
    return {
        async removeItem(key: string): Promise<void> {
            await store.delete(key);
            await store.save();
        },
        async getItem(key: string) {
            return store.get(key);
        },
        async setItem(key: string, value: string) {
            await store.set(key, value);
            await store.save();
        },
    };
}
