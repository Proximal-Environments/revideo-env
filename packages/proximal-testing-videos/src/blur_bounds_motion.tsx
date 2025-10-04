import {makeProject, Vector2, waitFor, createRef} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';
import {Gradient, blur} from '@revideo/2d';

const W = 640;
const H = 480;

/**
 * A moving blurred rect near edges to exercise blur-induced cache bbox expansion.
 * Without blur support/expansion, edges appear hard or clipped; with it, soft edges extend.
 */
export const scene = makeScene2D('scene', function* (view) {
  const fill = new Gradient({
    type: 'linear',
    from: [-80, -60],
    to: [80, 60],
    stops: [
      {offset: 0, color: '#ff8a00'},
      {offset: 1, color: '#8a00ff'},
    ],
  });

  const r = createRef<Rect>();

  view.add(
    <Rect
      ref={r}
      size={[160, 120]}
      position={[-W / 2 + 100, 0]}
      fill={fill}
      filters={[blur(10)]}
    />,
  );

  // Move horizontally across the screen, including near edges.
  yield* r().x(W / 2 - 100, 1.5);
  yield* r().x(-W / 2 + 100, 1.5);
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'blur_bounds_motion',
  scenes: [scene],
  settings: {
    shared: {
      background: '#ffffff',
      range: [0, 4],
      size: new Vector2(W, H),
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

