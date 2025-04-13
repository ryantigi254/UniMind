import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Square } from 'lucide-react';
import AnimatedBreathingCircle from './AnimatedBreathingCircle';

interface BreathingPhase {
  type: 'inhale' | 'hold' | 'exhale';
  duration: number;
  instruction: string;
}

interface BreathingExerciseActiveScreenProps {
  exercise: {
    title: string;
    phases: BreathingPhase[];
  };
  onClose: () => void;
  onBack: () => void;
}

const BreathingExerciseActiveScreen: React.FC<BreathingExerciseActiveScreenProps> = ({
  exercise,
  onClose,
  onBack,
}) => {
  const [countdown, setCountdown] = useState(3);
  const [isStarted, setIsStarted] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const startExercise = useCallback(() => {
    setIsStarted(true);
    setCurrentPhaseIndex(0);
    setSecondsLeft(exercise.phases[0].duration);
  }, [exercise.phases]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isStarted) {
      startExercise();
    }
  }, [countdown, isStarted, startExercise]);

  useEffect(() => {
    if (!isStarted) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          const nextIndex = (currentPhaseIndex + 1) % exercise.phases.length;
          setCurrentPhaseIndex(nextIndex);
          return exercise.phases[nextIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, currentPhaseIndex, exercise.phases]);

  const currentPhase = exercise.phases[currentPhaseIndex];

  return (
    <div className="flex flex-col h-[600px] bg-gray-900 text-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold">{exercise.title}</h1>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-between p-6">
        <AnimatePresence mode="wait">
          {countdown > 0 ? (
            <motion.div
              key="countdown"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-6xl font-bold text-primary-500 mt-32"
            >
              {countdown}
            </motion.div>
          ) : (
            <motion.div
              key="exercise"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center w-full"
            >
              <div className="text-2xl font-medium text-center mb-8">
                {currentPhase.instruction}
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <AnimatedBreathingCircle
                  phase={currentPhase.type}
                  seconds={secondsLeft}
                  maxSize={280}
                />
              </div>

              <div className="w-full space-y-6">
                <div className="text-gray-400 text-center">
                  Follow the circle's movement
                </div>

                <button
                  onClick={onClose}
                  className="w-full p-3 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-gray-300 hover:text-white"
                >
                  <Square className="h-5 w-5" />
                  <span>Stop Exercise</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BreathingExerciseActiveScreen;