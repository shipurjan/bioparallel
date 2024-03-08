import {
    useCanvasUpdater,
    useDryCanvasUpdater,
    useThrottledCanvasUpdater,
} from "./CanvasUpdater.store";

class CanvasUpdaterClass {
    /** Updater ktȯry re-renderuje się przy zmianie typu (viewport/app) lub id (left/right) canvasu */
    readonly use = useCanvasUpdater;

    /** Updater ktȯry nigdy się nie re-renderuje */
    readonly useDry = useDryCanvasUpdater;

    /** Updater który re-renderuje się określoną razy na sekundę (np. 60) */
    readonly useThrottled = useThrottledCanvasUpdater;
}

const CanvasUpdater = new CanvasUpdaterClass();
export { CanvasUpdater };
