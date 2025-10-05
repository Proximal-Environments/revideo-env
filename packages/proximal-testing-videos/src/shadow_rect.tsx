import {makeProject, Vector2} from '@revideo/core';
import {makeScene2D, Rect} from '@revideo/2d';
import {all, createRef, waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  const rect = createRef<Rect>();

  // Place a rectangle near the top-left to exercise shadow bbox expansion.
  view.add(
    <Rect
      ref={rect}
      x={-200}
      y={-140}
      width={200}
      height={140}
      fill={'#2E86DE'}
      radius={16}
      // Strong, colored shadow with offset to be clearly visible.
      shadowColor={'rgba(0,0,0,0.8)'}
      shadowBlur={24}
      shadowOffset={{x: 24, y: 24}}
    />,
  );

  // Small motion so caching/path updates are exercised with shadows.
  yield* waitFor(0.2);
  yield* all(rect().x(0, 0.6), rect().y(0, 0.6));
  yield* waitFor(0.2);
});

export const project = makeProject({
  name: 'shadow-rect',
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

