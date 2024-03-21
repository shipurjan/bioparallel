import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";
import { GlobalSettingsStore } from "@/lib/stores/GlobalSettings";
import { useEffect } from "react";
import { ICON } from "@/lib/utils/const";
import { Moon, Sun } from "lucide-react";
import { SettingsCard } from "./settings-card";
import { SettingsSwitch } from "./settings-swtich";
import { SettingsRadioGroup } from "./settings-radio-group";
import { SettingsCardTitle } from "./settings-card-title";
import { SettingsCardDescription } from "./settings-card-description";

export function Settings() {
    const { resolvedTheme, setTheme: setNextTheme } = useTheme();

    const { video } = GlobalSettingsStore.use(state => state.settings);

    const actions = GlobalSettingsStore.actions.settings;
    const { setPrerenderRadius } = actions.video;
    const { setTheme } = actions.interface;

    useEffect(() => {
        setTheme(resolvedTheme as "dark" | "light");
    }, [resolvedTheme, setTheme]);

    return (
        <Tabs
            defaultValue="interface"
            className="w-full h-full flex flex-col items-center"
        >
            <TabsList className="w-fit">
                <TabsTrigger value="interface">Interface</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
            </TabsList>

            <TabsContent
                value="interface"
                className="w-full flex justify-center items-start"
            >
                <SettingsCard className="h-full" title="Theme">
                    <SettingsCardTitle>Dark mode</SettingsCardTitle>
                    <SettingsSwitch
                        icon={
                            resolvedTheme === "dark" ? (
                                <Moon
                                    size={ICON.SIZE}
                                    strokeWidth={ICON.STROKE_WIDTH}
                                />
                            ) : (
                                <Sun
                                    size={ICON.SIZE}
                                    strokeWidth={ICON.STROKE_WIDTH}
                                />
                            )
                        }
                        label={resolvedTheme === "dark" ? "On" : "Off"}
                        id="dark_mode"
                        checked={resolvedTheme === "dark"}
                        onCheckedChange={checked => {
                            setNextTheme(checked ? "dark" : "light");
                        }}
                    />
                </SettingsCard>
            </TabsContent>

            <TabsContent
                value="video"
                className="w-full flex justify-center items-start"
            >
                <SettingsCard className="h-full" title="Rendering">
                    <SettingsCardTitle>Prerendering radius</SettingsCardTitle>
                    <SettingsCardDescription>
                        Radius of the area around the viewport that is
                        prerendered. Decreasing this value will improve
                        performance.
                    </SettingsCardDescription>
                    <SettingsRadioGroup
                        value={video.rendering.prerenderRadius}
                        defaultValue={video.rendering.prerenderRadius}
                        onValueChange={value => {
                            setPrerenderRadius(
                                value as typeof video.rendering.prerenderRadius
                            );
                        }}
                    >
                        <RadioGroupItem
                            value="auto"
                            id="prerender_radius_auto"
                            label="Auto (recommended)"
                        />
                        <RadioGroupItem
                            value="none"
                            id="prerender_radius_none"
                            label="None"
                        />
                        <RadioGroupItem
                            value="low"
                            id="prerender_radius_low"
                            label="Low"
                        />
                        <RadioGroupItem
                            value="medium"
                            id="prerender_radius_medium"
                            label="Medium"
                        />
                        <RadioGroupItem
                            value="high"
                            id="prerender_radius_high"
                            label="High"
                        />
                        <RadioGroupItem
                            value="very high"
                            id="prerender_radius_very_high"
                            label="Very high"
                        />
                    </SettingsRadioGroup>
                </SettingsCard>
            </TabsContent>
        </Tabs>
    );
}
