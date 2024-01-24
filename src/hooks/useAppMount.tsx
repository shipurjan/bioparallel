import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

export const useAppMount = () => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);

        const callback = async () => {
            await new Promise(r => {
                setTimeout(r, 10);
            });
            invoke("close_splashscreen_if_exists");
            invoke("show_main_window_if_hidden");
        };
        callback();
    }, []);

    return hasMounted;
};
