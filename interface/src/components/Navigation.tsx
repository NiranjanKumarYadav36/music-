import { Music, LayoutGrid, Palette, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "./ui/GlassPanel";

interface NavigationProps {
  currentPage: "generate" | "history";
  onPageChange: (page: "generate" | "history") => void;
  isDark: boolean;
  onThemeToggle: () => void;
  onLogoClick: () => void;
}

export function Navigation({
  currentPage,
  onPageChange,
  onThemeToggle,
  onLogoClick,
}: NavigationProps) {
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-fit">
      <GlassPanel className="p-2 flex items-center gap-1">
        {/* Composition Icon/Logo */}
        <button
          onClick={onLogoClick}
          className="group relative p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>

        <div className="w-px h-6 bg-white/10 mx-2" />

        {/* Navigation Items */}
        <nav className="flex items-center gap-1">
          <NavLink
            active={currentPage === "generate"}
            onClick={() => onPageChange("generate")}
            icon={<Palette className="w-4 h-4" />}
            label="Studio"
          />
          <NavLink
            active={currentPage === "history"}
            onClick={() => onPageChange("history")}
            icon={<Music className="w-4 h-4" />}
            label="Library"
          />
        </nav>

        <div className="w-px h-6 bg-white/10 mx-2" />

        {/* System Controls */}
        <button
          onClick={onThemeToggle}
          className="p-3 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </GlassPanel>
    </div>
  );
}

function NavLink({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-500 overflow-hidden",
        active
          ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10"
          : "text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent"
      )}
    >
      <span className={cn(
        "transition-transform duration-500",
        active ? "scale-110" : "scale-100"
      )}>
        {icon}
      </span>
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>

      {/* Active Indicator Glow */}
      {active && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 blur-[2px]" />
      )}
    </button>
  );
}
