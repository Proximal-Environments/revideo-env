import {makeProject, Vector2} from '@revideo/core';
import {Txt, makeScene2D} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  const t = createRef<Txt>();

  view.add(
    <Txt ref={t} fontSize={64} fill={'#2c3e50'}>
      ROTATE
    </Txt>,
  );

  yield* waitFor(0.2);
  // Text rotation should clearly change glyph orientation
  yield* t().rotation(90, 1.0);
  yield* waitFor(0.2);
});

export const project = makeProject({
  name: 'rotate_txt',
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

