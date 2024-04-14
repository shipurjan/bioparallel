/* eslint-disable no-throw-literal */

import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { save } from "@tauri-apps/plugin-dialog";
import { t } from "i18next";
import { Viewport } from "pixi-viewport";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { showErrorDialog } from "@/lib/errors/showErrorDialog";
import { InternalMarking, MarkingsStore } from "@/lib/stores/Markings";
import { DisplayObject } from "pixi.js";
import { getOppositeCanvasId } from "@/components/pixi/canvas/utils/get-opposite-canvas-id";
import { getCanvas } from "@/components/pixi/canvas/hooks/useCanvas";

type ImageInfo = {
    md5: string;
};

type ExportObject = {
    image: ImageInfo | null;
    comparedImage: ImageInfo | null;
    markings: Pick<InternalMarking, "label" | "position" | "type">[];
};

function getImageData(picture: DisplayObject | undefined): ImageInfo | null {
    return picture === undefined
        ? null
        : {
              // @ts-expect-error custom property should exist
              md5: picture.hash,
          };
}

function getData(
    viewport: Viewport,
    picture?: DisplayObject,
    oppositePicture?: DisplayObject
): string {
    const id = viewport.name as CanvasMetadata["id"] | null;
    if (id === null) throw new Error("Canvas ID not found");

    const store = MarkingsStore(id);

    const { markings } = store.state;

    const exportObject: ExportObject = {
        image: getImageData(picture),
        comparedImage: getImageData(oppositePicture),
        markings: markings.map(m => ({
            label: m.label,
            position: m.position,
            type: m.type,
        })),
    };

    return JSON.stringify(exportObject, null, 2);
}

function validateViewport(viewport: Viewport | null) {
    if (viewport === null) throw new Error(`Viewport is not loaded`);

    const childrenCount = viewport.children.length;
    if (childrenCount > 1)
        throw new Error(
            `Expected to only have one image loaded, but found ${childrenCount} images in viewport '${viewport.name}'`
        );
}

export function saveMarkingsDataToFile(viewport: Viewport) {
    try {
        validateViewport(viewport);
    } catch (error) {
        showErrorDialog(error);
        return;
    }

    const picture = (() => {
        try {
            return viewport.getChildAt(0);
        } catch {
            return undefined;
        }
    })();

    const id = viewport.name as CanvasMetadata["id"] | null;
    const oppositePicture = (() => {
        if (id !== null) {
            const oppositeId = getOppositeCanvasId(id);
            const { viewport: oppositeViewport } = getCanvas(oppositeId, true);
            try {
                validateViewport(oppositeViewport);

                return oppositeViewport?.getChildAt(0);
            } catch {
                return undefined;
            }
        } else {
            return undefined;
        }
    })();

    save({
        title: t("Save markings data to a JSON file", {
            ns: "tooltip",
        }),
        filters: [
            {
                name: "JSON",
                extensions: ["json"],
            },
        ],
        canCreateDirectories: true,
        defaultPath: "marking.json",
    })
        .then(path => {
            if (path === null) throw "cancel";
            const data = getData(viewport, picture, oppositePicture);
            writeTextFile(path, data);
        })
        .catch(error => {
            if (typeof error === "string" && error === "cancel") return;

            showErrorDialog(error);
        });
}
