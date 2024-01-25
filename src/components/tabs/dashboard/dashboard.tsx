import { InformationTabs } from "@/components/information-tabs/information-tabs";
import { CanvasContainer } from "@/components/pixi/canvas-container/canvas-container";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CanvasContext, CanvasMetadata } from "@/hooks/useCanvasContext";
import { useMemo } from "react";

export function Dashboard() {
    const leftCanvasMetadata: CanvasMetadata = useMemo(
        () => ({
            id: "left",
        }),
        []
    );

    const rightCanvasMetadata: CanvasMetadata = useMemo(
        () => ({
            id: "right",
        }),
        []
    );

    return (
        <ResizablePanelGroup
            direction="vertical"
            className="flex-grow rounded-lg border"
        >
            <ResizablePanel defaultSize={75} minSize={2}>
                <ResizablePanelGroup
                    direction="horizontal"
                    className="rounded-lg border"
                >
                    <ResizablePanel defaultSize={50} minSize={2}>
                        <div className="flex flex-col h-full w-full items-center justify-center">
                            <CanvasContext.Provider value={leftCanvasMetadata}>
                                <CanvasContainer />
                            </CanvasContext.Provider>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={50} minSize={2}>
                        <div className="flex h-full w-full items-center justify-center">
                            <CanvasContext.Provider value={rightCanvasMetadata}>
                                <CanvasContainer />
                            </CanvasContext.Provider>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={2}>
                <ResizablePanelGroup
                    direction="horizontal"
                    className="rounded-lg border"
                >
                    <ResizablePanel defaultSize={50} minSize={2}>
                        <div className="flex h-full w-full">
                            <CanvasContext.Provider value={leftCanvasMetadata}>
                                <InformationTabs />
                            </CanvasContext.Provider>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />
                    <ResizablePanel defaultSize={50} minSize={2}>
                        <div className="flex h-full w-full">
                            <CanvasContext.Provider value={rightCanvasMetadata}>
                                <InformationTabs />
                            </CanvasContext.Provider>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
