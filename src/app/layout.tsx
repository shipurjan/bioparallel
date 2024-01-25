"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { useAppMount } from "@/hooks/useAppMount";
import { DEFAULT_THEME } from "@/stores/useSettings";

const inter = Inter({ subsets: ["latin-ext"] });

function Dynamic({ children }: { children: ReactNode }) {
    const hasMounted = useAppMount();

    useAppMount();

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
        <html lang="pl" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme={DEFAULT_THEME}
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
