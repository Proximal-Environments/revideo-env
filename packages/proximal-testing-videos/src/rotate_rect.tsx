import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  const r = createRef<Rect>();

  view.add(
    <Rect ref={r} width={220} height={120} fill={'#e74c3c'} x={0} y={0} />, // off-square for obvious rotation
  );

  yield* waitFor(0.2);
  // Rotate visibly; if rotation is ignored, rectangle stays horizontal
  yield* r().rotation(180, 1.2);
  yield* waitFor(0.2);
});

export const project = makeProject({
  name: 'rotate_rect',
  scenes: [scene],
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
        options: {format: 'mp4'},
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

