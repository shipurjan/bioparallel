import { Canvas } from "@/components/pixi/canvas/canvas";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

export function Dashboard() {
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
                        <div className="flex h-full w-full items-center justify-center">
                            <Canvas />
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />
                    <ResizablePanel defaultSize={50} minSize={2}>
                        <div className="flex h-full w-full items-center justify-center">
                            <Canvas />
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
                        <div className="flex h-full w-full items-center justify-center">
                            <span className="font-semibold">Info1</span>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />
                    <ResizablePanel defaultSize={50} minSize={2}>
                        <div className="flex h-full w-full items-center justify-center">
                            <span className="font-semibold">Info2</span>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
