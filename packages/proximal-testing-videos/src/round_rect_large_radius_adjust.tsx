import {makeProject, Vector2} from '@revideo/core';
import {makeScene2D, Rect} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  view.fill('#ffffff');

  // Intentional large radius to trigger adjustRectRadius logic
  yield view.add(
    <Rect
      width={300}
      height={150}
      radius={200}
      fill={'#e67e22'}
      stroke={'#a85911'}
      lineWidth={4}
    />,
  );
});

export const project = makeProject({
  name: 'round-rect-large-radius-adjust',
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

