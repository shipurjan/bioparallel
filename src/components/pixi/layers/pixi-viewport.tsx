"use client";

import { PixiComponent, useApp } from "@pixi/react";
import { IViewportOptions, Viewport as PixiViewport } from "pixi-viewport";
import * as PIXI from "pixi.js";
import { ReactNode, forwardRef } from "react";

export type PixiViewportProps = {
    children: ReactNode;
};

export type PixiComponentViewportProps = PixiViewportProps & {
    app: PIXI.Application;
    options: IViewportOptions;
    sideEffects?: (viewport: PixiViewport) => PixiViewport;
};

const PixiViewportComponent = PixiComponent("Viewport", {
    create: ({ app, options, sideEffects }: PixiComponentViewportProps) => {
        const events = new PIXI.EventSystem(app.renderer);
        events.domElement = app.renderer.view as HTMLCanvasElement;

        const viewport = new PixiViewport(options);

        if (sideEffects) {
            sideEffects(viewport);
        }

        return viewport;
    },
    willUnmount: (viewport: PixiViewport) => {
        // eslint-disable-next-line no-param-reassign
        viewport.options.noTicker = true;
        viewport.destroy({ children: true });
    },
});

export type ViewportProps = Omit<PixiComponentViewportProps, "app">;
export const Viewport = forwardRef<PixiViewport, ViewportProps>(
    ({ ...props }: ViewportProps, ref) => {
        const app = useApp();

        return <PixiViewportComponent ref={ref} app={app} {...props} />;
    }
);
