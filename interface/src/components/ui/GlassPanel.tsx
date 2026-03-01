import React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "strong";
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const GlassPanel = ({
    children,
    className,
    variant = "default",
    onClick
}: GlassPanelProps) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "glass-panel rounded-xl",
                variant === "strong" && "glass-panel-strong",
                onClick && "cursor-pointer active:scale-[0.98] transition-transform",
                className
            )}
        >
            {children}
        </div>
    );
};
