import * as PIXI from "pixi.js";
import { readFile } from "@tauri-apps/plugin-fs";
import md5 from "md5";

export async function loadSprite(data: string | Uint8Array) {
    const imageBytes = await (async () => {
        if (typeof data === "string") {
            return readFile(data);
        }
        if (data instanceof Uint8Array) return data;

        throw new Error(
            `Sprite could not be loaded because the received data is of unknown type: ${JSON.stringify(
                data
            )}`
        );
    })();

    if (!imageBytes)
        throw new Error("Failed to receive a byte representation of a file");

    const hash = md5(imageBytes);

    const bitmap = await createImageBitmap(new Blob([imageBytes]));
    const sprite = new PIXI.Sprite(PIXI.Texture.from(bitmap));
    // @ts-expect-error custom property
    sprite.hash = hash;
    return sprite;
}
