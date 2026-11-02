"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ClassifiedLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 2400);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="classified-loader"
          role="status"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.65 }}
          className="fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#080508]"
        >
          <div className="classified-grid pointer-events-none absolute inset-0 opacity-30" />

          <motion.div
            initial={{ opacity: 0, scale: 0.65, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-10"
          >
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 10px rgba(255,45,85,0.3))",
                  "drop-shadow(0 0 32px rgba(255,45,85,0.8))",
                  "drop-shadow(0 0 10px rgba(255,45,85,0.3))",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg
                width="120"
                height="140"
                viewBox="0 0 120 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M60 5L108 24V62C108 95 88 119 60 135C32 119 12 95 12 62V24L60 5Z"
                  stroke="#FF2D55"
                  strokeWidth="3"
                />
                <text
                  x="60"
                  y="79"
                  textAnchor="middle"
                  fill="#FF5575"
                  fontSize="35"
                  fontWeight="bold"
                >
                  CA
                </text>
              </svg>
            </motion.div>
          </motion.div>

          <div className="relative z-10 mt-5 text-center">
            <h1 className="text-2xl font-black tracking-[0.2em] text-white sm:text-3xl">
              CYBER <span className="text-[#FF2D55]">ABILASH</span>
            </h1>
            <p className="mt-3 text-[9px] tracking-[0.35em] text-gray-500">
              THINK BEYOND. BUILD SECURE.
            </p>
          </div>

          <div className="relative z-10 mt-12 w-56 max-w-[75vw]">
            <div className="h-[2px] overflow-hidden bg-white/10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.1 }}
                className="h-full bg-[#FF2D55] shadow-[0_0_15px_#FF2D55]"
              />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[9px] tracking-widest">
              <span className="text-gray-500">INITIALIZING SYSTEM</span>
              <span className="animate-pulse text-[#FF5575]">SECURE</span>
            </div>
          </div>

          <p className="absolute bottom-8 text-center text-[8px] tracking-[0.25em] text-gray-600">
            CLASSIFIED ACCESS // AUTHORIZED INTERFACE
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}