import {makeProject, Vector2, createRef, waitFor} from '@revideo/core';
import {makeScene2D, Path} from '@revideo/2d';

// Demonstrates fixed startOffset/endOffset trimming (no animation)
const scene = makeScene2D('scene', function* (view) {
  const path = createRef<Path>();

  view.add(
    <Path
      ref={path}
      data={'M -260 0 L -130 -100 L 0 0 L 130 100 L 260 0'}
      stroke={'white'}
      lineWidth={18}
      closed={false}
      // Trim 60px off the start and 80px off the end
      startOffset={60}
      endOffset={80}
    />,
  );

  // Hold so the trimmed segment is clearly visible
  yield* waitFor(3);
});

export const project = makeProject({
  name: 'curve_trim_offsets',
  scenes: [scene],
  settings: {
    shared: {
      background: 'black',
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

