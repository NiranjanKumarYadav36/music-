import { Music, Sparkles, History, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  currentPage: "generate" | "history";
  onPageChange: (page: "generate" | "history") => void;
  isDark: boolean;
  onThemeToggle: () => void;
  onLogoClick?: () => void;
}

export function Navigation({
  currentPage,
  onPageChange,
  isDark,
  onThemeToggle,
  onLogoClick,
}: NavigationProps) {
  return (
    <nav className={cn(
      "w-full px-6 py-4 border-b backdrop-blur-md sticky top-0 z-50 transition-colors duration-300",
      "border-white/10 dark:border-white/10 border-gray-300",
      "bg-black/30 dark:bg-black/30 bg-white/95 shadow-sm",
      "text-white dark:text-white text-gray-900"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="relative">
            <Music className={cn("w-6 h-6 text-purple-400 dark:text-purple-400")} />
            <Sparkles className={cn("w-3 h-3 text-purple-500 dark:text-purple-500 absolute -top-1 -right-1")} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            MusicGen
          </span>
        </button>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => onPageChange("generate")}
            className={cn(
              "px-4 py-2 rounded-lg transition-all",
              currentPage === "generate"
                ? "bg-white/10 dark:bg-white/10 bg-purple-100 dark:text-white text-purple-700 backdrop-blur-sm shadow-sm"
                : "text-gray-400 dark:text-gray-400 text-gray-700 hover:text-white dark:hover:text-white hover:text-purple-700 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-purple-50"
            )}
          >
            Generate
          </Button>
          <Button
            variant="ghost"
            onClick={() => onPageChange("history")}
            className={cn(
              "px-4 py-2 rounded-lg transition-all flex items-center gap-2",
              currentPage === "history"
                ? "bg-white/10 dark:bg-white/10 bg-pink-100 dark:text-white text-pink-700 backdrop-blur-sm border-b-2 border-pink-500 shadow-sm"
                : "text-gray-400 dark:text-gray-400 text-gray-700 hover:text-white dark:hover:text-white hover:text-pink-700 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-pink-50"
            )}
          >
            <History className="w-4 h-4" />
            History
          </Button>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          className={cn(
            "rounded-lg transition-all",
            "text-gray-400 dark:text-gray-400 text-gray-700",
            "hover:text-white dark:hover:text-white hover:text-purple-700",
            "hover:bg-white/5 dark:hover:bg-white/5 hover:bg-purple-50"
          )}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </nav>
  );
}

