import {makeProject, Vector2} from '@revideo/core';
import {Img, Rect, makeScene2D} from '@revideo/2d';

// Purpose: verifies that Img pixels are clipped to the node's rounded-rect path.
// Expected difference when clipping is removed: image pixels remain visible in the
// rounded corners (spilling outside the intended mask), causing visible changes at the corners.

export const scene = makeScene2D('scene', function* (view) {
  // High-contrast background to make corner spill obvious
  view.add(<Rect fill={'#ffffff'} size={['100%', '100%']} />);

  // Use a colorful remote image so corner spill is clearly visible
  view.add(
    <Img
      src={'https://images.unsplash.com/photo-1679218407381-a6f1660d60e9?w=960&q=80&auto=format'}
      width={480}
      height={360}
      radius={80}
      lineWidth={6}
      stroke={'#ff0000'}
      smoothing={true}
    />,
  );
});

export const project = makeProject({
  name: 'img_rounded_corners',
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

