import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Global,
    useGlobalSettingsStore,
} from "@/lib/stores/useGlobalSettingsStore";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { SettingsCard } from "./settings-card";
import { SettingsSwitch } from "./settings-swtich";
import { SettingsRadioGroup } from "./settings-radio-group";
import { SettingsCardTitle } from "./settings-card-title";
import { SettingsCardDescription } from "./settings-card-description";

export function Settings() {
    const { resolvedTheme, setTheme: setNextTheme } = useTheme();
    const { setTheme, setPrerenderRadius } = Global;
    const { video } = useGlobalSettingsStore(state => state.settings);

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
                    <SettingsSwitch
                        icon={
                            resolvedTheme === "dark" ? (
                                <MoonIcon />
                            ) : (
                                <SunIcon />
                            )
                        }
                        label="Dark mode"
                        id="dark_mode"
                        checked={resolvedTheme === "dark"}
                        onCheckedChange={checked => {
                            const theme = checked ? "dark" : "light";
                            setTheme(theme);
                            setNextTheme(theme);
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
                        prerendered. <br />
                        Decreasing this value will improve performance.
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
                            label="Auto"
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
