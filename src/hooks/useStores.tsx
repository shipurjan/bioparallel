import { Store } from "tauri-plugin-store-api";

const settingsStore = new Store(".settings.dat");

export const useStores = () => {
    return { settingsStore };
};
