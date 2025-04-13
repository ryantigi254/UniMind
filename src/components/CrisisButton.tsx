import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Phone, Shield, UserRound, Heart, Wind, Anchor, ArrowLeft } from 'lucide-react';
import BreathingExerciseSelectionScreen from './BreathingExerciseSelectionScreen';
import BreathingExerciseActiveScreen from './BreathingExerciseActiveScreen';

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

const CrisisButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBreathingExercises, setShowBreathingExercises] = useState(false);
  const [showGroundingExercise, setShowGroundingExercise] = useState(false);
  const [activeExercise, setActiveExercise] = useState<BreathingExercise | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
        setShowBreathingExercises(false);
        setShowGroundingExercise(false);
        setActiveExercise(null);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  const handleBreathingClick = () => {
    setShowBreathingExercises(true);
    setShowGroundingExercise(false);
  };

  const handleGroundingClick = () => {
    setShowGroundingExercise(true);
    setShowBreathingExercises(false);
  };

  const handleExerciseSelect = (exercise: BreathingExercise) => {
    setActiveExercise(exercise);
  };

  const handleExerciseClose = () => {
    setActiveExercise(null);
    setShowBreathingExercises(false);
    setIsModalOpen(false);
  };

  const handleBackToExercises = () => {
    setActiveExercise(null);
  };

  return (
    <>
      <button
        id="crisis-modal-trigger"
        onClick={() => setIsModalOpen(true)}
        className="hidden"
        aria-hidden="true"
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-gray-900 rounded-2xl max-w-lg w-full mx-auto shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800" 
            role="dialog" 
            aria-modal="true"
          >
            {showBreathingExercises ? (
              activeExercise ? (
                <BreathingExerciseActiveScreen
                  exercise={activeExercise}
                  onClose={handleExerciseClose}
                  onBack={handleBackToExercises}
                />
              ) : (
                <BreathingExerciseSelectionScreen
                  onSelect={handleExerciseSelect}
                  onBack={() => setShowBreathingExercises(false)}
                />
              )
            ) : showGroundingExercise ? (
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowGroundingExercise(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-2xl font-bold text-white">Grounding Exercise</h2>
                </div>

                <h3 className="text-3xl text-white text-center mt-8">5-4-3-2-1 Grounding Technique</h3>

                <div className="space-y-6 mt-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] group">
                      <span className="text-5xl font-bold text-[#3B82F6]">5</span>
                      <span className="text-3xl text-[#3B82F6] group-hover:text-[#3B82F6]">things you can SEE</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] group">
                      <span className="text-5xl font-bold text-[#22C55E]">4</span>
                      <span className="text-3xl text-[#22C55E] group-hover:text-[#22C55E]">things you can FEEL</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] group">
                      <span className="text-5xl font-bold text-[#A855F7]">3</span>
                      <span className="text-3xl text-[#A855F7] group-hover:text-[#A855F7]">things you can HEAR</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] group">
                      <span className="text-5xl font-bold text-[#F59E0B]">2</span>
                      <span className="text-3xl text-[#F59E0B] group-hover:text-[#F59E0B]">things you can SMELL</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] group">
                      <span className="text-5xl font-bold text-[#EF4444]">1</span>
                      <span className="text-3xl text-[#EF4444] group-hover:text-[#EF4444]">thing you can TASTE</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Crisis Resources</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3 text-white">Emergency Services</h3>
                    <div className="space-y-2">
                      <a href="tel:999" className="flex items-center gap-3 p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors shadow-[0_4px_12px_rgba(255,0,122,0.3)]">
                        <Phone className="h-5 w-5" />
                        <span className="font-medium">Emergency Services (999)</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                        <Shield className="h-5 w-5" />
                        <span className="font-medium">SafeZone App</span>
                      </a>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3 text-white">Mental Health Support</h3>
                    <div className="space-y-2">
                      <a 
                        href="https://www.samaritans.org" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                      >
                        <UserRound className="h-5 w-5" />
                        <span className="font-medium">Samaritans Support</span>
                      </a>
                      <a 
                        href="https://www.nhs.uk/mental-health/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                      >
                        <Heart className="h-5 w-5" />
                        <span className="font-medium">NHS Mental Health Services</span>
                      </a>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3 text-white">Self-Help Tools</h3>
                    <div className="space-y-2">
                      <button 
                        onClick={handleBreathingClick}
                        className="flex items-center gap-3 w-full p-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors text-left shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                      >
                        <Wind className="h-5 w-5" />
                        <span className="font-medium">Guided Breathing Exercise</span>
                      </button>
                      <button 
                        onClick={handleGroundingClick}
                        className="flex items-center gap-3 w-full p-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors text-left shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                      >
                        <Anchor className="h-5 w-5" />
                        <span className="font-medium">5-4-3-2-1 Grounding Exercise</span>
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CrisisButton;