import { Application, ICanvas } from "pixi.js";
import { useEffect } from "react";
import { useColors } from "./useColors";

export const useThemeController = (app: Application<ICanvas>) => {
    const colors = useColors();

    useEffect(() => {
        // Zmień kolor tła canvasu gdy użytkownik zmieni motyw
        // eslint-disable-next-line no-param-reassign
        app.renderer.background.color = colors.background;
    }, [app.renderer.background, colors.background]);

    return colors;
};
