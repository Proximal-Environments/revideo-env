import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// Non-uniform scaling (scaleX/scaleY). Without scale in transforms, the rectangle remains a square.
const scene = makeScene2D('scene', function* (view) {
  view.add(<Rect size={'100%'} fill={'#ffffff'} />);

  view.add(
    <Rect
      size={[100, 100]}
      fill={'#ff6347'}
      position={[0, 0]}
      scaleX={3}
      scaleY={0.5}
    />,
  );

  yield* waitFor(0.5);
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
        options: {format: 'mp4'},
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

