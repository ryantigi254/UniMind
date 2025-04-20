import React, { Suspense, useState, useRef, useMemo, useEffect, memo } from 'react';
import { Canvas, useThree, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

// Import necessary components
// import { GalaxySphere } from '../components/three/GalaxySphere'; // REMOVE old import
import { InteractiveStarfield } from '../components/three/InteractiveStarfield'; // ADD new import
// REMOVED: import { CompanionButtonOverlay } from '../components/three/CompanionButtonOverlay';

// Import shaders directly for integrated component
import vertexShader from '../components/three/shaders/persona.vert?raw';
import fragmentShader from '../components/three/shaders/persona.frag?raw';

// Define animation phases
type AnimationPhase = 'idle' | 'resettingCamera' | 'zoomingIn' | 'neutronStarVisible';

// Define background colors
const initialBgColor = new THREE.Color('#1a1a2e'); // Dark space blue
const zoomedInBgColor = new THREE.Color('#4a0e6b'); // Restore Deep purple/violet
const tempBgColor = new THREE.Color(); // For lerping

// Define FOV values
const initialFov = 65;
const zoomedInFov = 55; // Adjust FOV slightly for better framing

// --- GLSL Shaders for Initial Sphere ---
const initialSphereVertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition; // Added varying for view position

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz; // Calculate view position
  gl_Position = projectionMatrix * mvPosition;
}
`;

// Updated Fragment Shader for enhanced diagonal highlights and core glow
const initialSphereFragmentShader = `
varying vec3 vNormal;
varying vec3 vViewPosition; // Added varying for view position
uniform vec3 uBaseColor;
uniform vec3 uHighlightColor;
uniform float uHighlightSharpness;
uniform float uTime;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition); // Normalize the view direction

  // Calculate highlight factor (existing logic)
  float highlightFactorX = pow(abs(normal.x), uHighlightSharpness);
  float highlightFactorY = pow(abs(normal.y), uHighlightSharpness);
  float cardinalHighlightFactor = max(highlightFactorX, highlightFactorY);
  float diagonalHighlightFactor = highlightFactorX * highlightFactorY * 4.0;
  float combinedHighlightFactor = max(cardinalHighlightFactor, diagonalHighlightFactor);
  combinedHighlightFactor = clamp(combinedHighlightFactor, 0.0, 1.0);

  // Calculate pulse factor (existing logic)
  float pulse = 0.05 * sin(uTime * 0.5);
  float lowerBound = 0.35 + pulse;
  float upperBound = 0.9 + pulse;

  // Smoothly mix base color and highlight color (existing logic)
  vec3 finalColor = mix(uBaseColor, uHighlightColor, smoothstep(lowerBound, upperBound, combinedHighlightFactor));

  // Calculate core brightness factor
  float coreFactor = max(0.0, dot(viewDir, normal)); // Dot product of view and normal
  // float coreBrightness = pow(coreFactor, 2.0) * 0.2; // Removed additive brightness

  // Calculate brightness scale (darker at edges, brighter at center)
  float brightnessScale = 0.6 + 0.4 * pow(coreFactor, 1.5); // Scale from 0.6 (edges) to 1.0 (center), slightly sharper falloff

  // Apply brightness scale and add core brightness boost
  finalColor *= brightnessScale;

  // Add a slightly stronger additive boost at the very center for more pop
  finalColor += vec3(pow(coreFactor, 3.0) * 0.15); // Add 15% boost at center, sharp falloff

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// --- Initial Idle Sphere Component ---
const InitialIdleSphere: React.FC = () => {
  const sphereRadius = 0.85;
  const shaderRef = useRef<THREE.ShaderMaterial>(null!); // Ref for the shader material

  const shaderUniforms = useMemo(() => ({
    uBaseColor: { value: new THREE.Color('#6cbdbd') }, // Teal
    uHighlightColor: { value: new THREE.Color('#FF007A') }, // Deep Pink
    uHighlightSharpness: { value: 3.0 }, // Reduced sharpness for more spread
    uTime: { value: 0.0 } // Initialize time uniform
  }), []);

  // Update time uniform on each frame
  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <>
      <Sphere args={[sphereRadius, 64, 64]} position={[0, 0, 0]}>
        <shaderMaterial
          ref={shaderRef} // Assign ref to the material
          vertexShader={initialSphereVertexShader}
          fragmentShader={initialSphereFragmentShader}
          uniforms={shaderUniforms}
          depthTest={true}
          depthWrite={true}
        />
      </Sphere>
    </>
  );
};

