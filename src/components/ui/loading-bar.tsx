import React from 'react';
import { motion } from 'framer-motion';

interface LoadingBarProps {
  isLoading: boolean;
}

export function LoadingBar({ isLoading }: LoadingBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      className="fixed top-0 left-0 z-[9999] h-1 w-full bg-white/5"
    >
      <motion.div
        initial={{ 
          scaleX: 0,
          transformOrigin: "0% 50%"
        }}
        animate={{ 
          scaleX: isLoading ? 1 : 0,
        }}
        transition={{ 
          duration: 2,
          ease: [0.4, 0.0, 0.2, 1]
        }}
        className="h-full w-full bg-gradient-to-r from-white via-blue-400 to-white"
        style={{
          boxShadow: `
            0 0 10px rgba(255, 255, 255, 0.7),
            0 0 5px rgba(59, 130, 246, 0.5),
            0 1px 2px rgba(255, 255, 255, 0.3)
          `
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
          style={{
            transform: "translateX(-50%) skewX(-15deg)",
            width: "200%"
          }}
        />
      </motion.div>
    </motion.div>
  );
} 