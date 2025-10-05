import {makeProject, Vector2} from '@revideo/core';
import {Rect, Video, makeScene2D} from '@revideo/2d';

// Purpose: verifies that Video pixels are clipped to the node's rounded-rect path.
// Expected difference when clipping is removed: video pixels remain visible in the
// rounded corners (spilling outside the intended mask), causing visible changes at the corners.

export const scene = makeScene2D('scene', function* (view) {
  // High-contrast background to make corner spill obvious
  view.add(<Rect fill={'#ffffff'} size={['100%', '100%']} />);

  // Place a video with large corner radius; content should be masked to rounded rect
  view.add(
    <Video
      src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'}
      width={480}
      height={360}
      radius={80}
      lineWidth={6}
      stroke={'#ff0000'}
      play={false}
      time={1.2}
    />,
  );
});

export const project = makeProject({
  name: 'video_rounded_corners',
  scenes: [scene],
  settings: {
    shared: {
      background: '#FFFFFF',
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

