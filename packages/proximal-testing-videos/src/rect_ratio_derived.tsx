import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// Purpose: Verify that generic Layout/Shape nodes (Rect) use ratio to derive the missing dimension.
// In the gold implementation, width-only + ratio should compute height via CSS aspect-ratio.
// With the removed feature, aspect-ratio is cleared, so height won't be derived and the Rect will differ (often collapsing vertically).
export const scene = makeScene2D('scene', function* (view) {
  // Background to show contrast
  view.add(<Rect size={['100%', '100%']} fill={'#333'} />);

  // Derived-height rectangle: width 50% and ratio 1/2 => expected height is 25% of container in gold
  view.add(
    <Rect
      width={'50%'}
      ratio={0.5}
      fill={'#ff5555'}
    />,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'rect_ratio_derived',
  scenes: [scene],
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

