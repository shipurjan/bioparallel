type Recordify<T extends string> = { [K in T as `${K}`]: string };

export type i18nKeywords = Recordify<
    | "Homepage"
    | "Settings"
    | "Interface"
    | "Video"
    | "Language"
    | "Markings"
    | "Debug"
    | "Theme"
    | "Rendering"
    | "Prerendering radius"
    | "Dark mode"
    | "On"
    | "Off"
>;

export type i18nCursor = {
    Mode: Recordify<"Selection" | "Marking">;
};

export type i18nMarking = {
    Type: Recordify<"Point" | "Ray">;
    Color: Recordify<"Background" | "Text">;
    Size: string;
};

export type i18nTooltip = Recordify<
    | "Lock viewports"
    | "Synchronize viewports with scale"
    | "Fit world"
    | "Fit height"
    | "Fit width"
    | "Toggle scale mode"
    | "Toggle marking labels"
>;

export type i18nDescription = Recordify<"Prerendering radius">;
