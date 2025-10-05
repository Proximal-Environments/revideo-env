import {makeProject, Vector2} from '@revideo/core';
import {Video, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// This scene renders a video with a tiny logical size and large scale, with smoothing disabled.
// On the gold branch, expect blocky nearest-neighbor scaling; on removed-feature branch, smoothed scaling.
export const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Video
      src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'}
      // Give the node a tiny layout size, then upscale via transform
      width={'1%'}
      // Intentionally disable smoothing to force nearest-neighbor on gold branch
      smoothing={false}
      scale={40}
      play={true}
    />,
  );

  // Hold for 1 second; content moves so even a short duration is enough for detection
  yield* waitFor(1);
});

export const project = makeProject({
  name: 'smoothing_video_false',
  scenes: [scene],
  variables: {},
  settings: {
    shared: {
      background: '#000000',
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

