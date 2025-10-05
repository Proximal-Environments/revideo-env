import {makeProject, Vector2} from '@revideo/core';
import {makeScene2D, Rect} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  const rect = createRef<Rect>();

  view.add(
    <Rect
      ref={rect}
      x={0}
      y={0}
      width={240}
      height={160}
      fill={'#E74C3C'}
      radius={20}
      shadowColor={'rgba(50,50,50,0.9)'}
      shadowBlur={30}
      shadowOffset={{x: -40, y: -10}}
    />,
  );

  // Animate the shadow offset to ensure dynamic shadow rendering works.
  yield* waitFor(0.2);
  yield* rect().shadowOffset({x: 40, y: 25}, 0.8);
  yield* rect().shadowOffset({x: 0, y: 0}, 0.6);
  yield* waitFor(0.2);
});

export const project = makeProject({
  name: 'shadow-animated',
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

