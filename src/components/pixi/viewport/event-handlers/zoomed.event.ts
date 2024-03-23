import { ZoomedEvent } from "pixi-viewport/dist/types";
import { ShallowViewportStore } from "@/lib/stores/ShallowViewport";
import { ViewportHandlerParams } from "./utils";

export const handleZoom = (e: ZoomedEvent, params: ViewportHandlerParams) => {
    // eslint-disable-next-line no-void
    void e;

    const { id, viewport } = params;
    const { setSize: setShallowViewportSize } =
        ShallowViewportStore(id).actions.size;

    setShallowViewportSize({
        screenWorldHeight: viewport.screenWorldHeight,
        screenWorldWidth: viewport.screenWorldWidth,
        worldHeight: viewport.worldHeight,
        worldWidth: viewport.worldWidth,
    });
};
