import {makeProject, Vector2} from '@revideo/core';
import {Line, makeScene2D} from '@revideo/2d';

// Static scene showing a diagonal line with both start and end arrows, custom size.
const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Line
      points={[[-180, -120], [180, 120]]}
      stroke={'#1a73e8'}
      lineWidth={12}
      startArrow
      endArrow
      arrowSize={44}
    />,
  );
});

export const project = makeProject({
  name: 'curve_arrows_both_size',
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

