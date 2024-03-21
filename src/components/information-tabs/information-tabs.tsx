import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IS_DEV_ENVIRONMENT } from "@/lib/utils/const";
import useResizeObserver from "@/lib/hooks/useResizeObserver";
import { useState } from "react";
import { MarkingsInfo } from "./markings-info/markings-info";
import { DebugInfo } from "./debug-info/debug-info";

export function InformationTabs() {
    const initialTab = "markings";
    const [tableHeight, setTableHeight] = useState(0);

    const ref = useResizeObserver<HTMLDivElement>((target, entry) => {
        const tabpanel = target.querySelector(
            '[role="tabpanel"]'
        ) as HTMLDivElement | null;
        if (tabpanel === null) return;

        setTableHeight(
            entry.contentRect.height -
                (tabpanel.offsetTop - target.offsetTop) -
                6
        );
    });

    return (
        <Tabs
            ref={ref}
            defaultValue={initialTab}
            className="w-full flex flex-col items-center flex-grow"
        >
            <TabsList className="w-fit">
                <TabsTrigger value="markings">Markings</TabsTrigger>
                {IS_DEV_ENVIRONMENT && (
                    <TabsTrigger value="debug">Debug</TabsTrigger>
                )}
            </TabsList>
            <TabsContent value="markings" className="w-full overflow-hidden">
                <MarkingsInfo tableHeight={tableHeight} />
            </TabsContent>
            {IS_DEV_ENVIRONMENT && (
                <TabsContent value="debug" className="w-full overflow-auto">
                    <DebugInfo />
                </TabsContent>
            )}
        </Tabs>
    );
}
