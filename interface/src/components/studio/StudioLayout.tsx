import React from "react";
import { AmbientGradientBackground } from "./AmbientGradientBackground";
import { LiquidGlassTopNav } from "./LiquidGlassTopNav";
import { cn } from "@/lib/utils";

interface StudioLayoutProps {
    children: React.ReactNode;
    currentPage: "generate" | "history";
    onPageChange: (page: "generate" | "history") => void;
    isDark?: boolean;
    onThemeToggle?: () => void;
    onLogoClick?: () => void;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({
    children,
    currentPage,
    onPageChange,
    isDark,
    onThemeToggle,
    onLogoClick,
}) => {
    return (
        <div className={cn("min-h-screen relative font-[Poppins] selection:bg-purple-500/30", isDark ? "dark" : "")}>
            {/* Background Layer */}
            <AmbientGradientBackground />

            {/* Floating Navigation */}
            <LiquidGlassTopNav
                currentPage={currentPage}
                onPageChange={onPageChange}
                isDark={isDark}
                onThemeToggle={onThemeToggle}
                onLogoClick={onLogoClick}
            />

            {/* Main Content Scrollable Layer */}
            <main className="relative z-10 w-full pt-32 pb-16 px-6 lg:px-8">
                <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
                    {children}
                </div>
            </main>

            {/* Global CSS for some effects like selection or scrollbar if needed */}
            <style>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
          background-clip: padding-box;
        }
      `}</style>
        </div>
    );
};
