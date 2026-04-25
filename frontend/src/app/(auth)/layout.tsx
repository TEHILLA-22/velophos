"use client";

import Background from "@/components/Background";
import { motion } from "framer-motion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">

      <Background />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl 
        bg-white/5 backdrop-blur-xl border border-white/10
        shadow-[0_0_40px_rgba(255,255,255,0.05)]"
      >
        {children}
      </motion.div>
    </div>
  );
}