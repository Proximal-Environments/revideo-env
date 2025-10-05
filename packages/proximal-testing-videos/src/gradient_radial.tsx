import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D, Gradient} from '@revideo/2d';

const scene = makeScene2D('gradient-radial', function* (view) {
  view.add(
    <Rect
      size={[480, 360]}
      fill={
        new Gradient({
          type: 'radial',
          from: [0, 0],
          to: [0, 0],
          fromRadius: 0,
          toRadius: 240,
          stops: [
            {offset: 0, color: '#ffffff'},
            {offset: 1, color: '#000000'},
          ],
        })
      }
      stroke={'#000000'}
      lineWidth={2}
    />,
  );
});

export const project = makeProject({
  name: 'gradient-radial',
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

