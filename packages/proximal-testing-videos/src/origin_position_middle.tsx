import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';

// This scene positions elements by their center using the `middle` shortcut.
// We use prop spread to bypass TS so it compiles if the property is missing.
export const scene = makeScene2D('scene', function* (view) {
  // Marker to show the origin (0,0) visually
  view.add(
    <Rect size={[4, 4]} fill={'#000000'} />, // center dot
  );

  // A square centered-left via `middle`
  view.add(
    <Rect size={[60, 60]} fill={'#333333'} {...({middle: [-200, 0]} as any)} />,
  );

  // A square centered-right via `middle`
  view.add(
    <Rect size={[60, 60]} fill={'#777777'} {...({middle: [200, 0]} as any)} />,
  );
});

export const project = makeProject({
  name: 'origin_middle',
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
