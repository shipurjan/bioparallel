import { useGlobalSettingsStore } from "@/lib/stores/useGlobalSettingsStore";
import { useEffect, useState } from "react";

function getColor(property: string) {
    return getComputedStyle(document.body).getPropertyValue(property);
}

function getColors() {
    const keys = ["background", "foreground"] as const;
    return keys.reduce((a, key) => {
        const property = `--${key}`;
        return { ...a, [key]: `hsl(${getColor(property)})` };
    }, {}) as Record<(typeof keys)[number], string>;
}

export const useColors = () => {
    const { theme } = useGlobalSettingsStore(state => ({
        theme: state.settings.theme,
    }));

    const [colors, setColors] = useState(getColors());

    useEffect(() => {
        setColors(getColors());
    }, [theme]);

    return colors;
};
