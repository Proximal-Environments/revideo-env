import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';

// This scene places four rectangles using origin-based edge shortcuts
// (top, bottom, left, right). We bypass TS typing via prop spread so
// it compiles even if the shortcuts are removed on the broken branch.
export const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Rect
      size={[100, 100]}
      fill={'#e74c3c'}
      // top edge centered at the top of the frame
      {...({top: [0, -240]} as any)}
    />,
  );

  view.add(
    <Rect
      size={[100, 100]}
      fill={'#2ecc71'}
      // bottom edge centered at the bottom of the frame
      {...({bottom: [0, 240]} as any)}
    />,
  );

  view.add(
    <Rect
      size={[100, 100]}
      fill={'#3498db'}
      // left edge centered at the left of the frame
      {...({left: [-320, 0]} as any)}
    />,
  );

  view.add(
    <Rect
      size={[100, 100]}
      fill={'#f1c40f'}
      // right edge centered at the right of the frame
      {...({right: [320, 0]} as any)}
    />,
  );
});

export const project = makeProject({
  name: 'origin_edges',
  scenes: [scene],
  settings: {
    shared: {
      background: '#ffffff',
      range: [0, 1],
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

