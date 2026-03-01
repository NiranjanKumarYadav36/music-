import React from "react";
import { cn } from "@/lib/utils";

interface AmbientGradientBackgroundProps {
    className?: string;
}

export const AmbientGradientBackground: React.FC<AmbientGradientBackgroundProps> = ({ className }) => {
    return (
        <div className={cn("fixed inset-0 -z-10 overflow-hidden bg-background", className)}>
            {/* Ambient Neural Blobs - Refined for Deep Indigo Black */}
            <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[140px] animate-pulse duration-[8000ms]" />
            <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[140px] animate-pulse [animation-delay:4s] duration-[8000ms]" />

            {/* Micro-Noise Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};
