import {Rect, Txt, makeScene2D} from '@revideo/2d';
import {
  all,
  createRef,
  makeProject,
  Origin,
  Vector2,
  waitFor,
  slideTransition,
} from '@revideo/core';

const first = makeScene2D('first', function* (view) {
  view.add(
    <Rect
      width={'100%'}
      height={'100%'}
      fill={'peachpuff'}
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
      fill={'thistle'}
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

  // Origin-based form, shorter duration
  yield* slideTransition(Origin.TopRight, 0.5);

  yield* waitFor(0.3);
  yield* all(rect().fill('khaki', 0.4), text().text('AFTER SLIDE', 0.4));
});

export default makeProject({
  name: 'slide-origin-topright',
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

