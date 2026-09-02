import { useRef, useState } from 'react'
import { MountInView } from 'ui/fx/MountInView'
import { useFullscreenShader } from 'utils/anim/fullscreen-shader'
import { prefersReducedMotion } from 'utils/browser/prefers-reduced-motion'
import { cns } from 'utils/formatters/classnames'

const createFragmentShader = ({
  background,
  contour,
  band,
  contourStrength,
  bandStrength,
}: {
  background: string
  contour: string
  band: string
  contourStrength: string
  bandStrength: string
}) => `
#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 uResolution;
uniform float uTime;

const vec2 FIELD_SCALE = vec2(1., 1.);
const float BROAD_NOISE_SCALE = 0.72;
const float MIDDLE_NOISE_SCALE = 1.38;
const float DETAIL_NOISE_SCALE = 2.65;

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
  float broad = noise21(p * BROAD_NOISE_SCALE + drift);
  float middle = noise21(p * MIDDLE_NOISE_SCALE - drift * 0.7 + 8.4);
  float detail = noise21(p * DETAIL_NOISE_SCALE + drift * 0.35 + 19.7);
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
  vec2 p = (uv - 0.5) * FIELD_SCALE * aspect;
  p += vec2(0.18, -0.12);

  float value = field(p, uTime);
  float fine = contour(value, 6.0, 0.52);
  float glow = contour(value, 6.0, 2.2);
  float bands = horizontalBand(uv, 0.48);
  float bandGlow = horizontalBand(uv, 1.9);

  vec3 background = ${background};
  vec3 contourInk = ${contour};
  vec3 bandInk = ${band};
  float contourMix = clamp(${contourStrength}, 0.0, 1.0);
  float bandMix = clamp(${bandStrength}, 0.0, 1.0);
  vec3 color = mix(background, contourInk, contourMix);
  color = mix(color, bandInk, bandMix);

  gl_FragColor = vec4(color, 1.0);
}
`

const FRAGMENT_SHADERS = {
  light: createFragmentShader({
    background: 'vec3(1.0)',
    contour: 'vec3(0.28, 0.42, 0.37)',
    band: 'vec3(0.72, 0.24, 0.08)',
    contourStrength: 'glow * 0.035 + fine * 0.28',
    bandStrength: 'bandGlow * 0.02 + bands * 0.18',
  }),
  'dark-red': createFragmentShader({
    background: 'vec3(0.055, 0.008, 0.012)',
    contour: 'vec3(0.38, 0.035, 0.025)',
    band: 'vec3(0.5, 0.06, 0.018)',
    contourStrength: 'glow * 0.08 + fine * 0.58',
    bandStrength: 'bandGlow * 0.03 + bands * 0.24',
  }),
} as const

type ProjectTitleChartPalette = keyof typeof FRAGMENT_SHADERS

const ProjectTitleChartCanvas = ({
  animate,
  palette,
}: {
  animate: boolean
  palette: ProjectTitleChartPalette
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reduced] = useState(prefersReducedMotion)

  useFullscreenShader(canvasRef, {
    fragment: FRAGMENT_SHADERS[palette],
    extension: 'OES_standard_derivatives',
    animate: animate && !reduced,
  })

  return <canvas ref={canvasRef} className={'block size-full'} />
}

export const ProjectTitleChart = ({
  animate,
  inverted = false,
  palette = 'light',
  className,
}: {
  animate: boolean
  inverted?: boolean
  palette?: ProjectTitleChartPalette
  className?: string
}) => (
  <MountInView
    decorative
    className={cns(
      'pointer-events-none absolute inset-0 size-full',
      palette === 'dark-red' ? 'bg-[#0e0203]' : 'bg-text',
      inverted && 'invert',
      className,
    )}
  >
    <ProjectTitleChartCanvas animate={animate} palette={palette} />
  </MountInView>
)
