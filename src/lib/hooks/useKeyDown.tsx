import { useCallback, useEffect } from "react";

const CONTROL_KEY = "Control";
const SHIFT_KEY = "Shift";
const ALT_KEY = "Alt";
const META_KEY = "Meta";

const SPECIAL_KEYS = [CONTROL_KEY, SHIFT_KEY, ALT_KEY, META_KEY];

export const useKeyDown = (
    callback: (event: KeyboardEvent) => void,
    keys: string[]
) => {
    const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (
                keys
                    .filter(key => !SPECIAL_KEYS.includes(key))
                    .every(key => event.key === key)
            ) {
                if (keys.includes(CONTROL_KEY) && !event.ctrlKey) return;
                if (keys.includes(SHIFT_KEY) && !event.shiftKey) return;
                if (keys.includes(ALT_KEY) && !event.altKey) return;
                if (keys.includes(META_KEY) && !event.metaKey) return;

                event.preventDefault();
                callback(event);
            }
        },
        [callback, keys]
    );
    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [onKeyDown]);
};
