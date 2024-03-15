import { invoke } from "@tauri-apps/api/core";

export const readFile = async (path: string) => {
    const response = await invoke<number[]>("read_file", { path });
    return new Uint8Array(response);
};
