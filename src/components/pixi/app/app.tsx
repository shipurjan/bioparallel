import { Stage } from "@pixi/react";
import { Viewport } from "@/components/pixi/viewport/viewport";
import { useTheme } from "next-themes";

export type AppProps = Omit<Stage["props"], "children">;
export function App({ options, ...props }: AppProps) {
    const theme = useTheme();

    const backgroundColor = getComputedStyle(document.body).getPropertyValue(
        "--background"
    );
    const defaultOptions: typeof options = {
        background: `hsl(${backgroundColor})`,
        antialias: true,
        autoDensity: true,
        autoStart: true,
        powerPreference: "high-performance",
        resolution: 1,
        ...options,
    };

    return (
        <Stage {...props} options={defaultOptions}>
            <Viewport theme={theme} />
        </Stage>
    );
}
