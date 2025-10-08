import {makeProject, Vector2, waitFor} from '@revideo/core';
import {Txt, makeScene2D} from '@revideo/2d';

export const scene = makeScene2D('scene', function* (view) {
  // Filled text only (no stroke); removal of fill will make it invisible
  view.add(
    <Txt
      text={'Filled Text'}
      fontSize={72}
      fill={'#3366ff'}
      x={0}
      y={0}
    />,
  );

  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'project',
  scenes: [scene],
  settings: {
    shared: {
      background: '#ffffff',
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

