import {makeProject, Vector2} from '@revideo/core';
import {Ray, makeScene2D} from '@revideo/2d';

// Static scene showing a ray with an end arrow.
const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Ray
      from={[-160, 60]}
      to={[220, 60]}
      stroke={'#e53935'}
      lineWidth={10}
      endArrow
      arrowSize={28}
    />,
  );
});

export const project = makeProject({
  name: 'curve_arrows_ray',
  scenes: [scene],
  settings: {
    shared: {
      background: '#FFFFFF',
      range: [0, 2],
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

