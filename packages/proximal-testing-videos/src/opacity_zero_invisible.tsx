import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

export const scene = makeScene2D('scene', function* (view) {
  // Add a red rectangle that should be fully invisible due to opacity=0.
  view.add(<Rect width={400} height={300} fill={'#FF0000'} opacity={0} />);
  yield* waitFor(1);
});

export const project = makeProject({
  name: 'opacity_zero_invisible',
  scenes: [scene],
  settings: {
    shared: {
      background: '#FFFFFF',
      range: [0, Infinity],
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

