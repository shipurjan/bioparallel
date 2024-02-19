"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button, ButtonProps } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGlobalSettingsStore } from "@/lib/stores/useGlobalSettingsStore";

export type DarkModeToggleProps = ButtonProps & {
    "data-testid": string | undefined;
};
export function DarkModeToggle({
    "data-testid": dataTestId,
    ...props
}: DarkModeToggleProps) {
    const { setTheme } = useTheme();
    const { setSettings } = useGlobalSettingsStore(state => ({
        setSettings: state.set,
    }));

    const changeTheme = (theme: string) => {
        setTheme(theme);
        setSettings(settings => {
            return { ...settings, theme };
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    data-testid={dataTestId}
                    {...props}
                >
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    data-testid="dark-mode-toggle-item-light"
                    onClick={() => changeTheme("light")}
                >
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    data-testid="dark-mode-toggle-item-dark"
                    onClick={() => changeTheme("dark")}
                >
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    data-testid="dark-mode-toggle-item-system"
                    onClick={() => changeTheme("system")}
                >
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
