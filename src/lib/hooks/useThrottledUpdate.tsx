import { useEffect, useReducer } from "react";

export const useThrottledUpdate = (intervalMs: number) => {
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate();
        }, intervalMs);

        return () => clearInterval(interval);
    }, [intervalMs]);
};
