import { motion } from "framer-motion";

const AmbientGradientBackground = () => {
    return (
        <motion.div
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 0.75, 0.6] }}
            transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            style={{
                background: `
          radial-gradient(circle at 20% 30%, rgba(168,85,247,0.25), transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(34,211,238,0.2), transparent 40%),
          linear-gradient(180deg, #070A12 0%, #0B0F18 100%)
        `,
            }}
        />
    );
};

export default AmbientGradientBackground;
