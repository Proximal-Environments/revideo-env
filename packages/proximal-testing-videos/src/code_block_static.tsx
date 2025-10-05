import {makeProject, Vector2} from '@revideo/core';
import {CodeBlock, makeScene2D} from '@revideo/2d';

// Static code rendering to exercise per-token highlighting
const scene = makeScene2D('code-block-static', function* (view) {
  view.add(
    <CodeBlock
      language={'tsx'}
      fontFamily={'JetBrains Mono, monospace'}
      fontSize={36}
      code={`\
// A small TSX snippet with diverse tokens
const answer: number = 42;
function greet(name: string) {
  const msg = ${'`'}Hello, ${'${'}name{'}'}!${'`'}; // string interpolation
  console.log(msg);
}
greet('World');
`}
    />,
  );

  // Hold on the static frame for a short duration
  yield* view.waitFor(2);
});

export const project = makeProject({
  name: 'code-block-static-project',
  scenes: [scene],
  settings: {
    shared: {
      background: '#0b0e14',
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

