import {makeProject, Vector2, createRef, waitFor} from '@revideo/core';
import {makeScene2D, Circle} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  const circle = createRef<Circle>();

  view.add(
    <Circle ref={circle} size={160} fill={'#ff3333'} />, // red circle center
  );

  // Small pause, then trigger a visible ripple
  yield* waitFor(0.5);
  yield* circle().ripple(0.8);
  yield* waitFor(0.2);
});

export const project = makeProject({
  name: 'ripple_circle',
  scenes: [scene],
  settings: {
    shared: {
      background: '#000000',
      range: [0, Infinity],
      size: new Vector2(640, 480),
    },
    preview: {fps: 30, resolutionScale: 1},
    rendering: {
      exporter: {name: '@revideo/core/ffmpeg', options: {format: 'mp4'}},
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