// --- Integrated Animating Sphere Component (Neutron Star) --- 
const AnimatingSphereComponent: React.FC = () => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // console.log('AnimatingSphere uTime:', state.clock.elapsedTime); // Commented out debug log
    }
  });

  return (
    <>
      {/* Reduce Sphere size further */}
      <Sphere args={[0.3, 128, 128]} position={[0, 0, 0]}>
        <shaderMaterial
          ref={shaderRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{ uTime: { value: 0.0 } }}
        />
      </Sphere>
    </>
  );
};

const AnimatingSphere = memo(AnimatingSphereComponent);

// --- Component to handle OrbitControls updates ---
const ControlsUpdater: React.FC<{ controlsRef: React.RefObject<any>; enabled: boolean }> = ({ controlsRef, enabled }) => {
  useFrame(() => {
    if (enabled && controlsRef.current) {
      controlsRef.current.update();
    }
  });
  return null;
};

// --- Main Companion Page Component --- 
const CompanionPage: React.FC = () => {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle');
  const controlsRef = useRef<any>(null);
  // Add refs for camera state used in Canvas props
  const cameraPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 3.5)); 
  const cameraFovRef = useRef<number>(initialFov);

  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [isLightSensitive, setIsLightSensitive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false); 
  const [agentState, setAgentState] = useState<'listening' | 'interruptible'>('listening'); 

  // Check localStorage on mount
  useEffect(() => {
    const accepted = localStorage.getItem('companionTermsAccepted');
    if (accepted !== 'true') {
      setShowTermsModal(true);
    }
    // Optional: Load sensitivity preference if needed later
    // const sensitivity = localStorage.getItem('companionLightSensitivity');
    // if (sensitivity === 'true') { setIsLightSensitive(true); }
  }, []);

  // Define camera positions using useMemo
  const zoomedOutPos = useMemo(() => new THREE.Vector3(0, 0, 3.5), []);
  const zoomedInPos = useMemo(() => new THREE.Vector3(0, 0, 1.5), []);

  const handleAcceptTerms = () => {
    localStorage.setItem('companionTermsAccepted', 'true');
    // Store sensitivity preference
    localStorage.setItem('companionLightSensitivity', isLightSensitive ? 'true' : 'false');
    setShowTermsModal(false);
  };

  const handleEnterCall = () => {
    console.log("Starting camera reset sequence...");
    setAnimationPhase('resettingCamera'); // Start with reset phase
    if (controlsRef.current) {
      controlsRef.current.enabled = false; // Disable controls immediately
    }
  };

  // ADD placeholder handlers for animating sphere buttons
  const handleMuteClick = () => {
    setIsMuted(prev => !prev); // Toggle mute state
    console.log(`Mute toggled to: ${!isMuted}`);
  };
  const handleInterruptClick = () => {
    setAgentState(currentState => currentState === 'listening' ? 'interruptible' : 'listening');
    console.log(`Agent state toggled to: ${agentState === 'listening' ? 'interruptible' : 'listening'}`);
  };

  // --- Define AnimationController Component HERE (outside the return, but inside CompanionPage scope) ---
  // This component now *must* be rendered INSIDE <Canvas>
  const AnimationController = () => {
    const { camera, gl } = useThree(); // Hooks are valid because it will be rendered inside Canvas
    const resetTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []); // Target for controls reset
    const resetSpeed = 2.0; // Decreased speed for smoother reset (was 5.0)
    const epsilon = 0.01; // Threshold for checking closeness

    useFrame((state, delta) => {
      // Update refs used by Canvas props
      cameraPositionRef.current.copy(camera.position);
      if (camera instanceof THREE.PerspectiveCamera) {
          cameraFovRef.current = camera.fov;
      }

      // --- Camera Reset Logic ---
      if (animationPhase === 'resettingCamera') {
        camera.position.lerp(zoomedOutPos, delta * resetSpeed);
        let targetResetComplete = true; // Assume true if no controls

        if (controlsRef.current) {
          controlsRef.current.target.lerp(resetTarget, delta * resetSpeed);
          controlsRef.current.update(); // Necessary after changing target programmatically
          targetResetComplete = controlsRef.current.target.distanceTo(resetTarget) < epsilon;
        }

        const positionResetComplete = camera.position.distanceTo(zoomedOutPos) < epsilon;

        if (positionResetComplete && targetResetComplete) {
          // Snap to final reset position/target
          camera.position.copy(zoomedOutPos);
          if (controlsRef.current) {
            controlsRef.current.target.copy(resetTarget);
            controlsRef.current.update();
          }
          // Transition to next phase
          setAnimationPhase('zoomingIn'); 
          console.log("Camera reset complete, starting zoom.");
        }
      } 
      // --- Zoom-in Logic ---
      else if (animationPhase === 'zoomingIn') { 
        const minZoomSpeed = 0.5;
        const maxZoomSpeed = 2.5;
        const distTotal = zoomedOutPos.distanceTo(zoomedInPos);
        const distCurrent = camera.position.distanceTo(zoomedInPos);
        const progress = distTotal > 0.001 ? Math.max(0, Math.min(1, 1 - distCurrent / distTotal)) : 1;
        const currentZoomSpeed = minZoomSpeed + (maxZoomSpeed - minZoomSpeed) * progress;

        camera.position.lerp(zoomedInPos, delta * currentZoomSpeed);
        tempBgColor.copy(initialBgColor).lerp(zoomedInBgColor, progress);
        gl.setClearColor(tempBgColor);

        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = THREE.MathUtils.lerp(initialFov, zoomedInFov, progress);
          camera.updateProjectionMatrix();
        }

        if (distCurrent < 0.05) {
          camera.position.copy(zoomedInPos);
          gl.setClearColor(zoomedInBgColor);
          if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = zoomedInFov;
            camera.updateProjectionMatrix();
          }
          setAnimationPhase('neutronStarVisible');
          console.log("Reached zoom-in point, showing Animating Sphere.");
          if (controlsRef.current) {
            controlsRef.current.enabled = true; // Re-enable controls AFTER zoom
            controlsRef.current.target.set(0, 0, 0); // Ensure target is correct
            controlsRef.current.update();
          }
        }
      } 
      // --- Ensure Target is Centered in Final State ---
      else if (animationPhase === 'neutronStarVisible') {
         // Optional: Ensure controls target is correct after zoom if needed
         if (controlsRef.current && controlsRef.current.target.distanceTo(resetTarget) > epsilon) {
             controlsRef.current.target.copy(resetTarget);
             controlsRef.current.update();
         }
      }
      // --- End Animation Logic ---

    }); // End useFrame

    return null; // Controller doesn't render anything itself
  }; // --- End AnimationController Definition ---

  // Adjust visibility logic to switch spheres
  const showInitialSphere = animationPhase === 'idle' || animationPhase === 'resettingCamera' || animationPhase === 'zoomingIn'; // Show during idle, reset and zoom
  const showAnimatingSphere = animationPhase === 'neutronStarVisible';
  // Enable controls only when idle
  const controlsEnabled = animationPhase === 'idle';

  // --- Terms Modal Component --- (Simple overlay)
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
        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', flexShrink: 0, marginBottom: '15px' }}>Welcome to Companion</h2>
        <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px' }}>
          <p style={{ marginBottom: '15px' }}>This is an experimental AI conversational agent designed for interaction and providing information based on its training data. Please enjoy the experience!</p>
          <p style={{ marginBottom: '15px' }}><strong>Important Notes:</strong></p>
          <ul style={{ marginBottom: '15px' }}>
            <li>Companion is an AI and not a mental health professional. Its responses are generated algorithmically.</li>
            <li>Information provided may sometimes be inaccurate or incomplete.</li>
            <li>This experience may involve bright or potentially flashing colors.</li>
          </ul>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: '25px', flexShrink: 0 }}>
          <label style={{ display: 'block', marginBottom: '15px' }}>
            <input 
              type="checkbox" 
              checked={isLightSensitive}
              onChange={(e) => setIsLightSensitive(e.target.checked)}
              style={{ marginRight: '8px' }} 
            />
            Check this box if you are <strong>sensitive to bright or flashing lights</strong> (click here to adjust display settings)
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
            Accept and Continue
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative h-screen w-full bg-gray-900 overflow-hidden">
      {/* Conditionally render the modal */} 
      {showTermsModal && <TermsModal />}
      
      <Canvas
        className="absolute inset-0" // Use className for styling
        camera={{
            position: cameraPositionRef.current.toArray() as [number, number, number],
            fov: cameraFovRef.current,
            near: 0.1,
            far: 1000
        }}
        onCreated={({ gl, camera }) => {
            gl.setClearColor(initialBgColor);
            cameraPositionRef.current = camera.position.clone();
            if (camera instanceof THREE.PerspectiveCamera) {
                cameraFovRef.current = camera.fov;
            }
        }}
        frameloop="always" // Keep frameloop always for smooth transitions
      >
        {/* Render AnimationController HERE, inside Canvas */}
        <AnimationController /> 

        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.0} />

        {/* Always render the starfield background */} 
        <InteractiveStarfield /> 
        
        <Suspense fallback={<Html center>Loading 3D...</Html>}> 
          {/* Render the correct sphere based on phase */} 
          {showInitialSphere && <InitialIdleSphere />}
          {showAnimatingSphere && <AnimatingSphere />} 
        </Suspense>

         <OrbitControls
          ref={controlsRef}
          enabled={controlsEnabled} // Controls enabled state based on animationPhase
          target={[0, 0, 0]}
          enableDamping={true} 
          dampingFactor={0.1}
          enableZoom={false}
          enablePan={false} // Keep pan disabled
          enableRotate={true} // Allow rotation when idle
          minPolarAngle={Math.PI / 4} // Restrict vertical rotation
          maxPolarAngle={3 * Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4} // Restrict horizontal rotation
          maxAzimuthAngle={Math.PI / 4}
        />
        
        {/* ControlsUpdater doesn't need enabled prop if OrbitControls handles it */}
        <ControlsUpdater controlsRef={controlsRef} enabled={controlsEnabled} /> 
      </Canvas>

      {/* Render Button Outside Canvas for Fixed Positioning */} 
      {(animationPhase === 'idle') && ( 
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10 // Ensure it's above canvas but below modal
        }}>
          <button
            onClick={handleEnterCall}
            style={{
                padding: '10px 25px',
                borderRadius: '30px',
                border: 'none',
                background: '#FF007A',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                pointerEvents: 'auto',
                whiteSpace: 'nowrap' // Ensure text stays on one line
            }}
          >
            {/* Replaced span with SVG icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
              <path d="M4 18V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 21V3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 15V9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Try a call
          </button>
        </div>
      )}

      {(animationPhase === 'neutronStarVisible') && (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '15px',
            pointerEvents: 'none'
        }}>
          {/* Listening/Interrupt Button */} 
          <button
            onClick={handleInterruptClick}
            style={{
                padding: '10px 30px',
                borderRadius: '30px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#222',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                pointerEvents: 'auto',
                whiteSpace: 'nowrap' 
            }}
          >
            {/* Dynamic Text based on agentState */}
            {agentState === 'listening' ? 'Listening' : 'Talk to interrupt'}
          </button>
          {/* Re-added Mute Button */} 
          <button
            onClick={handleMuteClick}
            title={isMuted ? "Unmute microphone" : "Mute microphone"} // Dynamic title
            style={{
                padding: '8px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
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
                position: 'relative',
            }}
          >
            {/* Microphone SVG Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C10.3431 2 9 3.34315 9 5V11C9 12.6569 10.3431 14 12 14C13.6569 14 15 12.6569 15 11V5C15 3.34315 13.6569 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 10V11C19 14.866 15.866 18 12 18C8.13401 18 5 14.866 5 11V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Conditionally render the mute line span */}
            {isMuted && (
              <span style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  width: '2px',
                  height: '24px',
                  background: 'currentColor',
                  display: 'block'
              }}></span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanionPage; 
