import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreathingExercise {
  id: string;
  title: string;
  description: string;
  benefit: string;
  phases: Array<{
    type: 'inhale' | 'hold' | 'exhale';
    duration: number;
    instruction: string;
  }>;
}

const breathingExercises: BreathingExercise[] = [
  {
    id: 'box',
    title: '4-4-4 Box Breathing',
    description: 'Inhale (4s) → Hold (4s) → Exhale (4s) → Hold (4s)',
    benefit: 'Great for quick stress reduction',
    phases: [
      { type: 'inhale', duration: 4, instruction: 'Inhale slowly through your nose...' },
      { type: 'hold', duration: 4, instruction: 'Hold your breath...' },
      { type: 'exhale', duration: 4, instruction: 'Exhale slowly through your mouth...' },
      { type: 'hold', duration: 4, instruction: 'Hold your breath...' },
    ],
  },
  {
    id: '478',
    title: '4-7-8 Relaxing Breath',
    description: 'Inhale (4s) → Hold (7s) → Exhale (8s)',
    benefit: 'Perfect for deep relaxation and sleep',
    phases: [
      { type: 'inhale', duration: 4, instruction: 'Inhale quietly through your nose...' },
      { type: 'hold', duration: 7, instruction: 'Hold your breath...' },
      { type: 'exhale', duration: 8, instruction: 'Exhale completely through your mouth...' },
    ],
  },
  {
    id: 'diaphragmatic',
    title: 'Diaphragmatic Breathing',
    description: 'Deep belly breathing with focus on diaphragm movement',
    benefit: 'Reduces stress and anxiety',
    phases: [
      { type: 'inhale', duration: 4, instruction: 'Inhale deeply into your belly...' },
      { type: 'hold', duration: 2, instruction: 'Hold briefly...' },
      { type: 'exhale', duration: 4, instruction: 'Exhale slowly and completely...' },
    ],
  },
  {
    id: 'focus',
    title: 'Breath Focus',
    description: 'Mindful breathing with counting',
    benefit: 'Enhances focus and calm',
    phases: [
      { type: 'inhale', duration: 5, instruction: 'Breathe in while counting to 5...' },
      { type: 'hold', duration: 2, instruction: 'Pause briefly...' },
      { type: 'exhale', duration: 5, instruction: 'Breathe out while counting to 5...' },
    ],
  },
];

interface Props {
  onSelect: (exercise: BreathingExercise) => void;
  onBack: () => void;
}

const BreathingExerciseSelectionScreen: React.FC<Props> = ({ onSelect, onBack }) => {
  return (
    <div className="flex flex-col h-[600px] bg-gray-900 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-3 border-b border-gray-800">
        <button
          onClick={onBack}
          className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-white">Breathing Exercises</h2>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h3 className="text-lg text-white mb-4">Choose a Breathing Technique</h3>
        
        {/* Exercise List */}
        <div className="flex-1">
          <div className="grid gap-3">
            {breathingExercises.map((exercise) => (
              <motion.button
                key={exercise.id}
                onClick={() => onSelect(exercise)}
                className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-lg"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-base font-semibold text-white">{exercise.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{exercise.description}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{exercise.benefit}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recommendation Text */}
        <div className="mt-auto pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-xs text-center">
            Recommended duration: 5+ minutes for optimal effectiveness
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreathingExerciseSelectionScreen;