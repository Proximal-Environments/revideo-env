import {makeProject, Vector2, waitFor} from '@revideo/core';
import {fadeTransition} from '@revideo/core';
import {Rect, Txt, makeScene2D} from '@revideo/2d';

const first = makeScene2D('first', function* (view) {
  view.add(
    <Rect
      width={'100%'}
      height={'100%'}
      fill={'lightseagreen'}
      layout
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Txt fontSize={120} fontWeight={700} fill={'#fff'}>
        FIRST
      </Txt>
    </Rect>,
  );

  yield* waitFor(1);
});

const second = makeScene2D('second', function* (view) {
  view.add(
    <Rect
      width={'100%'}
      height={'100%'}
      fill={'lightcoral'}
      layout
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Txt fontSize={120} fontWeight={700} fill={'#fff'}>
        SECOND (FADE)
      </Txt>
    </Rect>,
  );

  yield* fadeTransition(0.8);
  yield* waitFor(1);
});

export const project = makeProject({
  name: 'fade-transition-demo',
  scenes: [first, second],
  settings: {
    shared: {
      background: '#000000',
      range: [0, Infinity],
      size: new Vector2(640, 480),
    },
    preview: {fps: 30, resolutionScale: 1},
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

