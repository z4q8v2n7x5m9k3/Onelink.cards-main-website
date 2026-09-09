"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import burgerBazaarMockup from "../../onelink_mockups/hero-burger-bazaar.png";
import velouraSalonMockup from "../../onelink_mockups/hero-veloura-salon.png";
import vastukarMockup from "../../onelink_mockups/hero-vastukar.png";
import newVisionMockup from "../../onelink_mockups/hero-new-vision.png";
import { cn } from "@/lib/utils";

const slides: Array<{
  id: string;
  src: StaticImageData;
  alt: string;
  label: string;
}> = [
  { id: "burger-bazaar", src: burgerBazaarMockup, alt: "Burger Bazaar OneLink restaurant mobile mockup", label: "Burger Bazaar" },
  { id: "veloura-salon", src: velouraSalonMockup, alt: "Veloura Salon OneLink mobile mockup", label: "Veloura Salon" },
  { id: "vastukar", src: vastukarMockup, alt: "Vastukar Architects OneLink mobile mockup", label: "Vastukar Architects" },
  { id: "new-vision", src: newVisionMockup, alt: "New Vision Diagnostics OneLink mobile mockup", label: "New Vision Diagnostics" },
];

export function HeroMockupShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];
  const previousSlide = slides[(activeIndex - 1 + slides.length) % slides.length];
  const nextSlide = slides[(activeIndex + 1) % slides.length];

  return (
    <div className="relative z-40 isolate mx-auto mt-0 max-w-[610px] py-0 sm:-mt-10 sm:py-1 lg:-mt-7 lg:py-0">
      <div className="absolute inset-x-14 top-12 h-36 rounded-full bg-[rgba(0,169,255,0.1)] blur-3xl sm:top-20 sm:h-52" />
      <div className="absolute left-4 top-10 h-20 w-20 rounded-full bg-white/70 blur-2xl sm:left-10 sm:top-12 sm:h-28 sm:w-28" />

      <div className="relative flex flex-col items-stretch">
        <div className="relative flex min-h-[392px] justify-center pb-1 pt-3 sm:min-h-[520px] sm:items-center sm:pb-2 sm:pt-6 lg:min-h-[430px] lg:pb-2 lg:pt-7">
          <div className="pointer-events-none absolute -inset-x-5 top-[58px] z-[3] h-[300px] sm:inset-x-0 sm:top-[64px] sm:h-[330px] lg:top-[48px]" aria-hidden="true">
            <motion.div
              animate={{ rotate: [-8, -6.8, -8], y: [0, -4, 0] }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute -left-[3%] top-12 w-[108px] origin-bottom-right transform-gpu opacity-90 [backface-visibility:hidden] [will-change:transform] sm:left-[3%] sm:top-6 sm:w-[124px] sm:opacity-100 lg:left-[1%] lg:w-[148px] xl:left-[4%]"
            >
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={previousSlide.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 0.94, scale: 0.9 }}
                  exit={{ opacity: 0, scale: 0.94, position: "absolute", inset: 0 }}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  className="transform-gpu [backface-visibility:hidden]"
                >
                  <Image src={previousSlide.src} alt="" sizes="296px" quality={85} loading="eager" className="h-auto w-full object-contain sm:drop-shadow-[0_24px_40px_rgba(12,45,70,0.24)]" />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              animate={{ rotate: [8, 6.8, 8], y: [0, -5, 0] }}
              transition={{ duration: 8.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute -right-[3%] top-12 w-[108px] origin-bottom-left transform-gpu opacity-90 [backface-visibility:hidden] [will-change:transform] sm:right-[3%] sm:top-6 sm:w-[124px] sm:opacity-100 lg:right-[1%] lg:w-[148px] xl:right-[4%]"
            >
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={nextSlide.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 0.94, scale: 0.9 }}
                  exit={{ opacity: 0, scale: 0.94, position: "absolute", inset: 0 }}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  className="transform-gpu [backface-visibility:hidden]"
                >
                  <Image src={nextSlide.src} alt="" sizes="296px" quality={85} loading="eager" className="h-auto w-full object-contain sm:drop-shadow-[0_24px_40px_rgba(12,45,70,0.24)]" />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="absolute inset-x-[18%] bottom-2 h-14 rounded-[50%] bg-[radial-gradient(ellipse,rgba(6,64,131,0.22)_0%,rgba(255,255,255,0.32)_45%,transparent_72%)] blur-lg" />
          </div>

          <div className="relative z-10 flex w-full justify-center [perspective:1200px]">
            <div className="relative w-[205px] sm:w-[270px] lg:w-[296px]">
              <div className="relative aspect-[419/856] w-full overflow-visible rounded-[2.35rem] sm:rounded-[2.55rem]">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={activeSlide.id}
                      className="absolute inset-0 transform-gpu [backface-visibility:hidden] [will-change:transform,opacity]"
                      initial={{ opacity: 0, x: 70, scale: 0.92, rotateY: -18 }}
                      animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, x: -70, scale: 0.92, rotateY: 18 }}
                      transition={{ duration: 0.88, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        className="relative h-full w-full"
                      >
                        <Image
                          src={activeSlide.src}
                          alt={activeSlide.alt}
                          fill
                          priority
                          loading="eager"
                          fetchPriority="high"
                          quality={92}
                          sizes="(max-width: 640px) 432px, (max-width: 1024px) 540px, 592px"
                          className="origin-[center_top] object-contain object-top sm:drop-shadow-[0_34px_74px_rgba(14,30,37,0.18)]"
                        />
                      </motion.div>
                    </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 mx-auto mt-1 hidden w-fit items-center gap-1.5 rounded-full border border-slate-900/[0.08] bg-white/88 px-3 py-2 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.34)] backdrop-blur sm:flex">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn("rounded-full transition-all duration-300", index === activeIndex ? "h-1.5 w-5 bg-[#00A9FF]" : "h-1.5 w-1.5 bg-[#b8c5d1] hover:bg-[#7f93a5]")}
              aria-label={`Show ${slide.label}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
