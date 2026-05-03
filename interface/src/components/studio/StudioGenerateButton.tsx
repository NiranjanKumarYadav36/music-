import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StudioGenerateButtonProps {
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
}

const GENERATE = "Generate";
const GENERATING = "Generating";
const SWAP_INTERVAL = 80;

export const StudioGenerateButton: React.FC<StudioGenerateButtonProps> = ({
    onClick,
    disabled,
    isLoading,
    className,
}) => {
    const [displayText, setDisplayText] = useState(GENERATE);

    useEffect(() => {
        const target = isLoading ? GENERATING : GENERATE;
        if (displayText === target) return;

        let i = 0;
        const id = setInterval(() => {
            i++;
            setDisplayText(target.slice(0, i) + (displayText.length > i ? displayText.slice(i) : ""));
            if (i >= target.length) clearInterval(id);
        }, SWAP_INTERVAL);

        return () => clearInterval(id);
    }, [isLoading]);

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled || isLoading}
            whileHover={{ scale: 1.06, y: -2, boxShadow: "0 0 30px rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 450, damping: 15 }}
            className={cn(
                "group relative inline-flex items-center gap-2 pl-3 pr-4 py-2 rounded-full",
                "bg-white text-black text-sm font-semibold tracking-wide",
                isLoading
                    ? "cursor-wait"
                    : "cursor-pointer",
                "disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none",
                className,
            )}
            style={{
                boxShadow: "0 4px 20px rgba(255,255,255,0.08)",
            }}
        >
            {/* Star icon */}
            <svg
                className={cn(
                    "w-4 h-4 shrink-0 transition-transform duration-500",
                    isLoading ? "animate-spin" : "group-hover:rotate-90",
                )}
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M12 2l2.09 6.26L20.18 9l-5 4.09L16.82 20 12 16.54 7.18 20l1.64-6.91L3.82 9l6.09-.74z" />
            </svg>

            {/* Letter-by-letter text */}
            <span className="inline-flex overflow-hidden whitespace-nowrap min-w-[78px]">
                {displayText.split("").map((ch, i) => (
                    <span
                        key={`${i}-${ch}`}
                        className="inline-block animate-[fadeUp_0.18s_ease_forwards]"
                        style={{ animationDelay: `${i * 30}ms` }}
                    >
                        {ch}
                    </span>
                ))}
            </span>
        </motion.button>
    );
};
