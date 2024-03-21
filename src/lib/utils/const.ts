/* eslint-disable no-shadow */
export const IS_DEV_ENVIRONMENT =
    process && process.env.NODE_ENV === "development";

export const ICON = {
    SIZE: 20,
    STROKE_WIDTH: 1.5,
} as const;

/** https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button */
export const enum MOUSE_BUTTON {
    PRIMARY = 0,
    AUXILIARY = 1,
    SECONDARY = 2,
    BACK = 3,
    FORWARD = 4,
}

/** https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons */
export const enum MOUSE_BUTTONS {
    NONE = 0,
    PRIMARY = 1,
    SECONDARY = 2,
    AUXILIARY = 4,
    BACK = 8,
    FORWARD = 16,
}
