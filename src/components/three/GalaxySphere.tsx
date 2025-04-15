import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

// Helper function to generate random number in a range
function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export const GalaxySphere: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null!); // Ref for the stars

  // Generate star positions and random factors for animation
  const [positions, randomFactors] = useMemo(() => {
    const numStars = 5000;
    const pos = new Float32Array(numStars * 3);
    const factors = new Float32Array(numStars);
    const outerRadius = 5; // Outer boundary for stars
    const innerRadius = 1.1; // Keep stars outside this radius (InitialSphere radius is 1.0)

    for (let i = 0; i < numStars; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      // Ensure stars are generated between innerRadius and outerRadius
      const r = randomRange(innerRadius, outerRadius); // Use helper function

      const i3 = i * 3;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      factors[i] = randomRange(0.5, 1.5); 
    }
    return [pos, factors];
  }, []);

  // Twinkle animation in useFrame
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
    const time = clock.getElapsedTime();

    for (let i = 0; i < positions.length / 3; i++) {
      const factor = randomFactors[i];
      const brightness = 0.5 + 0.5 * Math.sin(time * factor + factor * Math.PI);
      const clampedBrightness = Math.max(0.2, Math.min(1.0, brightness)); 

      const i3 = i * 3;
      colors[i3] = clampedBrightness; 
      colors[i3 + 1] = clampedBrightness;
      colors[i3 + 2] = clampedBrightness;
    }

    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <group>
      {/* Remove the transparent outer sphere */}
      {/* <mesh ref={outerSphereRef} name="outerSphere">...</mesh> */}

      {/* Remove the inner teal sphere */}
      {/* <mesh position={[0, 0, 0]}>...</mesh> */}

      {/* Keep Star Points */}
      <Points ref={pointsRef} positions={positions as any} stride={3}>
        <PointMaterial 
          transparent 
          color="#ffffff"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={true}
          vertexColors
        />
        <bufferAttribute 
            attach="geometry-attributes-color"
            array={new Float32Array(positions.length).fill(1)} 
            itemSize={3}
            count={positions.length / 3}
         />
      </Points>

      {/* REMOVED Pink Lights */}
      {/* <pointLight position={[0, -1.5, 0]} ... /> */}
      {/* <pointLight position={[0, 1.5, 0]} ... /> */}
      {/* <pointLight position={[1.5, 0, 0]} ... /> */}
      {/* <pointLight position={[-1.5, 0, 0]} ... /> */}
      {/* <pointLight position={[1.06, 1.06, 0]} ... /> */}
      {/* <pointLight position={[-1.06, 1.06, 0]} ... /> */}
      {/* <pointLight position={[1.06, -1.06, 0]} ... /> */}
      {/* <pointLight position={[-1.06, -1.06, 0]} ... /> */}
    </group>
  );
}; 