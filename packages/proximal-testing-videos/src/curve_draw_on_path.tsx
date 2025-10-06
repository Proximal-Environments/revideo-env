import {makeProject, Vector2, createRef, waitFor} from '@revideo/core';
import {makeScene2D, Path} from '@revideo/2d';

// Demonstrates animated draw-on via end from 0 -> 1
const scene = makeScene2D('scene', function* (view) {
  const path = createRef<Path>();

  view.add(
    <Path
      ref={path}
      data={'M -240 -120 L 240 -120 L 240 120 L -240 120 Z'}
      stroke={'white'}
      lineWidth={16}
      closed={false}
      end={0}
    />,
  );

  // Give a short lead-in, then animate the path drawing on
  yield* waitFor(0.5);
  yield* path().end(1, 2);
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'curve_draw_on_path',
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

