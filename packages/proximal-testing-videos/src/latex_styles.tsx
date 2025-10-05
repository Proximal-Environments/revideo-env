import {makeProject, Vector2} from '@revideo/core';
import {Latex, makeScene2D} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

// Styled LaTeX test: different width, alignment, and more complex formula.
const scene = makeScene2D('latex_styles', function* (view) {
  const eq = createRef<Latex>();

  view.add(
    <Latex
      ref={eq}
      // Quadratic formula with color; checks MathJax rendering + base64 SVG path.
      tex="{\\color{white} ax^2 + bx + c = 0 \\implies x=\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}}"
      width={520}
      y={0}
      opacity={0}
    />,
  );

  // Fade in, hold, fade out
  yield* eq().opacity(1, 0.8);
  yield* waitFor(1.0);
  yield* eq().opacity(0, 0.8);
});

export const project = makeProject({
  name: 'latex_styles_project',
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

