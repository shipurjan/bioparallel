"use client";

import { Canvas } from "@/components/pixi/canvas/canvas";
import { LoadListener } from "@/components/load-listener/load-listener";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import Link from "next/link";

export default function Home() {
    return (
        <main className="flex w-full min-h-dvh h-full flex-col items-center justify-between">
            <LoadListener />
            <Button asChild>
                <Link href="/settings">Settings</Link>
            </Button>
            <ResizablePanelGroup
                direction="vertical"
                className="flex-grow rounded-lg border"
            >
                <ResizablePanel defaultSize={75}>
                    <ResizablePanelGroup
                        direction="horizontal"
                        className="rounded-lg border"
                    >
                        <ResizablePanel defaultSize={50}>
                            <div className="flex h-full items-center justify-center">
                                <Canvas />
                            </div>
                        </ResizablePanel>

                        <ResizableHandle />
                        <ResizablePanel defaultSize={50}>
                            <div className="flex h-full items-center justify-center">
                                <Canvas />
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={25}>
                    <ResizablePanelGroup
                        direction="horizontal"
                        className="rounded-lg border"
                    >
                        <ResizablePanel defaultSize={50}>
                            <div className="flex h-full items-center justify-center p-6">
                                <span className="font-semibold">Info1</span>
                            </div>
                        </ResizablePanel>

                        <ResizableHandle />
                        <ResizablePanel defaultSize={50}>
                            <div className="flex h-full items-center justify-center p-6">
                                <span className="font-semibold">Info2</span>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
}
