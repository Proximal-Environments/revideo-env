import {makeProject, Vector2} from '@revideo/core';
import {Img, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// This scene renders a small image scaled up with smoothing disabled.
// On the gold branch (feature present), this should appear pixelated.
// On the removed-feature branch, smoothing is ignored and default smoothing applies, so it will appear smoothed.
export const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Img
      // Tiny logical size, later upscaled via transform to amplify interpolation differences
      width={'1%'}
      // Intentionally disable smoothing to force nearest-neighbor on gold branch
      smoothing={false}
      src={'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'}
      // Upscale aggressively to make the difference obvious
      scale={40}
    />,
  );

  // Hold for 1 second to produce a short, deterministic clip
  yield* waitFor(1);
});

export const project = makeProject({
  name: 'smoothing_img_false',
  scenes: [scene],
  variables: {},
  settings: {
    shared: {
      background: '#FFFFFF',
      range: [0, Infinity],
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

