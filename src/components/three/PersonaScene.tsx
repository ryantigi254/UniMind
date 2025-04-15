import React, { useRef } from 'react';
import { Sphere, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Import shaders as raw strings
import vertexShader from './shaders/persona.vert?raw';
import fragmentShader from './shaders/persona.frag?raw';

// --- Remove inline shader constants --- 
// const vertexShader = `...`;
// const fragmentShader = `...`;

// --- Component Props --- 

// --- Component --- 

export const PersonaScene: React.FC = () => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null!);

  const handleMuteClick = () => {
    console.log('Mute/Unmute clicked (Persona Scene)');
  };

  const handleInterruptClick = () => {
    console.log('Interrupt clicked (Persona Scene)');
  };

  useFrame((state) => {
    if (shaderRef.current) {
      const time = state.clock.elapsedTime;
      shaderRef.current.uniforms.uTime.value = time;
    }
  });

  return (
    <>
      {/* Reduced internal ambient light, rely more on main scene lighting */}
      <ambientLight intensity={0.1} />
      
      {/* Removed Fog - will be handled by the main scene */}
      {/* <fog attach="fog" args={['#101020', 1.5, 5]} /> */}

      {/* The main Persona sphere with shader loaded from files */}
      <Sphere args={[0.8, 128, 128]} position={[0, 0, 0]}> 
        <shaderMaterial
          ref={shaderRef}
          // Use imported shader strings
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uTime: { value: 0.0 }
          }}
          // Optional: Additive blending might look good for a star
          // blending={THREE.AdditiveBlending} 
          // transparent={true}
        />
      </Sphere>

      {/* Add HTML buttons back */}
      <Html position={[0, 0, 0.81]} center>
         <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            color: 'white',
            fontFamily: 'sans-serif',
            pointerEvents: 'none'
        }}>
          {/* Listening/Interrupt Button */}
          <button
            onClick={handleInterruptClick}
            style={{
                padding: '10px 25px',
                borderRadius: '30px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#222',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                pointerEvents: 'auto'
            }}
          >
            Listening
            <span style={{ fontSize: '20px', lineHeight: '1' }}>🎤</span>
          </button>

          {/* Mute Button - Updated Icon */}
          <button
            onClick={handleMuteClick}
            style={{
                padding: '8px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(50, 50, 50, 0.7)',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                width: '45px',
                height: '45px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                pointerEvents: 'auto',
                position: 'relative', // For icon positioning
            }}
          >
            {/* Simple Mute Icon: Mic + Line */}
            <span style={{ fontSize: '20px', lineHeight: '1' }}>🎤</span>
            <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(45deg)',
                width: '2px',
                height: '24px',
                background: 'white',
                display: 'block'
            }}></span>
          </button>
        </div>
      </Html>
    </>
  );
}; 