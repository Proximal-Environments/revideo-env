import {makeProject, Vector2} from '@revideo/core';
import {Img, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// Purpose: Validate alpha=0 on Img (should skip drawing)
// Expectation (gold): Only background visible; (removed feature): image shows fully opaque

const scene = makeScene2D('scene', function* (view) {
  yield* waitFor(0.1);

  view.add(
    <Img
      src={'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'}
      width={'60%'}
      alpha={0}
    />,
  );
});

export const project = makeProject({
  name: 'img_alpha_zero',
  scenes: [scene],
  settings: {
    shared: {
      background: '#AA2222',
      range: [0, 1],
      size: new Vector2(640, 480),
    },
    preview: { fps: 30, resolutionScale: 1 },
    rendering: {
      exporter: { name: '@revideo/core/ffmpeg', options: { format: 'mp4' } },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

