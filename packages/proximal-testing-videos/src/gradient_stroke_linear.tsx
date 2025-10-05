import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D, Gradient} from '@revideo/2d';

const scene = makeScene2D('gradient-stroke-linear', function* (view) {
  view.add(
    <Rect
      size={[420, 300]}
      fill={null}
      stroke={
        new Gradient({
          type: 'linear',
          from: [-210, 0],
          to: [210, 0],
          stops: [
            {offset: 0, color: '#ff0000'},
            {offset: 1, color: '#0000ff'},
          ],
        })
      }
      lineWidth={40}
    />,
  );
});

export const project = makeProject({
  name: 'gradient-stroke-linear',
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
        options: {format: 'mp4'},
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

