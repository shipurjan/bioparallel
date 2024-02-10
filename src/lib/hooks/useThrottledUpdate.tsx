import { useEffect } from "react";
import { useUpdater } from "./forceUpdate";

export const useThrottledUpdate = (intervalMs?: number) => {
    const forceUpdate = useUpdater();

    useEffect(() => {
        if (intervalMs !== undefined) {
            const interval = setInterval(() => {
                forceUpdate();
            }, intervalMs);

            return () => clearInterval(interval);
        }

        return () => {};
    }, [forceUpdate, intervalMs]);
};
