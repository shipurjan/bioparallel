import { Stage } from "@pixi/react";

export type AppProps = Stage["props"];
export function App({ children, options, ...props }: AppProps) {
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
            {children}
        </Stage>
    );
}
