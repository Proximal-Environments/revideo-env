import {makeProject, Vector2} from '@revideo/core';
import {Img, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// Purpose: Validate per-media alpha blending on Img (alpha=0.5)
// Expectation (gold): Image blends with background; (removed feature): fully opaque image

const scene = makeScene2D('scene', function* (view) {
  // Give the image time to load before first frame capture
  yield* waitFor(0.1);

  view.add(
    <Img
      src={'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'}
      width={'60%'}
      alpha={0.5}
    />,
  );
});

export const project = makeProject({
  name: 'img_alpha_half',
  scenes: [scene],
  settings: {
    shared: {
      // Strong colored background to make blending differences obvious
      background: '#0044FF',
      range: [0, 1],
      size: new Vector2(640, 480),
    },
    preview: {
      fps: 30,
      resolutionScale: 1,
    },
    rendering: {
      exporter: { name: '@revideo/core/ffmpeg', options: { format: 'mp4' } },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

