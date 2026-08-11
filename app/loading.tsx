"use client";

import { motion } from "framer-motion";
import { FaStethoscope } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg-soft">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-primary-400 blur-2xl opacity-20 rounded-full scale-150" />
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-[0_8px_32px_rgba(13,148,136,0.3)] relative z-10">
          <FaStethoscope className="text-white text-3xl" />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center"
      >
        <h2 className="text-xl font-extrabold text-heading tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Med<span className="text-gradient">Link</span>
        </h2>
        <p className="text-sm text-muted mt-1 font-medium">Loading amazing experience...</p>
      </motion.div>
    </div>
  );
}
