import {makeProject, Vector2, waitFor} from '@revideo/core';
import {Rect, makeScene2D, Layout} from '@revideo/2d';

// Scene combining translation, rotation, scaling and skew to test composition order
export const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Layout x={-80} y={-30} rotation={15}>
      <Rect
        width={220}
        height={140}
        x={0}
        y={0}
        fill={'#AA66CC'}
        stroke={'#3E1F4F'}
        lineWidth={4}
        scaleX={1.2}
        scaleY={0.9}
        skewX={30}
        skewY={12}
      />
    </Layout>,
  );

  yield* waitFor(0.8);
});

export const project = makeProject({
  name: 'skew_with_transform',
  scenes: [scene],
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

