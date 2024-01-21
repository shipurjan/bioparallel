"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Home() {
    const { theme } = useTheme();
    return (
        <main className="flex w-full h-full min-h-dvh flex-col items-center justify-between">
            <Tabs
                defaultValue="general"
                className="w-full flex flex-col items-center"
            >
                <Button asChild>
                    <Link href="/">Back</Link>
                </Button>
                <TabsList className="w-fit">
                    <TabsTrigger value="general">General</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="w-full px-8">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>General</CardTitle>
                            <CardDescription>
                                Change common settings here
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <DarkModeToggle /> Current theme:{" "}
                            {theme &&
                                theme.slice(0, 1).toUpperCase() +
                                    theme.slice(1)}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
}
