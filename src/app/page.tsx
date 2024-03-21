"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "@/components/tabs/settings/settings";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/shadcn";
import dynamic from "next/dynamic";
import { GlobalToolbar } from "@/components/toolbar/toolbar";

const Dashboard = dynamic(
    () =>
        import("@/components/tabs/dashboard/dashboard").then(
            mod => mod.Dashboard
        ),
    { ssr: false }
);

export default function Home() {
    const initialTab = "dashboard";
    const [currentTab, setCurrentTab] = useState(initialTab);

    useEffect(() => {
        const cleanupCallback = (e: Event) => {
            console.log("cleanup", e);
        };

        document.addEventListener("cleanup", cleanupCallback);

        return () => {
            document.removeEventListener("cleanup", cleanupCallback);
        };
    }, []);

    return (
        <main
            data-testid="page-container"
            className="flex w-full min-h-dvh h-full flex-col items-center justify-between"
        >
            <Tabs
                onValueChange={setCurrentTab}
                defaultValue={initialTab}
                className="w-full flex flex-col items-center flex-grow"
            >
                <TabsList className="w-fit">
                    <TabsTrigger data-testid="dashboard-tab" value="dashboard">
                        Dashboard
                    </TabsTrigger>
                    <TabsTrigger data-testid="settings-tab" value="settings">
                        Settings
                    </TabsTrigger>
                </TabsList>
                <TabsContent
                    forceMount
                    value="dashboard"
                    className={cn(
                        "flex flex-col justify-center items-center flex-grow w-full",
                        {
                            hidden: currentTab !== "dashboard",
                        }
                    )}
                >
                    <GlobalToolbar />
                    <Dashboard />
                </TabsContent>
                <TabsContent value="settings" className="w-full">
                    <Settings />
                </TabsContent>
            </Tabs>
        </main>
    );
}
