import React, { useMemo } from 'react';
import { generateCoverData } from '@/lib/generateCover';

interface NeuralCoverProps {
    prompt: string;
    className?: string;
    showTitle?: boolean;
}

export const NeuralCover: React.FC<NeuralCoverProps> = ({ prompt, className = '', showTitle = false }) => {
    const data = useMemo(() => generateCoverData(prompt), [prompt]);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ backgroundColor: '#fcfcfc', background: data.background }}>
            {/* Dynamic Geometric Shapes */}
            {data.shapes.map((shape, i) => (
                <div
                    key={i}
                    style={{
                        ...shape.style,
                        opacity: shape.opacity,
                        mixBlendMode: (shape.style as any).mixBlendMode || 'normal'
                    }}
                    className="pointer-events-none"
                />
            ))}

            {/* Surface Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-0 backdrop-blur-[1px] opacity-10 pointer-events-none z-10" />

            {/* Aesthetic Grain (Inspired by Images) */}
            <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none z-20"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {showTitle && (
                <div className="absolute inset-x-0 bottom-3 flex items-center justify-center z-30">
                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-sm text-center">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/80 line-clamp-1 max-w-[120px]">
                            {prompt}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
