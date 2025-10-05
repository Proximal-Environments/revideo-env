import {Rect, makeScene2D} from '@revideo/2d';
import {waitFor, makeProject, Vector2} from '@revideo/core';

// Purpose: Detect z-index-based render ordering.
// Behavior: Two fully overlapping rectangles are added in insertion order
//           that contradicts their zIndex. With correct zIndex handling,
//           the first (green) rectangle has higher zIndex and appears on top.
//           Without zIndex handling (insertion order only), the second (red)
//           rectangle appears on top.
export const scene = makeScene2D('scene', function* (view) {
  // Background for contrast
  view.add(<Rect size={'100%'} fill={'#222'} />);

  // First rect: green, higher zIndex (should be on top if zIndex works)
  view.add(
    <Rect
      width={300}
      height={300}
      fill={'#2ecc71'}
      position={[0, 0]}
      zIndex={1}
    />,
  );

  // Second rect: red, lower zIndex (should be underneath if zIndex works)
  view.add(
    <Rect
      width={300}
      height={300}
      fill={'#e74c3c'}
      position={[0, 0]}
      zIndex={-1}
    />,
  );

  // Hold for a short duration to render a few frames
  yield* waitFor(1);
});

export const project = makeProject({
  name: 'z-index-layering',
  scenes: [scene],
  settings: {
    shared: {
      background: '#000000',
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

