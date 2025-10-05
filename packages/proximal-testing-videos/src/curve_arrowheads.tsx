import {makeProject, Vector2} from '@revideo/core';
import {Line, makeScene2D, Txt} from '@revideo/2d';
import {waitFor} from '@revideo/core';

export const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Txt y={-200} fontSize={32} fill={'#333'}>
      Polyline with end arrowhead
    </Txt>,
  );

  // A simple polyline with an end arrow; arrowheads use stroke color
  view.add(
    <Line
      stroke={'#2E7D32'}
      lineWidth={14}
      lineCap={'round'}
      endArrow
      arrowSize={22}
      points={[
        [-220, 60],
        [-80, -20],
        [80, 20],
        [200, -40],
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

