import { useSettingsStore } from "@/lib/stores/useSettingsStore";
import { invoke } from "@tauri-apps/api/tauri";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const useAppMount = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const { setTheme } = useTheme();
    const { theme } = useSettingsStore(state => state.settings);

    useEffect(() => {
        setHasMounted(true);
        setTheme(theme);

        const callback = async () => {
            await invoke("close_splashscreen_if_exists");
            await invoke("show_main_window_if_hidden");
        };
        callback();
    }, [setTheme, theme]);

    return hasMounted;
};
