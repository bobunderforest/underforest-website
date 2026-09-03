import { useRef } from 'react'
import { MountInView } from 'ui/fx/MountInView'
import { useFullscreenShader } from 'utils/anim/fullscreen-shader'

const RESOLUTION_SCALE = 0.75
const skyPixelRatio = () => RESOLUTION_SCALE

const FRAGMENT_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 uResolution;
uniform float uTime;

const float TAU = 6.28318530718;

float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash31(i);
  float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash31(i + vec3(1.0));
  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);
  return mix(mix(nx00, nx10, f.y), mix(nx01, nx11, f.y), f.z);
}

vec2 fields(vec3 p) {
  float coarse = noise3(p);
  float detail = noise3(p * 2.03 + 17.1);
  return vec2(
    (coarse * 0.5 + detail * 0.25) * 1.25,
    (detail * 0.5 + (1.0 - coarse) * 0.25) * 1.25
  );
}

float stars(vec3 dir, float time) {
  vec3 p = dir * 85.0 + vec3(time * 0.3, -time * 0.21, time * 0.105);
  vec3 cell = floor(p);
  vec3 local = fract(p) - 0.5;
  float random = hash31(cell);
  float star = smoothstep(0.35, 0.0, length(local)) * step(0.98, random);
  return star * (0.65 + 0.35 * sin(4.0 * time + random * 32.0)) * 1.2;
}

vec3 skyColor(vec3 direction, float time) {
  vec3 dir = normalize(direction);
  dir = normalize(floor(dir * 220.0) / 220.0);
  float t = time * 0.05;
  vec2 q = dir.xy;
  float radius = length(q);
  float angle = atan(q.y, q.x);
  vec3 p = dir * 1.5;
  p += vec3(
    sin(dir.y * 4.0 + 0.1 * time),
    sin(dir.z * 5.0 - 0.085 * time),
    sin(dir.x * 4.5 + 0.065 * time)
  ) * 0.35;
  vec2 noiseFields = fields(p + vec3(t));
  float n1 = noiseFields.x;
  float n2 = noiseFields.y;
  float swirl = angle + radius * 7.0 - dir.z * 2.0 - 0.125 * time;
  float wave = sin(swirl * 3.0 + (n1 - n2) * 6.0);
  float bands = 0.5 + 0.5 * sin((n1 * 7.0 + n2 * 4.0 + wave * 0.8 + radius * 5.0) * 3.14159);
  bands = clamp((bands - 0.5) * 1.4 + 0.5, 0.0, 1.0);
  bands = smoothstep(0.272727, 0.727273, bands);
  float colorMix = 0.5 - 0.5 * cos(time * 0.12);
  vec3 colorA = mix(vec3(0.01, 0.03, 0.18), vec3(0.12, 0.0, 0.0), colorMix);
  vec3 colorB = mix(vec3(0.1, 0.3, 0.88), vec3(0.8, 0.04, 0.02), colorMix);
  vec3 colorC = mix(vec3(0.78, 0.9, 1.0), vec3(1.0, 0.28, 0.12), colorMix);
  vec3 fluid = mix(colorA, colorB, smoothstep(0.15, 0.65, bands));
  fluid = mix(fluid, colorC, smoothstep(0.55, 1.0, n2));
  float veins = smoothstep(0.42, 0.58, 0.5 + 0.5 * sin((n1 * 8.0 + n2 * 4.0 + 0.05 * time) * TAU));
  float grain = smoothstep(0.65, 1.0, fract(n1 * 7.13 + n2 * 11.71 + t * 0.25));
  float shape = (mix(veins, grain, 0.25) * 2.0 - 1.0) * 0.3;
  fluid *= 1.0 + shape;
  fluid = mix(fluid, fluid * colorC, clamp(shape * 0.5 + 0.5, 0.0, 1.0) * 0.15);
  float holes = smoothstep(0.28, 0.34, clamp(n1 * 0.7 + n2 * 0.3, 0.0, 1.0));
  float glow = clamp(1.0 - radius * 0.75, 0.0, 1.0);
  return fluid * holes + colorC * glow * glow * 0.35 + stars(dir, time);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution * 2.0 - 1.0;
  uv.y += 1.0;
  uv.x *= uResolution.x / uResolution.y;
  gl_FragColor = vec4(clamp(skyColor(vec3(uv, 1.0), uTime), 0.0, 1.0), 1.0);
}
`

const PsySkyCanvas = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useFullscreenShader(canvasRef, {
    fragment: FRAGMENT_SHADER,
    pixelRatio: skyPixelRatio,
    animate: active,
  })

  return <canvas ref={canvasRef} className={'block size-full'} />
}

const FXPsySky = ({ active }: { active: boolean }) => (
  <MountInView className={'size-full'}>
    <PsySkyCanvas active={active} />
  </MountInView>
)

export default FXPsySky
