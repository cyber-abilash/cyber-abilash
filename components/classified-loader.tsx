"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX, FastForward } from "lucide-react";
import { sound } from "@/lib/audio/sound-synthesizer";
import { useReducedMotionPreference } from "@/lib/motion";

const BOOT_LOGS = [
  "INITIALIZING SECURITY SUBSYSTEMS...",
  "ESTABLISHING ENCRYPTED LINK // TLS 1.3 / AES-256...",
  "SCANNING THREAT DETECTION PROTOCOLS...",
  "CLEARANCE VERIFIED: TOP SECRET // CLASSIFIED...",
  "ACCESS GRANTED: OPERATOR ABILASH S. INITIALIZED.",
];

export default function ClassifiedLoader() {
  const [visible, setVisible] = useState(true);
  const [logIndex, setLogIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [soundActive, setSoundActive] = useState(false);

  const reducedMotion = useReducedMotionPreference();
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const handleComplete = useCallback(() => {
    sound.playAccessGranted();
    setVisible(false);
  }, []);

  const handleSkip = useCallback(() => {
    // Clear any running timers
    timerRef.current.forEach((t) => clearTimeout(t));
    handleComplete();
  }, [handleComplete]);

  const toggleSound = () => {
    const nextState = !soundActive;
    setSoundActive(nextState);
    sound.setEnabled(nextState);
  };

  useEffect(() => {
    // If user prefers reduced motion, fast-track entrance
    if (reducedMotion) {
      const quickTimer = setTimeout(handleComplete, 400);
      return () => clearTimeout(quickTimer);
    }

    const intervalTime = 420;
    const totalSteps = BOOT_LOGS.length;

    // Step through boot messages
    for (let i = 1; i < totalSteps; i++) {
      const stepTimer = setTimeout(() => {
        setLogIndex(i);
        setProgress(Math.round(((i + 1) / totalSteps) * 100));
        sound.playBootStep();
      }, i * intervalTime);
      timerRef.current.push(stepTimer);
    }

    // Auto complete after final step
    const finalTimer = setTimeout(() => {
      setProgress(100);
      handleComplete();
    }, totalSteps * intervalTime + 350);
    timerRef.current.push(finalTimer);

    // Keyboard shortcut: Escape to skip intro
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const activeTimers = timerRef.current;
    return () => {
      activeTimers.forEach((t) => clearTimeout(t));
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [reducedMotion, handleComplete, handleSkip]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="classified-boot-loader"
          role="status"
          aria-live="polite"
          aria-label="Classified Security Interface Boot Sequence"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050508]"
        >
          {/* Classified Grid Background */}
          <div className="classified-grid pointer-events-none absolute inset-0 opacity-25" />

          {/* Top Controls: Sound Toggle & Skip */}
          <div className="absolute right-6 top-6 z-20 flex items-center gap-3">
            <button
              onClick={toggleSound}
              type="button"
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-wider transition ${
                soundActive
                  ? "border-[#FF2D55] bg-[#FF2D55]/15 text-[#FF2D55]"
                  : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white"
              }`}
              title="Toggle Synthesized Audio Feedback"
            >
              {soundActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{soundActive ? "AUDIO: ON" : "AUDIO: OFF"}</span>
            </button>

            <button
              onClick={handleSkip}
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] tracking-wider text-gray-400 transition hover:border-[#FF2D55]/60 hover:text-white"
              title="Press Escape to Skip Intro"
            >
              <FastForward size={13} />
              <span>SKIP [ESC]</span>
            </button>
          </div>

          {/* Glowing Shield Monogram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="relative z-10"
          >
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 12px rgba(255,45,85,0.3))",
                  "drop-shadow(0 0 38px rgba(255,45,85,0.75))",
                  "drop-shadow(0 0 12px rgba(255,45,85,0.3))",
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                width="110"
                height="130"
                viewBox="0 0 120 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M60 5L108 24V62C108 95 88 119 60 135C32 119 12 95 12 62V24L60 5Z"
                  stroke="#FF2D55"
                  strokeWidth="3.2"
                />
                <text
                  x="60"
                  y="78"
                  textAnchor="middle"
                  fill="#FF5575"
                  fontSize="34"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  CA
                </text>
              </svg>
            </motion.div>
          </motion.div>

          {/* Identity Branding */}
          <div className="relative z-10 mt-6 text-center">
            <h1 className="text-2xl font-black tracking-[0.25em] text-white sm:text-3xl">
              CYBER <span className="text-[#FF2D55]">ABILASH</span>
            </h1>
            <p className="mt-2 font-mono text-[9px] tracking-[0.35em] text-gray-500">
              CLASSIFIED V3 // CYBERSECURITY COMMAND
            </p>
          </div>

          {/* Sequential Terminal Log Feed */}
          <div className="relative z-10 mt-8 h-8 w-80 max-w-[85vw] text-center">
            <motion.p
              key={logIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="font-mono text-[10px] tracking-widest text-[#FF5575]"
            >
              <span className="text-gray-600 mr-2">&gt;_</span>
              {BOOT_LOGS[logIndex]}
            </motion.p>
          </div>

          {/* Progress Bar & Percentage Dial */}
          <div className="relative z-10 mt-6 w-64 max-w-[80vw]">
            <div className="h-[2px] overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-[#FF2D55] shadow-[0_0_15px_#FF2D55]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>

            <div className="mt-3 flex justify-between font-mono text-[9px] tracking-widest">
              <span className="text-gray-500">AUTHORIZATION STATUS</span>
              <span className="font-bold text-[#FF5575]">{progress}%</span>
            </div>
          </div>

          {/* Classified Footer Tag */}
          <p className="absolute bottom-6 text-center font-mono text-[8px] tracking-[0.28em] text-gray-600">
            AUTHORIZED PERSONNEL ONLY // CLASSIFIED ENVIRONMENT
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
