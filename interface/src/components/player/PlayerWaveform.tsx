import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PlayerWaveformProps {
  isPlaying: boolean;
}

export default function PlayerWaveform({ isPlaying }: PlayerWaveformProps) {
  const barCount = 40;
  const [bars, setBars] = useState<number[]>(
    Array.from({ length: barCount }, () => Math.random())
  );

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((h) => {
          const change = (Math.random() - 0.5) * 0.5;
          return Math.max(0.1, Math.min(1, h + change));
        })
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex items-center gap-[2px] h-8 w-full">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="rounded-full w-[3px]"
          animate={{
            height: `${height * 100}%`,
            opacity: isPlaying ? 0.6 + height * 0.4 : 0.15,
          }}
          transition={{ duration: 0.1 }}
          style={{
            backgroundColor:
              i < barCount * 0.3 ? "#a78bfa" : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </div>
  );
}
