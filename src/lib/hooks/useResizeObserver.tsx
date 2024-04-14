import { useLayoutEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

function useResizeObserver<T extends HTMLElement>(
    callback: (target: T, entry: ResizeObserverEntry) => void
) {
    const ref = useRef<T>(null);

    const debouncedCallback = useDebouncedCallback(callback, 25);

    useLayoutEffect(() => {
        const element = ref?.current;

        if (!element) {
            return;
        }

        const observer = new ResizeObserver(entries => {
            debouncedCallback(element, entries[0]!);
        });

        observer.observe(element);

        // eslint-disable-next-line consistent-return
        return () => {
            observer.disconnect();
        };
    }, [debouncedCallback, ref]);

    return ref;
}

export default useResizeObserver;
