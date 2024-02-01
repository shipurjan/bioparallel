import { Viewport } from "pixi-viewport";
import { useEffect } from "react";

export const useViewportResizer = (
    viewport: Viewport | null,
    width: number,
    height: number
) => {
    useEffect(() => {
        // Zmień rozdzielczość canvasa gdy użytkownik zmieni rozmiar okna
        if (viewport === null) return;
        viewport.resize(width, height);
    }, [width, height, viewport]);
};
