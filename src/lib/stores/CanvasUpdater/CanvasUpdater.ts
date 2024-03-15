import {
    useCanvasUpdater,
    useDryCanvasUpdater,
    useThrottledCanvasUpdater,
} from "./CanvasUpdater.store";

class CanvasUpdaterClass {
    /** Defaultowy updater który re-renderuje gdy zmienia stan */
    readonly use = useCanvasUpdater;

    /** Updater ktȯry nie powoduje re-renderów ale zmienia stan */
    readonly useDry = useDryCanvasUpdater;

    /** Updater który re-renderuje się określoną razy na sekundę (np. 60). Używany np. do informacji debug */
    readonly useThrottled = useThrottledCanvasUpdater;
}

const CanvasUpdater = new CanvasUpdaterClass();
export { CanvasUpdater };
export { type CanvasUpdaterClass };
