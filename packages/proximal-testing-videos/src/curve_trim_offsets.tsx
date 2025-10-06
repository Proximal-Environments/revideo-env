import {makeProject, Vector2} from '@revideo/core';
import {Circle, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Circle
      x={0}
      y={0}
      radius={160}
      lineWidth={12}
      stroke={'#ffcc00'}
      // Use both percentage trims and pixel offsets
      start={0.25}
      end={0.75}
      startOffset={40}
      endOffset={60}
      startArrow
      endArrow
      arrowSize={28}
    />,
  );

  // Static frame showing trimmed segment with offsets for 2 seconds
  yield* waitFor(2);
});

export const project = makeProject({
  name: 'curve-trim-offsets',
  scenes: [scene],
  settings: {
    shared: {
      background: '#202020',
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

