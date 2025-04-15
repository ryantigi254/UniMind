varying vec2 vUv;
varying vec3 vNormal;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal); // Correct normal calculation
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
} 