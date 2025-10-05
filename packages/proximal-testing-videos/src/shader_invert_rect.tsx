import {makeProject, Vector2} from '@revideo/core';
import {makeScene2D, Rect} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Rect
      size={new Vector2(480, 360)}
      position={[0, 0]}
      fill={'#ff0000'}
      shaders={[
        {
          fragment: `#version 300 es
precision highp float;

#include "@revideo/core/shaders/common.glsl"

void main() {
  vec4 src = texture(sourceTexture, sourceUV);
  outColor = vec4(vec3(1.0) - src.rgb, src.a);
}
`,
        },
      ]}
    />,
  );
});

export const project = makeProject({
  name: 'shader_invert_rect',
  experimentalFeatures: true,
  scenes: [scene],
  settings: {
    shared: {
      background: '#202020',
      range: [0, 1],
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

