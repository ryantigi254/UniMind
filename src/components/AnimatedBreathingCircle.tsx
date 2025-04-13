import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedBreathingCircleProps {
  phase: 'inhale' | 'hold' | 'exhale';
  seconds: number;
  maxSize: number;
}

const AnimatedBreathingCircle: React.FC<AnimatedBreathingCircleProps> = ({
  phase,
  seconds,
  maxSize,
}) => {
  const baseSize = maxSize * 0.4; // Minimum size is 40% of max size
  const expandedSize = maxSize;
  
  const variants = {
    inhale: {
      scale: expandedSize / baseSize,
      transition: { duration: seconds, ease: "easeInOut" }
    },
    hold: {
      scale: expandedSize / baseSize,
      transition: { duration: seconds }
    },
    exhale: {
      scale: 1,
      transition: { duration: seconds, ease: "easeInOut" }
    }
  };

  return (
    <div className="relative flex items-center justify-center" style={{ height: maxSize, width: maxSize }}>
      <motion.div
        initial={{ scale: 1 }}
        animate={variants[phase]}
        className="relative flex items-center justify-center"
      >
        <div 
          className="absolute rounded-full bg-primary-500/20"
          style={{ width: baseSize, height: baseSize }}
        />
        <div 
          className="rounded-full bg-primary-500/40"
          style={{ width: baseSize, height: baseSize }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">
            {seconds}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedBreathingCircle;