import {makeProject, Vector2, waitFor} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';

// Static scene showing combined X and Y skew
export const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Rect
      width={260}
      height={160}
      x={0}
      y={0}
      fill={'#55CC55'}
      stroke={'#1F5F1F'}
      lineWidth={4}
      skewX={20}
      skewY={10}
    />,
  );

  yield* waitFor(0.8);
});

export const project = makeProject({
  name: 'skew_both_rect',
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

