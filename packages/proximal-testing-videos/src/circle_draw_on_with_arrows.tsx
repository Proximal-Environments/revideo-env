import {makeProject, Vector2, createRef, waitFor} from '@revideo/core';
import {makeScene2D, Circle} from '@revideo/2d';

// Demonstrates animated draw-on (start/end) and that arrowheads still render
const scene = makeScene2D('scene', function* (view) {
  const circle = createRef<Circle>();

  view.add(
    <Circle
      ref={circle}
      size={260}
      stroke={'white'}
      lineWidth={16}
      startArrow
      endArrow
      start={0}
      end={0}
      // an arc for clarity rather than full 360, to avoid closed-path ambiguity
      startAngle={-90}
      endAngle={180}
      closed={false}
    />,
  );

  // Short lead-in, then draw on the arc and show arrows
  yield* waitFor(0.5);
  yield* circle().end(1, 2);
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'circle_draw_on_with_arrows',
  scenes: [scene],
  settings: {
    shared: {
      background: 'black',
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

