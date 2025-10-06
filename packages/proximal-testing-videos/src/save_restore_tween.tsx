import {makeProject, Vector2, waitFor, all, createRef} from '@revideo/core';
import {Circle, makeScene2D} from '@revideo/2d';

// This scene demonstrates Node.save() with tweened Node.restore(duration).
// Gold branch: restore(duration) animates back over the given time.
// Removed-feature branch: restore() completes immediately and does not change state.
const scene = makeScene2D('scene', function* (view) {
  const circle = createRef<Circle>();

  view.add(
    <Circle ref={circle} size={140} position={[-250, -150]} fill={'#3aa0ff'} />,
  );

  yield* waitFor(0.3);

  // Save A
  circle().save();
  // Move/scale to B
  yield* all(circle().position([0, -150], 0.8), circle().scale(0.7, 0.8));

  // Save B
  circle().save();
  // Move/rotate to C
  yield* all(circle().position([250, 120], 0.8), circle().rotation(120, 0.8));

  // Tween back to B over 0.8s (gold) vs instant no-op (removed feature)
  yield* circle().restore(0.8);

  // Tween back to A over 0.8s (gold) vs still unchanged (removed feature)
  yield* circle().restore(0.8);

  // Hold to stabilize final frames
  yield* waitFor(0.7);
});

export const project = makeProject({
  name: 'save_restore_tween',
  scenes: [scene],
  settings: {
    shared: {
      background: '#101010',
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

