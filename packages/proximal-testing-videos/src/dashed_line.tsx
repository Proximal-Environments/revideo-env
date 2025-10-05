import {makeProject, Vector2} from '@revideo/core';
import {Line, makeScene2D, Txt} from '@revideo/2d';
import {waitFor} from '@revideo/core';

export const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Txt y={-200} fontSize={32} fill={'#333'}>
      Dashed line stroke
    </Txt>,
  );

  view.add(
    <Line
      stroke={'#D9534F'}
      lineWidth={16}
      lineCap={'butt'}
      lineDash={[24, 16]}
      points={[
        [-220, 0],
        [-80, -40],
        [80, 40],
        [220, 0],
      ]}
    />,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'project',
  scenes: [scene],
  variables: {},
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

export default project;

