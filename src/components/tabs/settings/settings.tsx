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

export function Settings() {
    const { theme } = useTheme();
    return (
        <Tabs
            defaultValue="general"
            className="w-full h-full flex flex-col items-center"
        >
            <TabsList className="w-fit">
                <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="w-full">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>
                            Change common settings here
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <DarkModeToggle data-testid="dark-mode-toggle" />{" "}
                        Current theme:{" "}
                        {theme &&
                            theme.slice(0, 1).toUpperCase() + theme.slice(1)}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
