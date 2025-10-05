import {makeProject, Vector2} from '@revideo/core';
import {Circle, Rect, makeScene2D} from '@revideo/2d';
import {all, createRef, waitFor} from '@revideo/core';

// Tests destination-out masking: a moving circle cuts a hole in a rectangle.
// Without compositeOperation support, the circle draws normally instead of masking.
export const scene = makeScene2D('scene', function* (view) {
  const holeRef = createRef<Circle>();

  // Solid background rectangle
  view.add(
    <Rect size={['100%', '100%']} fill={'#204070'} />,
  );

  // Foreground rectangle we will punch a hole into
  view.add(
    <Rect width={'70%'} height={'50%'} fill={'#FF6A00'} radius={20} smoothCorners />,
  );

  yield* waitFor(0.2);

  // Moving circle with destination-out to cut a hole
  view.add(
    <Circle
      ref={holeRef}
      width={180}
      height={180}
      compositeOperation={'destination-out'}
      position={[-150, 0]}
      fill={'#000'}
    />,
  );

  // Animate the hole across the rectangle
  yield* all(
    holeRef().position([150, 0], 1.2),
  );
});

export const project = makeProject({
  name: 'project',
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

