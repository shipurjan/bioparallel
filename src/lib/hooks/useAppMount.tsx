import { useGlobalSettingsStore } from "@/lib/stores/useGlobalSettingsStore";
import { invoke } from "@tauri-apps/api/tauri";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const useAppMount = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const { setTheme } = useTheme();
    const { theme } = useGlobalSettingsStore(state => state.settings.design);

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
