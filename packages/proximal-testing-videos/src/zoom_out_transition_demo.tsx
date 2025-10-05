import {makeProject, Vector2, waitFor, BBox, zoomOutTransition} from '@revideo/core';
import {Rect, Txt, makeScene2D} from '@revideo/2d';

const first = makeScene2D('first', function* (view) {
  view.add(
    <Rect
      width={'100%'}
      height={'100%'}
      fill={'lightseagreen'}
      layout
      alignItems={'end'}
      justifyContent={'end'}
      padding={40}
    >
      <Txt fontSize={80} fontWeight={700} fill={'#fff'}>
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
      alignItems={'start'}
      justifyContent={'start'}
      padding={40}
    >
      <Txt fontSize={80} fontWeight={700} fill={'#fff'}>
        SECOND (ZOOM OUT)
      </Txt>
    </Rect>,
  );

  // Zoom out from a central rectangle area when transitioning in
  const area = new BBox(120, 90, 200, 150);
  yield* zoomOutTransition(area, 0.8);
  yield* waitFor(1);
});

export const project = makeProject({
  name: 'zoom-out-transition-demo',
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

