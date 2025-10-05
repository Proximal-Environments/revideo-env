import {makeProject, Vector2} from '@revideo/core';
import {Line, makeScene2D} from '@revideo/2d';

// Static scene showing a horizontal line with an end arrow.
const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Line
      points={[[-220, 0], [220, 0]]}
      stroke={'#000000'}
      lineWidth={14}
      endArrow
      arrowSize={36}
    />,
  );
});

export const project = makeProject({
  name: 'curve_arrows_end_only',
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

