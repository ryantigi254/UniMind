uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

// Simplex noise functions (restored)
// Source: https://github.com/ashima/webgl-noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857; // 1.0/7.0
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z); // mod(p,7*7)
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_); // mod(j,N)
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Fractional Brownian Motion (fBm) using snoise (restored)
float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.6;
    float frequency = 2.0;
    for (int i = 0; i < 4; i++) { // 4 octaves
        value += amplitude * snoise(p * frequency);
        frequency *= 2.1;
        amplitude *= 0.45;
    }
    return value;
}

void main() {
  float time = uTime * 0.2;

  // Use normal vector for 3D noise input, offset by time for animation (restored)
  vec3 noiseInput = vNormal * 3.0 + time;
  float noiseValue = fbm(noiseInput);

  // Create a swirling effect based on UVs and time (restored)
  float swirlAngle = time * 1.5 + length(vUv - 0.5) * 5.0;
  mat2 rot = mat2(cos(swirlAngle), -sin(swirlAngle), sin(swirlAngle), cos(swirlAngle));
  vec2 swirlUv = rot * (vUv - 0.5) + 0.5;
  float swirlNoise = fbm(vec3(swirlUv * 5.0, time * 0.5)); // Add another layer of noise for swirling texture

  // Combine noise values (restored)
  float finalNoise = noiseValue * 0.6 + swirlNoise * 0.4;

  // --- Color Mapping for Neutron Star --- (restored)
  vec3 coreColor = vec3(1.0, 1.0, 1.0);    // Bright white core
  vec3 midColor = vec3(0.7, 0.8, 1.0);    // Light Blue/Violet
  vec3 outerColor = vec3(1.0, 0.0, 0.478); // Deep Pink (#FF007A) - REPLACED Deep Violet/Blue
  vec3 flareColor = vec3(1.0, 0.9, 0.7);  // Yellowish flares

  // Base color transition from outer to mid based on noise (restored)
  vec3 color = mix(outerColor, midColor, smoothstep(0.1, 0.4, finalNoise));
  // Add core color sharply at higher noise values (restored)
  color = mix(color, coreColor, smoothstep(0.55, 0.7, finalNoise));

  // Add flares based on a different time scale and noise threshold (restored)
  float flareNoise = fbm(vNormal * 6.0 + time * 2.5);
  color = mix(color, flareColor, smoothstep(0.65, 0.75, flareNoise) * (0.5 + 0.5 * sin(time * 10.0))); // Pulsing flares

  // Add a Fresnel effect for a glowing edge (optional) (restored)
  float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
  color = mix(color, coreColor * 0.8, fresnel * 0.6);

  gl_FragColor = vec4(color, 1.0);
} 