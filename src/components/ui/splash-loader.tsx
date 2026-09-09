"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wordmark } from "@/components/ui/brand-mark";

export function SplashLoader({
  onComplete,
  onFinished,
}: {
  onComplete?: () => void;
  onFinished?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const duration = 2050;
    const startedAt = performance.now();
    let frame = 0;
    let closeTimer = 0;

    const update = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      const eased = elapsed * elapsed * (3 - 2 * elapsed);
      setProgress(Math.min(100, eased * 100));

      if (elapsed < 1) {
        frame = window.requestAnimationFrame(update);
        return;
      }

      setProgress(100);
      onComplete?.();
      closeTimer = window.setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset";
      }, 80);
    };

    frame = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(closeTimer);
      document.body.style.overflow = "unset";
    };
  }, [onComplete]);

  return (
    <AnimatePresence onExitComplete={onFinished}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-white px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full select-none justify-center"
            aria-label={`Loading ${Math.round(progress)} percent`}
          >
            <div className="relative aspect-[10895/2720] w-[min(68vw,280px)] overflow-hidden">
              <Wordmark priority className="absolute inset-0 !h-full !w-full grayscale opacity-[0.09]" />
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `polygon(0 ${Math.min(100, 102 - progress)}%, 18% ${Math.max(0, 99 - progress)}%, 38% ${Math.min(100, 101 - progress)}%, 58% ${Math.max(0, 98.5 - progress)}%, 78% ${Math.min(100, 101.5 - progress)}%, 100% ${Math.max(0, 99 - progress)}%, 100% 100%, 0 100%)`,
                }}
              >
                <Wordmark priority className="absolute inset-0 !h-full !w-full" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
