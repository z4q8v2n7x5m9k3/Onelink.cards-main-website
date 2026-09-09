"use client";

import Link from "next/link";
import { navItems, siteConfig } from "@/content/site";
import { Wordmark } from "@/components/ui/brand-mark";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSplashComplete } from "@/components/ui/splash-context";
import BorderGlow from "@/components/ui/BorderGlow";

export function Navbar() {
  const splashComplete = useSplashComplete();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    "Hello OneLink, I want to discuss OneLink for my business.",
  )}`;
  const callHref = `tel:+${siteConfig.contact.whatsappNumber}`;
  const instagramHref = "https://www.instagram.com/onelinkcards";

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={cn("fixed inset-x-0 top-3 z-[100] sm:top-4", !splashComplete && "pointer-events-none")}>
      <motion.div
        initial={false}
        animate={splashComplete ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -10, scale: 0.985 }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "mx-auto w-[calc(100%-24px)] max-w-[1200px] overflow-hidden border border-white/75 bg-white/62 shadow-[0_16px_38px_rgba(15,23,42,0.13),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl transition-[border-radius,background-color] duration-300 sm:w-[90%] lg:rounded-full lg:bg-white/56",
          isMenuOpen ? "rounded-[22px]" : "rounded-[18px] sm:rounded-[22px]",
        )}
      >
        <div className="grid min-h-[60px] grid-cols-[1fr_auto] items-center gap-3 px-4 py-2 sm:min-h-[66px] sm:px-6 lg:grid-cols-[minmax(180px,1fr)_auto_minmax(280px,1fr)] lg:gap-8">
          <Link href="/" aria-label="OneLink home" className="group flex min-w-0 shrink-0 flex-col items-start justify-center">
            <Wordmark priority className="!h-auto !w-[106px] transition-transform duration-300 group-hover:scale-[1.025] sm:!w-[124px]" />
            <span className="mt-0.5 pl-[2px] text-[6.5px] font-extrabold uppercase leading-none tracking-[0.17em] text-[#718096] sm:text-[7.5px]">
              Smart Business Page
            </span>
          </Link>

          <div className="hidden items-center justify-center lg:flex">
            <nav className="flex items-center gap-8 text-[13px] font-semibold text-[#263548] xl:gap-11 xl:text-[14px]">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative tracking-[-0.01em] transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:rounded-full after:bg-[#00A9FF] after:transition hover:text-[var(--foreground)] hover:after:origin-left hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2">
            <a href={whatsappHref} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-[#25D366]/20 bg-white text-[#25D366] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f4fff8] lg:hidden">
              <Icon name="whatsapp" className="h-5 w-5" />
            </a>
            <a href={instagramHref} target="_blank" rel="noreferrer" aria-label="Follow OneLink on Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-[#e1306c]/30 bg-[linear-gradient(145deg,#ffffff_35%,#fff1f7_100%)] text-[#e1306c] shadow-[0_10px_24px_-16px_rgba(225,48,108,0.75)] transition hover:-translate-y-0.5 hover:border-[#e1306c]/55 hover:shadow-[0_14px_28px_-16px_rgba(225,48,108,0.9)] lg:h-11 lg:w-11">
              <Image src="/integration-logos/instagram.png" alt="" width={24} height={24} className="h-5 w-5 object-contain" />
            </a>
            <div className="hidden lg:block">
              <BorderGlow className="!w-[154px]" backgroundColor="#008cf5" borderRadius={999} colors={["#ffffff", "#7de3ff", "#00a9ff"]}>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 items-center justify-between gap-3 whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#00A9FF_0%,#0077FF_100%)] py-1 pl-5 pr-1 text-[14px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(0,135,225,0.5)] transition hover:-translate-y-0.5 hover:brightness-110"
                >
                  <span>Book Demo</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#25D366]">
                    <Icon name="whatsapp" className="h-[17px] w-[17px]" />
                  </span>
                </a>
              </BorderGlow>
            </div>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group flex h-10 w-10 items-center justify-center rounded-[12px] border border-black/8 bg-white text-[#151515] shadow-sm transition-all active:scale-95 lg:hidden"
              aria-label="Toggle Menu"
            >
              <div className="relative flex h-5 w-5 flex-col items-center justify-center">
                <span className={cn(
                  "absolute h-[2.5px] w-5 rounded-full bg-current transition-all duration-300 origin-center",
                  isMenuOpen ? "rotate-45" : "-translate-y-[6px]"
                )} />
                <span className={cn(
                  "absolute h-[2.5px] w-5 rounded-full bg-current transition-all duration-200",
                  isMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                )} />
                <span className={cn(
                  "absolute h-[2.5px] w-5 rounded-full bg-current transition-all duration-300 origin-center",
                  isMenuOpen ? "-rotate-45" : "translate-y-[6px]"
                )} />
              </div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -8 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-black/[0.06] bg-white lg:hidden"
            >
              <nav className="flex flex-col gap-1 p-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between rounded-[12px] px-4 py-3.5 text-[15px] font-semibold text-[#151515] transition-colors hover:bg-[#f3f9fd] active:bg-[#eaf5fb]"
                  >
                    <span>{item.label}</span>
                    <Icon name="chevron-right" className="h-4 w-4 text-[#9ca3af]" />
                  </Link>
                ))}
                <div className="mt-2 border-t border-black/5 p-2 pt-4">
                  <p className="mb-3 text-[12px] font-bold uppercase tracking-widest text-[#9ca3af]">Talk to our team</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={callHref}
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-black/6 bg-white px-3.5 py-3 shadow-sm"
                    >
                      <Icon name="phone" className="h-5 w-5 text-[#111827]" />
                      <span className="text-[14px] font-bold text-[#151515]">Call Now</span>
                    </a>
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
