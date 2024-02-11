"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "@/components/tabs/dashboard/dashboard";
import { Settings } from "@/components/tabs/settings/settings";
import { useState } from "react";
import { cn } from "@/lib/utils/shadcn";

export default function Home() {
    const initialTab = "dashboard";
    const [currentTab, setCurrentTab] = useState(initialTab);

    return (
        <main
            data-testid="page-container"
            className="flex w-full min-h-dvh h-full flex-col items-center justify-between"
        >
            <button type="button" onClick={() => {}}>
                Button
            </button>
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
                    className={cn("flex flex-col flex-grow w-full", {
                        hidden: currentTab !== "dashboard",
                    })}
                >
                    <Dashboard />
                </TabsContent>
                <TabsContent value="settings" className="w-full">
                    <Settings />
                </TabsContent>
            </Tabs>
        </main>
    );
}
