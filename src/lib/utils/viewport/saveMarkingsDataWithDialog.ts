/* eslint-disable no-throw-literal */

import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { save } from "@tauri-apps/plugin-dialog";
import { getVersion } from "@tauri-apps/api/app";
import { t } from "i18next";
import { Viewport } from "pixi-viewport";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { showErrorDialog } from "@/lib/errors/showErrorDialog";
import { InternalMarking, MarkingsStore } from "@/lib/stores/Markings";
import { BaseTexture, Sprite } from "pixi.js";
import { getOppositeCanvasId } from "@/components/pixi/canvas/utils/get-opposite-canvas-id";
import { getCanvas } from "@/components/pixi/canvas/hooks/useCanvas";
import path from "path";

type ImageInfo = {
    name: string | null;
    path: string | null;
    md5: string;
    resolution: {
        width: number;
        height: number;
    };
};

type SoftwareInfo = {
    name: string;
    version: string;
};

type MarkingsExportData = Pick<
    InternalMarking,
    "position" | "type" | "angleRad" | "backgroundColor" | "size" | "textColor"
>[];

type ExportMetadata = {
    utcDate: Date;
    software: SoftwareInfo;
    image: ImageInfo | null;
    comparedImage: ImageInfo | null;
};

type ExportData = {
    markings: MarkingsExportData;
};

export type ExportObject = {
    metadata: ExportMetadata;
    data: ExportData;
};

function getImageData(picture: Sprite | undefined): ImageInfo | null {
    if (picture === undefined) return null;

    // eslint-disable-next-line no-underscore-dangle
    const texture: BaseTexture | undefined = picture?._texture.baseTexture;

    if (texture === undefined)
        throw new Error("Could not find texture for image");

    return {
        name: picture.name,
        // @ts-expect-error custom property should exist
        path: picture.path,
        // @ts-expect-error custom property should exist
        md5: picture.hash,
        resolution: {
            width: texture.width,
            height: texture.height,
        },
    };
}

async function getData(
    viewport: Viewport,
    picture?: Sprite,
    oppositePicture?: Sprite
): Promise<string> {
    const id = viewport.name as CanvasMetadata["id"] | null;
    if (id === null) throw new Error("Canvas ID not found");

    const store = MarkingsStore(id);
    const { markings } = store.state;

    const appVersion = await getVersion();

    const exportObject: ExportObject = {
        metadata: {
            utcDate: new Date(),
            software: {
                name: "bioparallel",
                version: appVersion,
            },
            image: getImageData(picture),
            comparedImage: getImageData(oppositePicture),
        },
        data: {
            markings: markings.map(m => ({
                position: m.position,
                type: m.type,
                angleRad: m.angleRad,
                backgroundColor: m.backgroundColor,
                size: m.size,
                textColor: m.textColor,
            })),
        },
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

export async function saveMarkingsDataWithDialog(viewport: Viewport) {
    try {
        validateViewport(viewport);
    } catch (error) {
        showErrorDialog(error);
        return;
    }

    const picture = (() => {
        try {
            return viewport.getChildAt(0) as Sprite;
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

                return oppositeViewport?.getChildAt(0) as Sprite | undefined;
            } catch {
                return undefined;
            }
        } else {
            return undefined;
        }
    })();

    try {
        const filepath = await save({
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
            defaultPath: `${picture === undefined || picture.name === null ? "marking" : path.parse(picture.name).name}.json`,
        });

        if (filepath === null) throw "cancel";

        const data = await getData(viewport, picture, oppositePicture);
        await writeTextFile(filepath, data);
    } catch (error) {
        if (typeof error === "string" && error === "cancel") return;

        showErrorDialog(error);
    }
}
