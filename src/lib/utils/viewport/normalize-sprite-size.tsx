import { Viewport } from "pixi-viewport";
import { Sprite } from "pixi.js";

export const normalizeSpriteSize = (viewport: Viewport, sprite: Sprite) => {
    const scale = viewport.findFit(sprite.width, sprite.height);
    // eslint-disable-next-line no-param-reassign
    sprite.width *= scale;
    // eslint-disable-next-line no-param-reassign
    sprite.height *= scale;

    return sprite;
};
