import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useStore } from '../store'; // Keep if needed for modal logic

// Keep types if needed for state
type AnimationPhase = 'idle' | 'zoomingIn' | 'neutronStarVisible';

const CompanionPage: React.FC = () => {
  console.log('CompanionPage component function started.');

  // Keep state related to basic functionality like the modal
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [isLightSensitive, setIsLightSensitive] = useState<boolean>(false);
  const { accepted: disclaimerAccepted } = useStore((state) => state.disclaimerStatus);

  useEffect(() => {
    const accepted = localStorage.getItem('companionTermsAccepted');
    if (accepted !== 'true') {
      setShowTermsModal(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('companionTermsAccepted', 'true');
    localStorage.setItem('companionLightSensitivity', isLightSensitive ? 'true' : 'false');
    setShowTermsModal(false);
  };

  // Simplified Terms Modal (keep for testing mounting/state)
  const TermsModal = () => (
     <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100 // Ensure it's on top
    }}>
      <div style={{
        backgroundColor: '#1a1a2e',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '500px',
        minHeight: '500px',
        color: 'white',
        fontFamily: 'sans-serif',
        border: '1px solid #444',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', flexShrink: 0, marginBottom: '15px' }}>Welcome to Companion (Debug)</h2>
         <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px' }}>
          <p style={{ marginBottom: '15px' }}>Terms content...</p>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: '25px', flexShrink: 0 }}>
           <label style={{ display: 'block', marginBottom: '15px' }}>
            <input
              type="checkbox"
              checked={isLightSensitive}
              onChange={(e) => setIsLightSensitive(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Light sensitive...
          </label>
          <button
            onClick={handleAcceptTerms}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#FF007A',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              display: 'block',
              width: '100%'
            }}
          >
            Accept and Continue (Debug)
          </button>
        </div>
      </div>
    </div>
  );


  // Main return simplified
  return (
    <div className="relative h-screen w-full bg-gray-900 overflow-hidden flex items-center justify-center">
      {/* Conditionally render the modal */}
      {showTermsModal && <TermsModal />}

      {!showTermsModal && (
          <h1 className="text-white text-2xl">Companion Page Loaded (Debug Mode)</h1>
      )}
    </div>
  );
};

export default CompanionPage; 
