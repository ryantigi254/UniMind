import React from 'react';
import { Html } from '@react-three/drei';
import { Mic } from 'lucide-react';

// Define props type including the click handler
type CompanionButtonOverlayProps = {
  onEnterCall: () => void; 
};

export const CompanionButtonOverlay: React.FC<CompanionButtonOverlayProps> = ({ onEnterCall }) => {
  // Inject styles only once or manage globally
  React.useEffect(() => {
    const styleId = 'companion-button-style';
    if (!document.getElementById(styleId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleId;
      styleSheet.type = "text/css";
      styleSheet.innerText = `
        .companion-button-3d {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.6rem 1.2rem;
          background-color: rgba(240, 240, 240, 0.85);
          color: #333;
          border: none;
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: background-color 0.2s ease;
          white-space: nowrap;
        }
        .companion-button-3d:hover {
          background-color: rgba(245, 245, 245, 0.95);
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  return (
    <Html center position={[0, 0, 0]}> 
      <button 
        className="companion-button-3d"
        aria-label="Start companion call"
        onClick={onEnterCall}
      >
        <Mic className="w-5 h-5 mr-2 text-gray-800" /> 
        Try a call
      </button>
    </Html>
  );
}; 