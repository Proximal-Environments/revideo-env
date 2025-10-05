import {makeProject, Vector2, createRef, waitFor} from '@revideo/core';
import {makeScene2D, Rect} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  const rect = createRef<Rect>();

  view.add(
    <Rect
      ref={rect}
      size={[240, 160]}
      radius={24}
      fill={'#33aaff'}
      stroke={'#ffffff'}
      lineWidth={6}
    />,
  );

  yield* waitFor(0.5);
  yield* rect().ripple(0.8);
  yield* waitFor(0.2);
});

export const project = makeProject({
  name: 'ripple_rect',
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

