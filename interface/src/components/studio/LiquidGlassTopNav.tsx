import React from "react";
import { Sparkles, Music, Library, Grid, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiquidGlassTopNavProps {
    currentPage: "generate" | "history";
    onPageChange: (page: "generate" | "history") => void;
    isDark?: boolean;
    onThemeToggle?: () => void;
    className?: string;
    onLogoClick?: () => void;
}

export const LiquidGlassTopNav: React.FC<LiquidGlassTopNavProps> = ({
    currentPage,
    onPageChange,
    isDark,
    onThemeToggle,
    className,
    onLogoClick,
}) => {
    return (
        <nav
            className={cn(
                "fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center p-1.5 px-3 rounded-full border transition-all duration-500",
                "bg-[var(--glass-bg)] border-[var(--glass-border)] backdrop-blur-xl",
                "shadow-[var(--shadow-soft)]",
                className
            )}
        >
            {/* Search / Icon (Left) */}
            <div
                onClick={onLogoClick}
                className="p-3 text-purple-400 cursor-pointer hover:scale-110 transition-transform"
            >
                <Sparkles className="w-5 h-5 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            </div>

            <div className="flex h-10 gap-2 mx-2 border-l border-white/10 pl-2">
                {/* Studio Button */}
                <button
                    onClick={() => onPageChange("generate")}
                    className={cn(
                        "relative px-5 flex items-center gap-2.5 rounded-full text-sm font-medium transition-all duration-300",
                        currentPage === "generate"
                            ? "text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    )}
                >
                    <Music className={cn("w-4 h-4", currentPage === "generate" ? "text-purple-400" : "text-zinc-500")} />
                    Studio
                    {currentPage === "generate" && (
                        <div className="absolute inset-x-4 -bottom-[1.5px] h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                    )}
                </button>

                {/* Library Button */}
                <button
                    onClick={() => onPageChange("history")}
                    className={cn(
                        "relative px-5 flex items-center gap-2.5 rounded-full text-sm font-medium transition-all duration-300",
                        currentPage === "history"
                            ? "text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    )}
                >
                    <Library className={cn("w-4 h-4", currentPage === "history" ? "text-cyan-400" : "text-zinc-500")} />
                    Library
                    {currentPage === "history" && (
                        <div className="absolute inset-x-4 -bottom-[1.5px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                    )}
                </button>
            </div>

            <div className="flex items-center gap-1 ml-1 border-l border-white/10 pl-2">
                {/* Theme Toggle */}
                <button
                    onClick={onThemeToggle}
                    className="p-3 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Apps Icon */}
                <button className="p-3 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    <Grid className="w-4 h-4" />
                </button>
            </div>
        </nav>
    );
};
