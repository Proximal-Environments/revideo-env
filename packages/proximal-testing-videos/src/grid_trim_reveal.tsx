import {makeProject, Vector2} from '@revideo/core';
import {Grid, makeScene2D} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  const g = createRef<Grid>();

  view.add(
    <Grid
      ref={g}
      width={'100%'}
      height={'100%'}
      stroke={'#44aaee'}
      lineWidth={3}
      spacing={80}
      start={0}
      end={1}
    />,
  );

  // Reveal grid lines from center outward over 2 seconds
  yield* g().start(0, 0).to(1, 2);
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'grid-trim-reveal',
  scenes: [scene],
  settings: {
    shared: {
      background: '#0b0b0b',
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

