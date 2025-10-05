import {makeProject, Vector2} from '@revideo/core';
import {makeScene2D, Rect} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  view.fill('#ffffff');

  yield view.add(
    <Rect
      width={320}
      height={200}
      radius={40}
      fill={'#2ecc71'}
      stroke={'#1e874b'}
      lineWidth={4}
    />,
  );
});

export const project = makeProject({
  name: 'round-rect-uniform',
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

