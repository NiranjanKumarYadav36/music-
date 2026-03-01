export const animations = {
    container: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
    },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    glass: {
        initial: { opacity: 0, scale: 0.95, backdropFilter: "blur(0px)" },
        animate: { opacity: 1, scale: 1, backdropFilter: "blur(20px)" },
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export const springConfig = {
    type: "spring",
    stiffness: 260,
    damping: 20
};
