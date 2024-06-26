"use client";

import "./globals.css";
import "@/lib/locales/i18n";

import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { useAppMount } from "@/lib/hooks/useAppMount";
import { cn } from "@/lib/utils/shadcn";

const inter = Inter({ subsets: ["latin-ext"] });

function Dynamic({ children }: { children: ReactNode }) {
    const hasMounted = useAppMount();

    if (!hasMounted) {
        return null;
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
}

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html
            lang="pl"
            suppressHydrationWarning
            onDragOver={e => {
                e.preventDefault();
            }}
            onDrop={e => {
                e.preventDefault();
            }}
            onContextMenu={e => {
                e.preventDefault();
            }}
            onSelect={e => {
                e.preventDefault();
            }}
        >
            <body className={cn("overflow-x-hidden", inter.className)}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    storageKey="theme"
                    enableColorScheme
                    enableSystem
                    disableTransitionOnChange
                >
                    <div
                        id="app"
                        className="select-none h-full w-full flex flex-col items-center justify-between"
                    >
                        <Dynamic>{children}</Dynamic>
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
