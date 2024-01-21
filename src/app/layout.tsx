import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin-ext"] });

export const metadata: Metadata = {
    title: "bioparallel",
    description: "Application for forensic trace comparison",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    console.log("Layout loaded!");
    return (
        <html lang="pl" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div
                        id="app"
                        className="select-none h-full w-full flex flex-col items-center justify-between"
                    >
                        {children}
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
