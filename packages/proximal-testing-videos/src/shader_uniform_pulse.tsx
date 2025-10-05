import {createSignal, makeProject, Vector2, waitFor} from '@revideo/core';
import {makeScene2D, Rect} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  const intensity = createSignal(0);

  view.add(
    <Rect
      size={new Vector2(480, 360)}
      fill={'#ffffff'}
      shaders={[
        {
          fragment: `#version 300 es
precision highp float;

#include "@revideo/core/shaders/common.glsl"

uniform float intensity;

void main() {
  vec4 src = texture(sourceTexture, sourceUV);
  float factor = 0.25 + 0.75 * intensity; // 0.25..1.0
  outColor = vec4(src.rgb * factor, src.a);
}
`,
          uniforms: {
            intensity: () => intensity(),
          },
        },
      ]}
    />,
  );

  // Animate the uniform value over time to verify per-frame updates
  intensity(0);
  intensity(1);
  yield* waitFor(0.5);
  intensity(0.2);
  yield* waitFor(0.5);
  intensity(0.8);
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'shader_uniform_pulse',
  experimentalFeatures: true,
  scenes: [scene],
  settings: {
    shared: {
      background: '#000000',
      range: [0, 2],
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

