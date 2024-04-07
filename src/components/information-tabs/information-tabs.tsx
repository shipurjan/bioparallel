import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IS_DEV_ENVIRONMENT } from "@/lib/utils/const";
import useResizeObserver from "@/lib/hooks/useResizeObserver";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCanvasContext } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { MarkingsStore } from "@/lib/stores/Markings";
import { MarkingsInfo } from "./markings-info/markings-info";
import { DebugInfo } from "./debug-info/debug-info";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const enum TABS {
    MARKINGS = "markings",
    DEBUG = "debug",
}

export function InformationTabs() {
    const { t } = useTranslation();
    const { id } = useCanvasContext();

    const cursorInputRef = useRef<HTMLInputElement>(null);
    const cursor = MarkingsStore(id).use(state => state.cursor);
    const handleCursorButtonClick = () => {
        const cursorValue = cursorInputRef.current?.value;
        if (cursorValue === undefined) return;
        const cursor = Number(cursorValue);

        MarkingsStore(id).actions.cursor.updateCursor(
            cursor > 9999 ? Infinity : cursor
        );
    };

    const initialTab = TABS.MARKINGS;
    const [tableHeight, setTableHeight] = useState(0);

    const ref = useResizeObserver<HTMLDivElement>((target, entry) => {
        const tabpanel = target.querySelector(
            '[role="tabpanel"]'
        ) as HTMLElement | null;
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
                <TabsTrigger value={TABS.MARKINGS}>{t("Markings")}</TabsTrigger>

                {IS_DEV_ENVIRONMENT && (
                    <>
                        <TabsTrigger value={TABS.DEBUG}>
                            {t("Debug")}
                        </TabsTrigger>

                        <div className="relative right-0 flex flex-row">
                            <Input ref={cursorInputRef} type="number" />
                            <Button onClick={handleCursorButtonClick}>
                                Set cursor
                            </Button>
                            <span>Cursor: {cursor}</span>
                        </div>
                    </>
                )}
            </TabsList>
            <TabsContent
                value={TABS.MARKINGS}
                className="w-full overflow-hidden"
            >
                <MarkingsInfo tableHeight={tableHeight} />
            </TabsContent>

            {IS_DEV_ENVIRONMENT && (
                <TabsContent
                    value={TABS.DEBUG}
                    className="w-full overflow-auto"
                >
                    <DebugInfo />
                </TabsContent>
            )}
        </Tabs>
    );
}
