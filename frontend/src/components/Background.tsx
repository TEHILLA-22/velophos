"use client";

import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -50, 50, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-[600px] h-[600px] bg-purple-500 opacity-20 blur-3xl rounded-full"
      />

      <motion.div
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 60, -60, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-blue-500 opacity-20 blur-3xl rounded-full"
      />
    </div>
  );
}