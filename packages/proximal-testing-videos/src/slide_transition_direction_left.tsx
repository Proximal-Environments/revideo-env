import {Rect, Txt, makeScene2D} from '@revideo/2d';
import {
  all,
  createRef,
  makeProject,
  Vector2,
  waitFor,
  slideTransition,
  Direction,
} from '@revideo/core';

const first = makeScene2D('first', function* (view) {
  view.add(
    <Rect
      width={'100%'}
      height={'100%'}
      fill={'palegreen'}
      layout
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Txt fontSize={120} fontWeight={700} fill={'#222'} fontFamily={'"JetBrains Mono", monospace'}>
        FIRST SCENE
      </Txt>
    </Rect>,
  );
  yield* waitFor(0.6);
});

const second = makeScene2D('second', function* (view) {
  const rect = createRef<Rect>();
  const text = createRef<Txt>();

  view.add(
    <Rect
      ref={rect}
      width={'100%'}
      height={'100%'}
      fill={'lightpink'}
      layout
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Txt
        ref={text}
        fontSize={120}
        fontWeight={700}
        fill={'#222'}
        fontFamily={'"JetBrains Mono", monospace'}
      >
        SECOND SCENE
      </Txt>
    </Rect>,
  );

  // Explicit direction and longer duration
  yield* slideTransition(Direction.Left, 0.8);

  yield* waitFor(0.3);
  yield* all(rect().fill('lightskyblue', 0.4), text().text('AFTER SLIDE', 0.4));
});

export default makeProject({
  name: 'slide-dir-left',
  scenes: [first, second],
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

