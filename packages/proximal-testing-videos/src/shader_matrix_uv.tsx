import {makeProject, Vector2, createRef, waitFor} from '@revideo/core';
import {makeScene2D, Rect} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  const r = createRef<Rect>();

  view.add(
    <Rect
      ref={r}
      size={new Vector2(320, 240)}
      fill={'#4060ff'}
      rotation={0}
      shaders={[
        {
          fragment: `#version 300 es
precision highp float;

#include "@revideo/core/shaders/common.glsl"

// Draw a radial gradient in destination space to validate destinationMatrix
void main() {
  // destinationUV is in [0,1] across the final canvas
  vec2 uv = destinationUV;
  vec2 c = vec2(0.5, 0.5);
  float d = distance(uv, c);
  float ring = smoothstep(0.35, 0.34, d) * 0.8 + smoothstep(0.15, 0.14, d);
  vec4 src = texture(sourceTexture, sourceUV);
  vec3 col = mix(src.rgb, vec3(1.0, 0.9, 0.2), ring);
  outColor = vec4(col, src.a);
}
`,
        },
      ]}
    />,
  );

  // Move and rotate to ensure destinationUV/matrices vary
  r().rotation(0);
  yield* waitFor(0.3);
  r().rotation(25);
  yield* waitFor(0.3);
  r().position([100, -60]);
  yield* waitFor(0.4);
});

export const project = makeProject({
  name: 'shader_matrix_uv',
  experimentalFeatures: true,
  scenes: [scene],
  settings: {
    shared: {
      background: '#101014',
      range: [0, 1.2],
      size: new Vector2(640, 480),
    },
    preview: {
      fps: 30,
      resolutionScale: 1,
    },
    rendering: {
      exporter: {
        name: '@revideo/core/ffmpeg',
        options: {
          format: 'mp4',
        },
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

