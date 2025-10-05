import {makeProject, Vector2, createRef, waitFor} from '@revideo/core';
import {makeScene2D, Polygon} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  const poly = createRef<Polygon>();

  view.add(
    <Polygon
      ref={poly}
      size={200}
      sides={5}
      radius={12}
      fill={'#66ff66'}
      stroke={'#ffffff'}
      lineWidth={4}
    />,
  );

  yield* waitFor(0.5);
  yield* poly().ripple(0.8);
  yield* waitFor(0.2);
});

export const project = makeProject({
  name: 'ripple_polygon',
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

