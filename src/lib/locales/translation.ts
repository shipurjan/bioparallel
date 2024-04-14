import { PRERENDER_RADIUS_OPTIONS, THEMES } from "../stores/GlobalSettings";
import { InternalMarking, Marking } from "../stores/Markings";

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

export type i18nObject = {
    Marking: {
        Name: string;
        Keys: Omit<Recordify<keyof InternalMarking>, "type"> & {
            type: {
                Name: string;
                Keys: Recordify<Marking["type"]>;
            };
        };
    };
    PrerenderingRadius: {
        Name: string;
        Keys: Recordify<PRERENDER_RADIUS_OPTIONS>;
    };
    Theme: {
        Name: string;
        Keys: Recordify<THEMES>;
    };
};

export type i18nTooltip = Recordify<
    | "Lock viewports"
    | "Synchronize viewports with scale"
    | "Save markings data to a JSON file"
    | "Load forensic mark image"
    | "Fit world"
    | "Fit height"
    | "Fit width"
    | "Toggle scale mode"
    | "Toggle marking labels"
>;

export type i18nDescription = Recordify<"Prerendering radius">;
