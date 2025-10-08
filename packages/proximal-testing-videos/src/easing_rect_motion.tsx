import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';
import {createRef, waitFor, chain, all} from '@revideo/core';

// This scene uses only vector shapes to ensure deterministic pixels.
// It exercises default tween timing by animating position and scale.
const scene = makeScene2D('scene', function* (view) {
  const box = createRef<Rect>();

  // Background to stabilize compression and provide contrast
  view.add(<Rect size={'100%'} fill={'#222'} />);

  // Add a red square starting on the left
  view.add(
    <Rect
      ref={box}
      width={80}
      height={80}
      fill={'#e53935'}
      x={-220}
      y={0}
      radius={8}
    />,
  );

  // Small lead-in to avoid first-frame differences
  yield* waitFor(0.2);

  // Parallel tween: move to the right while scaling up.
  // With eased timing, midpoint frames differ from linear.
  yield* all(box().x(220, 2), box().scale(1.8, 2));

  // Chain another motion back to center to exercise sequencing
  yield* chain(box().x(0, 1));
});

export const project = makeProject({
  name: 'easing-rect-motion',
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

