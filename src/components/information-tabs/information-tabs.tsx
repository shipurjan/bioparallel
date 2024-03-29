import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IS_DEV_ENVIRONMENT } from "@/lib/utils/const";
import { MarkingsInfo } from "./markings-info/markings-info";
import { DebugInfo } from "./debug-info/debug-info";

export function InformationTabs() {
    const initialTab = "markings";

    return (
        <Tabs
            defaultValue={initialTab}
            className="w-full flex flex-col items-center flex-grow"
        >
            <TabsList className="w-fit">
                <TabsTrigger value="markings">Markings</TabsTrigger>
                {IS_DEV_ENVIRONMENT && (
                    <TabsTrigger value="debug">Debug</TabsTrigger>
                )}
            </TabsList>
            <TabsContent value="markings" className="w-full overflow-auto">
                <MarkingsInfo />
            </TabsContent>
            {IS_DEV_ENVIRONMENT && (
                <TabsContent value="debug" className="w-full overflow-auto">
                    <DebugInfo />
                </TabsContent>
            )}
        </Tabs>
    );
}
