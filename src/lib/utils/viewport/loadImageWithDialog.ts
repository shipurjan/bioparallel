/* eslint-disable no-throw-literal */

import { showErrorDialog } from "@/lib/errors/showErrorDialog";
import { open, confirm } from "@tauri-apps/plugin-dialog";
import { t } from "i18next";
import { Viewport } from "pixi-viewport";
import { MarkingsStore } from "@/lib/stores/Markings";
import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import {
    emitFitEvents,
    fitWorld,
} from "@/components/pixi/canvas/utils/fit-viewport";
import { ShallowViewportStore } from "@/lib/stores/ShallowViewport";
import { CanvasToolbarStore } from "@/lib/stores/CanvasToolbar";
import { CachedViewportStore } from "@/lib/stores/CachedViewport";
import { loadSprite } from "./loadSprite";
import { normalizeSpriteSize } from "./normalizeSpriteSize";

export async function loadImageWithDialog(viewport: Viewport) {
    try {
        const imageData = await open({
            title: t("Load forensic mark image", {
                ns: "tooltip",
            }),
            filters: [
                {
                    name: "Images",
                    extensions: ["png", "jpg", "jpeg", "gif", "bmp", "webp"],
                },
            ],
            directory: false,
            canCreateDirectories: false,
            multiple: false,
        });

        if (imageData === null) throw "cancel";

        const id = viewport.name as CanvasMetadata["id"] | null;
        if (id === null) throw new Error(`Canvas ID: ${id} not found`);

        if (
            viewport.children.length !== 0 ||
            MarkingsStore(id).state.markings.length !== 0
        ) {
            const confirmed = await confirm(
                "Are you sure you want to load this image?\n\nIt will remove the previously loaded image and all existing forensic marks.",
                {
                    kind: "warning",
                    title: imageData?.name ?? "Are you sure?",
                }
            );
            if (!confirmed) throw "cancel";
        }

        const { path } = imageData;
        const sprite = await loadSprite(path);
        const normalizedSprite = normalizeSpriteSize(viewport, sprite);

        if (viewport.children.length !== 0) viewport.removeChildren();

        MarkingsStore(id).actions.markings.reset();
        ShallowViewportStore(id).state.reset();
        CanvasToolbarStore(id).state.reset();
        CachedViewportStore(id).state.reset();

        viewport.addChild(normalizedSprite);

        fitWorld(viewport);
        emitFitEvents(viewport);
    } catch (error) {
        if (typeof error === "string" && error === "cancel") return;

        showErrorDialog(error);
    }
}
