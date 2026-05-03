import React, { useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

// ─── Geometry helpers ─────────────────────────────────────────────────────────
function getAngle(rect: DOMRect, cx_: number, cy_: number) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(cy_ - cy, cx_ - cx) * (180 / Math.PI);
}

interface NeuralParameterNodeProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    decimals?: number;
    unit?: string;
    hint?: string;
    minLabel?: string;
    maxLabel?: string;
    onChange: (value: number) => void;
}

const NeuralParameterNode: React.FC<NeuralParameterNodeProps> = ({
    label,
    value,
    min,
    max,
    step = 0.1,
    decimals = 1,
    unit = "",
    hint,
    minLabel,
    maxLabel,
    onChange,
}) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * 0.75; // 270-degree arc

    // ─── Refs for direct DOM updates (zero React re-renders during drag) ──────
    const containerRef = useRef<HTMLDivElement>(null);
    const arcRef = useRef<SVGCircleElement>(null);
    const valueRef = useRef<HTMLSpanElement>(null);
    const zoneRef = useRef<HTMLSpanElement>(null);

    // Mutable drag state — lives in refs, never triggers re-render
    const dragging = useRef(false);
    const lastAngle = useRef<number>(0);
    const liveValue = useRef<number>(value);

    // Keep liveValue in sync when prop changes externally (not during drag)
    useEffect(() => {
        if (!dragging.current) {
            liveValue.current = value;
        }
    }, [value]);

    // ─── Clamp + step ─────────────────────────────────────────────────────────
    const clamp = useCallback((v: number): number => {
        const stepped = Math.round(v / step) * step;
        const clamped = Math.max(min, Math.min(max, stepped));
        return parseFloat(clamped.toFixed(decimals + 2));
    }, [min, max, step, decimals]);

    // ─── Direct DOM visual update (runs ~60fps with no React overhead) ─────────
    const paintArc = useCallback((v: number) => {
        const n = Math.max(0, Math.min(1, (v - min) / (max - min)));
        const dash = n * arcLength;
        const gap = circumference - dash;

        arcRef.current?.setAttribute(
            "stroke-dasharray",
            `${dash} ${gap + circumference * 0.25}`
        );

        if (valueRef.current) {
            valueRef.current.textContent = `${v.toFixed(decimals)}${unit}`;
        }

        if (zoneRef.current) {
            if (n < 0.33) {
                zoneRef.current.textContent = minLabel || "Low";
                zoneRef.current.style.color = "#60a5fa";
            } else if (n < 0.67) {
                zoneRef.current.textContent = "Mid";
                zoneRef.current.style.color = "#a78bfa";
            } else {
                zoneRef.current.textContent = maxLabel || "High";
                zoneRef.current.style.color = "#c084fc";
            }
        }
    }, [min, max, arcLength, circumference, decimals, unit, minLabel, maxLabel]);

    // ─── Pointer events (circular-angle physics) ──────────────────────────────
    const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);   // keep tracking off-element
        dragging.current = true;
        liveValue.current = value;
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) lastAngle.current = getAngle(rect, e.clientX, e.clientY);
        if (containerRef.current) containerRef.current.style.cursor = "grabbing";
    }, [value]);

    const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        e.preventDefault();

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const angle = getAngle(rect, e.clientX, e.clientY);
        let delta = angle - lastAngle.current;

        // Wrap-around fix  (e.g. 179° → -180°)
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        lastAngle.current = angle;

        // Map angular delta → value delta
        // Full 270-degree rotation = full range
        const valueDelta = (delta / 270) * (max - min);
        const newVal = clamp(liveValue.current + valueDelta);
        liveValue.current = newVal;

        // Update DOM directly — zero React render cost
        paintArc(newVal);
    }, [min, max, clamp, paintArc]);

    const onPointerUp = useCallback(() => {
        if (!dragging.current) return;
        dragging.current = false;
        if (containerRef.current) containerRef.current.style.cursor = "grab";
        // Commit to React state only once, on release
        onChange(clamp(liveValue.current));
    }, [onChange, clamp]);

    // ─── Initial render values ─────────────────────────────────────────────────
    const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const initDash = normalized * arcLength;
    const initGap = circumference - initDash;

    const zoneStyle = normalized < 0.33
        ? { label: minLabel || "Low", cls: "text-blue-400" }
        : normalized < 0.67
            ? { label: "Mid", cls: "text-violet-400" }
            : { label: maxLabel || "High", cls: "text-purple-400" };

    // Tick marks evenly spaced along the 270-degree arc
    const tickCount = 5;
    const ticks = Array.from({ length: tickCount }, (_, i) => {
        const t = i / (tickCount - 1);
        const deg = 135 + t * 270;
        const rad = (deg * Math.PI) / 180;
        const tr = 48;
        return {
            x: 50 + tr * Math.cos(rad),
            y: 50 + tr * Math.sin(rad),
            active: t <= normalized,
        };
    });

    const gradId = `ng-${label.replace(/\s+/g, "")}`;

    return (
        <div className="flex flex-col items-center select-none group">

            {/* ── Orb ─────────────────────────────────────────────────────── */}
            <motion.div
                ref={containerRef}
                whileHover={{ scale: 1.05 }}
                style={{ cursor: "grab" }}
                className="relative w-28 h-28 flex items-center justify-center touch-none"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            >
                {/* Glass orb background */}
                <div className="absolute inset-0 rounded-full bg-white/[0.04] border border-white/[0.08] group-hover:border-violet-400/30 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-200" />

                {/* SVG Arc */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                    </defs>

                    {/* Rotate group so arc starts at bottom-left (135°) */}
                    <g transform="rotate(135 50 50)">
                        {/* Track */}
                        <circle cx="50" cy="50" r={radius} fill="none"
                            stroke="rgba(255,255,255,0.08)" strokeWidth="5"
                            strokeDasharray={`${arcLength} ${circumference}`}
                            strokeLinecap="round"
                        />
                        {/* Active fill — updated via ref, 0 transition delay during drag */}
                        <circle ref={arcRef} cx="50" cy="50" r={radius} fill="none"
                            stroke={`url(#${gradId})`} strokeWidth="5"
                            strokeDasharray={`${initDash} ${initGap + circumference * 0.25}`}
                            strokeLinecap="round"
                            style={{
                                filter: "drop-shadow(0 0 4px rgba(139,92,246,0.6))",
                                transition: "stroke-dasharray 0.05s linear",
                            }}
                        />
                    </g>

                    {/* Tick marks */}
                    {ticks.map((tick, i) => (
                        <circle key={i} cx={tick.x} cy={tick.y}
                            r={tick.active ? 2 : 1.5}
                            fill={tick.active
                                ? (i === 0 ? "#60a5fa" : i === tickCount - 1 ? "#c084fc" : "#a78bfa")
                                : "rgba(255,255,255,0.08)"}
                        />
                    ))}
                </svg>

                {/* Center text — updated via ref during drag */}
                <div className="relative z-10 flex flex-col items-center gap-0.5 pointer-events-none">
                    <span ref={valueRef}
                        className="text-lg font-semibold text-white tabular-nums leading-none"
                    >
                        {value.toFixed(decimals)}{unit}
                    </span>
                    <span ref={zoneRef}
                        className={`text-[8px] font-semibold uppercase tracking-wider ${zoneStyle.cls}`}
                    >
                        {zoneStyle.label}
                    </span>
                </div>
            </motion.div>

            {/* ── Label block — sits below with fixed gap, never overlaps ──── */}
            <div className="flex flex-col items-center gap-0.5 mt-4 mb-1">
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/40 group-hover:text-white/70 transition-colors duration-200">
                    {label}
                </span>
                {hint && (
                    <span className="text-[9px] text-white/25 font-medium tracking-wide text-center">
                        {hint}
                    </span>
                )}
            </div>

            {/* Min / Max labels */}
            {(minLabel || maxLabel) && (
                <div className="flex items-center justify-between w-28">
                    <span className="text-[8px] text-blue-400/40 font-medium uppercase tracking-wider">
                        {minLabel}
                    </span>
                    <span className="text-[8px] text-purple-400/40 font-medium uppercase tracking-wider">
                        {maxLabel}
                    </span>
                </div>
            )}
        </div>
    );
};

export default NeuralParameterNode;
