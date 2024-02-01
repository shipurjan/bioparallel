import { useEffect } from "react";
import { useUpdater } from "./forceUpdate";

export const useThrottledUpdate = (intervalMs: number) => {
    const forceUpdate = useUpdater();
    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate();
        }, intervalMs);

        return () => clearInterval(interval);
    }, [forceUpdate, intervalMs]);
};
