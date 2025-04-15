import React from 'react';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

export const CalmingScene: React.FC = () => {
  // Placeholder for button click handlers
  const handleMuteClick = () => {
    console.log('Mute/Unmute clicked');
  };

  const handleInterruptClick = () => {
    console.log('Interrupt clicked');
  };

  return (
    <>
      {/* Soft ambient light for the scene */}
      <ambientLight intensity={0.6} />
      {/* Optional: A gentle point light */}
      {/* <pointLight position={[0, 2, 2]} intensity={0.5} /> */}

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#202030', 1, 5]} />

      {/* The main calming sphere - replace placeholder box */}
      <Sphere args={[0.8, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#5f9ea0" // Calming cadetblue color
          roughness={0.3} 
          metalness={0.1}
          transparent
          opacity={0.8} // Slightly transparent 
        />
      </Sphere>

      {/* HTML Buttons embedded in the scene */}
      {/* Adjust position as needed based on final camera position */}
      <Html position={[0, 0, 0.85]} center>
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '15px', 
            color: 'white', 
            fontFamily: 'sans-serif' 
        }}>
          {/* Listening/Interrupt Button */}
          <button 
            onClick={handleInterruptClick}
            style={{
                padding: '10px 20px',
                borderRadius: '20px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.8)',
                color: '#333',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
          >
            Listening 
            {/* Basic Mic Icon Placeholder */}
            <span style={{ fontSize: '20px' }}>🎤</span> 
          </button>

          {/* Mute Button Placeholder */}
          <button 
            onClick={handleMuteClick}
            style={{
                padding: '8px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
          >
            {/* Placeholder for Mute Icon */}
            🤫 
          </button>
        </div>
      </Html>
    </>
  );
}; 