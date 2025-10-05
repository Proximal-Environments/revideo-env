import {makeProject, Vector2} from '@revideo/core';
import {Latex, makeScene2D} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

// Basic LaTeX render smoke-test: renders a simple equation for a few seconds.
const scene = makeScene2D('latex_basic', function* (view) {
  const eq = createRef<Latex>();

  view.add(
    <Latex
      ref={eq}
      // White text on dark background for strong contrast.
      tex="{\\color{white} x = \\sin \\left( \\frac{\\pi}{2} \\right ) = 1}"
      width={600}
      y={0}
      opacity={1}
    />,
  );

  // Hold, fade out, hold; ensures multiple frames and transitions.
  yield* waitFor(1.5);
  yield* eq().opacity(0, 1.0);
  yield* waitFor(1.5);
});

export const project = makeProject({
  name: 'latex_basic_project',
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

