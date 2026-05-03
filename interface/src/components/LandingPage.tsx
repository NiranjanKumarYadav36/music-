import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface LandingPageProps {
  onEnterStudio: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterStudio }) => {
  const [currentTime, setCurrentTime] = useState("");
  const [navScrolled, setNavScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Update clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  // Navbar scroll effect + hero parallax
  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 50);

      // Hero parallax
      if (heroRef.current && window.scrollY < 1000) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
        heroRef.current.style.opacity = `${Math.max(0, 1 - window.scrollY / 600)}`;
      }

      // Card parallax CSS vars
      document.querySelectorAll<HTMLElement>(".lp-parallax-up").forEach((el) => {
        el.style.transform = `translateY(${window.scrollY * -0.05}px)`;
      });
      document.querySelectorAll<HTMLElement>(".lp-parallax-down").forEach((el) => {
        el.style.transform = `translateY(${window.scrollY * 0.05}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer for reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("lp-active");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".lp-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-violet-500 selection:text-white scroll-smooth">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-5 mix-blend-overlay"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      {/* ─── Navigation ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled
            ? "py-4 bg-[#050505]/80 backdrop-blur-md border-b border-white/5"
            : "py-8"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <span className="text-2xl font-bold tracking-tighter font-serif">
            SoundSculpt.
          </span>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
              Features
            </a>
            <a href="#works" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
              How It Works
            </a>
            <a href="#craft" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
              Craft
            </a>
          </div>

          <button
            onClick={onEnterStudio}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium bg-white text-black hover:scale-105 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
          >
            Open Studio
          </button>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 bg-[#050505]">
        {/* Background atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-60 mix-blend-screen">
            <img
              src="https://framerusercontent.com/images/9zvwRJAavKKacVyhFCwHyXW1U.png?width=1536&height=1024"
              alt=""
              className="w-full h-full object-cover object-center opacity-80"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#050505] z-10" />
        </div>

        {/* Floating surrealist elements */}
        <div
          className="absolute -left-[10%] top-[-10%] md:left-[-5%] md:top-[-15%] w-[50vw] md:w-[40vw] max-w-[800px] z-10 pointer-events-none mix-blend-hard-light opacity-80"
          style={{ animation: "lp-float-left 12s ease-in-out infinite" }}
        >
          <img
            src="https://framerusercontent.com/images/KNhiA5A2ykNYqNkj04Hk6BVg5A.png?width=1540&height=1320"
            alt=""
            className="w-full h-auto object-contain"
          />
        </div>

        <div
          className="absolute -right-[10%] bottom-[-10%] md:right-[-5%] md:bottom-[-5%] w-[45vw] md:w-[35vw] max-w-[700px] z-10 pointer-events-none mix-blend-hard-light opacity-80"
          style={{ animation: "lp-float-right 14s ease-in-out infinite" }}
        >
          <img
            src="https://framerusercontent.com/images/X89VFCABCEjjZ4oLGa3PjbOmsA.png?width=1542&height=1002"
            alt=""
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Hero content */}
        <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center justify-center h-full">
          <div ref={heroRef} className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1
                className="text-5xl md:text-7xl font-medium leading-[1.1] tracking-tight mb-6 text-[#ffe0e0] mix-blend-overlay font-serif"
                style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}
              >
                SoundSculpt. <br />
                <span className="italic font-light text-[#ffe0e0]">AI music, forged by you.</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className="text-base md:text-lg text-[#ffe0e0]/90 max-w-lg mx-auto mb-16 font-light tracking-wide leading-relaxed mix-blend-overlay"
                style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}
              >
                Describe any sound. Our neural engine composes it in seconds.
                From ambient textures to cinematic scores — your imagination is the only limit.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={onEnterStudio}
                className="relative group cursor-pointer bg-transparent border-0 p-0"
              >
                <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-2 rounded-full flex items-center gap-3 text-xs md:text-sm text-white/80 uppercase tracking-widest hover:bg-white/10 transition-colors duration-300">
                  <span>Enter the Studio</span>
                </div>
              </button>

              <div className="flex items-center gap-4 text-[10px] md:text-xs text-white/40 uppercase tracking-widest mt-8 font-mono">
                <span>{currentTime}</span>
                <span className="w-px h-3 bg-white/20" />
                <span>AI-Powered</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Mission / Features Section ─── */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center lp-reveal">
            <h2 className="text-3xl md:text-5xl lg:text-6xl leading-tight text-white/90 mb-12 font-serif">
              Where words become sound, and sound becomes art.
            </h2>
            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light">
              Type a prompt. Choose a duration. Let our AI compose a unique piece of music — every single time.
              Fine-tune with advanced parameters or let the defaults surprise you.
            </p>
          </div>

          {/* Feature keywords */}
          <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="lp-reveal font-bold text-xl tracking-widest">GENERATE</div>
            <div className="lp-reveal font-bold text-xl tracking-widest" style={{ transitionDelay: "100ms" }}>
              REFINE
            </div>
            <div className="lp-reveal font-bold text-xl tracking-widest" style={{ transitionDelay: "200ms" }}>
              EXPORT
            </div>
            <div className="lp-reveal font-bold text-xl tracking-widest" style={{ transitionDelay: "300ms" }}>
              REPEAT
            </div>
          </div>
        </div>
      </section>

      {/* ─── Cards Section — How It Works ─── */}
      <section id="works" className="py-40 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="lp-reveal mb-32">
            <h2 className="text-5xl md:text-7xl text-center font-serif">
              Sculpt your <br />
              <span className="italic">sonic identity</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1 — Violet accent */}
            <div className="lp-parallax-down">
              <div className="lp-reveal bg-violet-600 rounded-3xl p-8 md:p-12 aspect-4/5 flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.3)] transition-all duration-500 group cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                    <svg
                      className="w-6 h-6 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>
                  <span className="text-black font-medium text-sm border border-black/20 px-3 py-1 rounded-full">
                    01
                  </span>
                </div>

                <div>
                  <h3 className="text-4xl md:text-5xl text-black mb-4 leading-none tracking-tight font-serif">
                    Describe <br />Your Sound
                  </h3>
                  <p className="text-black/70 text-lg leading-snug">
                    Type a text prompt — "epic orchestral battle theme" or "lo-fi jazz rain" — and watch the AI bring it to life.
                  </p>
                </div>

                <div className="w-full h-px bg-black/10 mt-8" />
              </div>
            </div>

            {/* Card 2 — Dark */}
            <div className="lp-parallax-up md:mt-24">
              <div
                className="lp-reveal bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 aspect-4/5 flex flex-col justify-between shadow-2xl group cursor-pointer hover:border-violet-500/50 transition-all duration-500"
                style={{ transitionDelay: "150ms" }}
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <svg
                      className="w-6 h-6 text-white -rotate-45"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <span className="text-white/50 font-medium text-sm border border-white/10 px-3 py-1 rounded-full">
                    02
                  </span>
                </div>

                <div>
                  <h3 className="text-4xl md:text-5xl text-white mb-4 leading-none tracking-tight font-serif">
                    Refine &amp; <br />Perfect
                  </h3>
                  <p className="text-gray-400 text-lg leading-snug">
                    Tweak temperature, sampling, and effects. Re-generate, post-process, and iterate until every note is exactly right.
                  </p>
                </div>

                <div className="w-full h-px bg-white/10 mt-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Background dot pattern */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-20 border-t border-white/5 bg-[#050505] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div className="w-full md:w-auto">
              <h2 className="text-[10vw] leading-[0.8] tracking-tighter text-white/10 font-bold select-none pointer-events-none">
                SOUNDSCULPT.
              </h2>
            </div>

            <div className="flex flex-col gap-8 text-right">
              <button
                onClick={onEnterStudio}
                className="text-gray-400 hover:text-white transition-colors text-right bg-transparent border-0 cursor-pointer text-base"
              >
                Launch Studio →
              </button>
              <p className="text-sm text-gray-600">© {new Date().getFullYear()} SoundSculpt. AI Music Generator.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
