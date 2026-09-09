"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSplashComplete } from "@/components/ui/splash-context";

const blueStripText =
  "Smart Business Presence    ✦    Direct WhatsApp    ✦    Easy Payments    ✦    Better Reviews    ✦    Smart Bookings    ✦    Custom QR Assets    ✦    Multi-Location Ready    ✦    ".repeat(4);
const blackStripText =
  "Smart Business Presence    ✦    Direct WhatsApp    ✦    Easy Payments    ✦    Better Reviews    ✦    Smart Bookings    ✦    Custom QR Assets    ✦    Multi-Location Ready    ✦    ".repeat(4);

export function ActionStrip() {
  const splashComplete = useSplashComplete();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 32) setHasScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = splashComplete && hasScrolled;

  return (
    <section className="relative -mt-px h-[148px] overflow-x-clip overflow-y-visible bg-[linear-gradient(180deg,rgba(237,246,255,0)_0%,#edf6ff_38%,#f8fbfd_100%)] sm:h-[166px] sm:bg-[linear-gradient(180deg,rgba(237,246,255,0)_0%,#f4f9fd_44%,#f8fbfd_100%)]" aria-label="OneLink categories">
      <motion.div
        className="absolute left-[-12vw] top-0 h-[148px] w-[124vw] sm:h-[160px]"
        initial={{ opacity: 0, y: 24, scale: 0.99, filter: "blur(5px)" }}
        animate={show ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : { opacity: 0, y: 24, scale: 0.99, filter: "blur(5px)" }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute top-[38px] w-full rotate-[-5deg] overflow-hidden bg-[#08111c] py-3.5 text-white shadow-[0_18px_42px_-30px_rgba(15,23,42,0.7)] sm:top-[44px] sm:py-4">
          <div className="one-marquee-right flex w-max whitespace-pre text-[16px] font-semibold leading-[1.25] tracking-[0.02em] sm:text-[20px]">
            <span className="pr-9">{blackStripText}</span>
            <span className="pr-9">{blackStripText}</span>
          </div>
        </div>
        <div className="absolute top-[38px] w-full rotate-[5deg] overflow-hidden bg-[#00A9FF] py-3.5 text-white shadow-[0_18px_42px_-30px_rgba(0,169,255,0.62)] sm:top-[44px] sm:py-4">
          <div className="one-marquee-left flex w-max items-center whitespace-pre text-[16px] font-semibold leading-[1.25] tracking-[0.02em] sm:text-[20px]">
            <span className="pr-9">{blueStripText}</span>
            <span className="pr-9">{blueStripText}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
