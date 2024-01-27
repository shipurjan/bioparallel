import { useCallback, useEffect } from "react";

export const useKeyDown = (
    callback: (event: KeyboardEvent) => void,
    keys: string[]
) => {
    const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const wasAnyKeyPressed = keys.some(key => event.key === key);
            if (wasAnyKeyPressed) {
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
