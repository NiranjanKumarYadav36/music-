import React from "react";
import { AnimatePresence } from "framer-motion";
import AmbientGradientBackground from "@/components/background/AmbientGradientBackground";
import LiquidGlassTopNav from "@/components/navigation/LiquidGlassTopNav";

interface StudioLayoutProps {
    children: React.ReactNode;
    activeTab: "studio" | "library";
    onTabChange: (tab: "studio" | "library") => void;
    bottomSlot?: React.ReactNode;
}

const StudioLayout: React.FC<StudioLayoutProps> = ({
    children,
    activeTab,
    onTabChange,
    bottomSlot,
}) => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-violet-500 selection:text-white">
            <AmbientGradientBackground activeTab={activeTab} />

            <div className="relative z-10 flex flex-col min-h-screen">
                <LiquidGlassTopNav
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                />

                <main className={`flex-1 px-6 md:px-12 pt-24 ${bottomSlot ? 'pb-[28rem]' : 'pb-12'}`}>
                    {children}
                </main>

                <div className="fixed bottom-0 left-0 right-0 z-20">
                    <AnimatePresence mode="wait">
                        {bottomSlot}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default StudioLayout;
