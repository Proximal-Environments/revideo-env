import {makeProject, Vector2} from '@revideo/core';
import {Circle, makeScene2D} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  const c = createRef<Circle>();

  view.add(
    <Circle
      ref={c}
      x={0}
      y={0}
      radius={150}
      lineWidth={10}
      stroke={'#ffffff'}
      start={0}
      end={1}
      startArrow
      endArrow
      arrowSize={30}
    />,
  );

  // Animate drawing the circle from 0% to 100% over 2 seconds.
  yield* c().start(0, 0).to(1, 2);

  // Hold the final frame briefly to keep deterministic duration.
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'curve-trim-reveal',
  scenes: [scene],
  settings: {
    shared: {
      background: '#111111',
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

