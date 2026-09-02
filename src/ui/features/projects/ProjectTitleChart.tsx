import { useRef, useState } from 'react'
import { useFullscreenShader } from 'utils/anim/fullscreen-shader'
import { prefersReducedMotion } from 'utils/browser/prefers-reduced-motion'
import { cns } from 'utils/formatters/classnames'

const FRAGMENT_SHADER = `
#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 uResolution;
uniform float uTime;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise21(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x),
    f.y
  );
}

float field(vec2 p, float time) {
  vec2 drift = vec2(time * 0.035, -time * 0.018);
  float broad = noise21(p * 0.72 + drift);
  float middle = noise21(p * 1.38 - drift * 0.7 + 8.4);
  float detail = noise21(p * 2.65 + drift * 0.35 + 19.7);
  float sweep = sin(p.x * 0.72 + sin(p.y * 0.54 - time * 0.08)) * 0.18;
  return broad * 0.58 + middle * 0.28 + detail * 0.14 + sweep;
}

float contour(float value, float count, float thickness) {
  float phase = value * count;
  float band = abs(fract(phase) - 0.5);
  float width = max(fwidth(phase) * thickness, 0.001);
  return 1.0 - smoothstep(width, width * 1.65, band);
}

float horizontalBand(vec2 uv, float thickness) {
  float phase = (uv.y + 0.035) * 8.0;
  float band = abs(fract(phase) - 0.5);
  float width = max(fwidth(phase) * thickness, 0.001);
  return 1.0 - smoothstep(width, width * 1.65, band);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect.x * 0.72, 1.15);
  p += vec2(0.18, -0.12);

  float value = field(p, uTime);
  float fine = contour(value, 6.0, 0.52);
  float glow = contour(value, 6.0, 2.2);
  float bands = horizontalBand(uv, 0.48);
  float bandGlow = horizontalBand(uv, 1.9);

  vec3 contourInk = vec3(0.28, 0.42, 0.37);
  vec3 amber = vec3(0.72, 0.24, 0.08);
  float contourStrength = clamp(glow * 0.035 + fine * 0.28, 0.0, 1.0);
  float bandStrength = clamp(bandGlow * 0.02 + bands * 0.18, 0.0, 1.0);
  vec3 color = mix(vec3(1.0), contourInk, contourStrength);
  color = mix(color, amber, bandStrength);

  gl_FragColor = vec4(color, 1.0);
}
`

export const ProjectTitleChart = ({
  animate,
  inverted = false,
}: {
  animate: boolean
  inverted?: boolean
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reduced] = useState(prefersReducedMotion)

  useFullscreenShader(canvasRef, {
    fragment: FRAGMENT_SHADER,
    extension: 'OES_standard_derivatives',
    animate: animate && !reduced,
  })

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cns(
        'pointer-events-none absolute inset-0 size-full bg-text',
        inverted && 'invert',
      )}
    />
  )
}
