import {makeProject, Vector2} from '@revideo/core';
import {makeScene2D, Rect} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  view.fill('#ffffff');

  yield view.add(
    <Rect
      width={360}
      height={220}
      radius={80}
      smoothCorners={true}
      cornerSharpness={0.25}
      fill={'#9b59b6'}
      stroke={'#6d3d82'}
      lineWidth={4}
    />,
  );
});

export const project = makeProject({
  name: 'round-rect-smooth',
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

