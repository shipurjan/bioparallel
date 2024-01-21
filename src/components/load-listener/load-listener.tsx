"use client";

import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";

export function LoadListener() {
    useEffect(() => {
        const closeSplash = async () => {
            await new Promise(r => {
                setTimeout(r, 10);
            });
            invoke("close_splashscreen_if_exists");
            invoke("show_main_window_if_hidden");
        };
        closeSplash();
    }, []);

    return null;
}
