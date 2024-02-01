import * as PIXI from "pixi.js";
import { readFile } from "../filesystem/read-file";

export async function loadSprite(data: string | Uint8Array) {
    const imageBytes = await (async () => {
        if (typeof data === "string") return readFile(data);
        if (data instanceof Uint8Array) return data;

        throw new Error(
            `Sprite could not be loaded because the received data is of unknown type: ${JSON.stringify(
                data
            )}`
        );
    })();

    if (!imageBytes)
        throw new Error("Failed to receive a byte representation of a file");

    const bitmap = await createImageBitmap(new Blob([imageBytes]));
    return new PIXI.Sprite(PIXI.Texture.from(bitmap));
}
