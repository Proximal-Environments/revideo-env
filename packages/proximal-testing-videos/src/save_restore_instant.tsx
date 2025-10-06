import {makeProject, Vector2, waitFor, all, createRef} from '@revideo/core';
import {Circle, makeScene2D} from '@revideo/2d';

// This scene demonstrates Node.save() and immediate Node.restore().
// Gold branch: restore() reverts instantly to saved state.
// Removed-feature branch: restore() is a no-op, so the modified state persists.
const scene = makeScene2D('scene', function* (view) {
  const circle = createRef<Circle>();

  view.add(
    <Circle ref={circle} size={120} position={[-200, 0]} fill={'#e13238'} />,
  );

  // Hold initial frame briefly
  yield* waitFor(0.5);

  // Save the state at x = -200
  circle().save();

  // Move and scale for a visible change
  yield* all(circle().position.x(150, 0.8), circle().scale(1.5, 0.8));

  // Further change so the difference after restore is obvious
  yield* all(circle().rotation(90, 0.6), circle().position.x(250, 0.6));

  // Immediate restore to saved state (gold) vs no-op (removed-feature)
  circle().restore();

  // Hold final state to make comparison stable
  yield* waitFor(1);
});

export const project = makeProject({
  name: 'save_restore_instant',
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
        options: {format: 'mp4'},
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

