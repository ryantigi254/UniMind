import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

// Helper function to generate random number in a range
function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export const InteractiveStarfield: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null!);

  // Generate star positions AND random factors for twinkling
  const [positions, randomFactors] = useMemo(() => {
    const numStars = 6000; // Slightly more stars
    const pos = new Float32Array(numStars * 3);
    const factors = new Float32Array(numStars); // Array for random factors
    const outerRadius = 10; // Increased outer boundary for more depth
    const innerRadius = 1.2; // Keep stars safely outside foreground sphere radius (1.0)

    for (let i = 0; i < numStars; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = randomRange(innerRadius, outerRadius); // Generate radius in the desired range

      const i3 = i * 3;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      // Assign a random factor for twinkle speed/offset
      factors[i] = randomRange(0.3, 1.5); // Adjust range for desired twinkle speed
    }
    return [pos, factors];
  }, []);

  // Twinkle and rotation animation
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    // Subtle Rotation
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.01; 
    pointsRef.current.rotation.x = clock.getElapsedTime() * 0.005;

    // Twinkling
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
    const time = clock.getElapsedTime();

    for (let i = 0; i < positions.length / 3; i++) {
      const factor = randomFactors[i];
      // Calculate brightness using sine wave, factor, and time
      // Base brightness 0.5, amplitude 0.5 (range 0.0 to 1.0)
      // Add factor * PI to offset phases
      const brightness = 0.5 + 0.5 * Math.sin(time * factor + factor * Math.PI);
      // Clamp brightness to avoid pure black and ensure some visibility
      const clampedBrightness = Math.max(0.2, Math.min(1.0, brightness)); 

      const i3 = i * 3;
      colors[i3] = clampedBrightness; // Set R, G, B to the same brightness value
      colors[i3 + 1] = clampedBrightness;
      colors[i3 + 2] = clampedBrightness;
    }

    // Tell Three.js to update the colors
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions as any} stride={3}>
      <PointMaterial
        color="#ffffff"
        size={0.02} // Slightly larger stars
        sizeAttenuation={true}
        depthWrite={true}  // Ensure depth buffer is written
        depthTest={true}   // Ensure depth is checked
        transparent={true} // Restore transparency
        vertexColors={true} // <-- Enable vertex colors for twinkling
      />
      {/* Add the color buffer attribute */}
       <bufferAttribute 
            attach="geometry-attributes-color"
            array={new Float32Array(positions.length).fill(1)} // Initialize with white
            itemSize={3} // R, G, B
            count={positions.length / 3}
        />
    </Points>
  );
};
