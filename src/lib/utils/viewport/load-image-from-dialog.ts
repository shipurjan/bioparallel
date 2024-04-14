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
import { loadSprite } from "./load-sprite";
import { normalizeSpriteSize } from "./normalize-sprite-size";

export function loadImageFromDialog(viewport: Viewport) {
    open({
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
    })
        .then(imageData => {
            if (imageData === null) throw new Error("No image found");
            return imageData;
        })
        .then(imageData => {
            if (viewport.children.length !== 0) {
                return confirm(
                    "Are you sure you want to load this image?\n\nIt will remove the previously loaded image and all existing forensic marks.",
                    {
                        kind: "warning",
                        title: imageData?.name ?? "Are you sure?",
                    }
                ).then(confirmed => {
                    if (!confirmed) throw "cancel";
                    return imageData;
                });
            }
            return imageData;
        })
        .then(({ path }) => loadSprite(path))
        .then(sprite => {
            return normalizeSpriteSize(viewport, sprite);
        })
        .then(sprite => {
            const id = viewport.name as CanvasMetadata["id"] | null;
            if (id === null) throw new Error(`Canvas ID: ${id} not found`);

            if (viewport.children.length !== 0) viewport.removeChildren();
            MarkingsStore(id).actions.markings.reset();
            viewport.addChild(sprite);
            fitWorld(viewport);
            emitFitEvents(viewport);
        })
        .catch(error => {
            if (typeof error === "string" && error === "cancel") return;

            showErrorDialog(error);
        });
}
