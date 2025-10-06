import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';

// This scene places four rectangles using origin-based corner shortcuts
// (topLeft, topRight, bottomLeft, bottomRight). Prop spread bypasses TS.
export const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Rect
      size={[100, 100]}
      fill={'#9b59b6'}
      // top-left corner of rect at top-left of frame
      {...({topLeft: [-320, -240]} as any)}
    />,
  );

  view.add(
    <Rect
      size={[100, 100]}
      fill={'#1abc9c'}
      // top-right corner of rect at top-right of frame
      {...({topRight: [320, -240]} as any)}
    />,
  );

  view.add(
    <Rect
      size={[100, 100]}
      fill={'#e67e22'}
      // bottom-left corner of rect at bottom-left of frame
      {...({bottomLeft: [-320, 240]} as any)}
    />,
  );

  view.add(
    <Rect
      size={[100, 100]}
      fill={'#34495e'}
      // bottom-right corner of rect at bottom-right of frame
      {...({bottomRight: [320, 240]} as any)}
    />,
  );
});

export const project = makeProject({
  name: 'origin_corners',
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

