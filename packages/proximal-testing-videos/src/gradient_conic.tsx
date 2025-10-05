import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D, Gradient} from '@revideo/2d';

const scene = makeScene2D('gradient-conic', function* (view) {
  view.add(
    <Rect
      size={[480, 360]}
      fill={
        new Gradient({
          type: 'conic',
          angle: 0,
          from: [0, 0],
          stops: [
            {offset: 0.0, color: '#ff0000'},
            {offset: 0.33, color: '#00ff00'},
            {offset: 0.66, color: '#0000ff'},
            {offset: 1.0, color: '#ff0000'},
          ],
        })
      }
      stroke={'#000000'}
      lineWidth={2}
    />,
  );
});

export const project = makeProject({
  name: 'gradient-conic',
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

