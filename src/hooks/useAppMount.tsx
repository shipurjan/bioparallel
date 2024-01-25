import { useSettingsStore } from "@/stores/useSettings";
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
            await new Promise(r => {
                setTimeout(r, 10);
            });
            invoke("close_splashscreen_if_exists");
            invoke("show_main_window_if_hidden");
        };
        callback();
    }, [setTheme, theme]);

    return hasMounted;
};
