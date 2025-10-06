import {makeProject, Vector2, all, createRef, waitFor} from '@revideo/core';
import {Code, lines, makeScene2D} from '@revideo/2d';

// Tests Code.findAllRanges / findFirstRange / findLastRange
const scene = makeScene2D('code-find-ranges-methods', function* (view) {
  const codeRef = createRef<Code>();

  const snippet = `function greet() {\n  console.log('Hello');\n  console.warn('World');\n  console.log('Hello again');\n}`;

  yield view.add(
    <Code
      ref={codeRef}
      fontFamily={'JetBrains Mono, monospace'}
      fontSize={28}
      code={snippet}
      selection={lines(0, Infinity)}
    />,
  );

  // Let the full selection show briefly
  yield* waitFor(0.5);

  // Highlight all occurrences of "console"
  const allConsole = codeRef().findAllRanges(/console/);
  yield* codeRef().selection(allConsole, 0.6);
  yield* waitFor(0.3);

  // Highlight the first occurrence of "Hello"
  const firstHello = codeRef().findFirstRange('Hello');
  yield* codeRef().selection(firstHello, 0.6);
  yield* waitFor(0.3);

  // Highlight the last closing parenthesis
  const lastParen = codeRef().findLastRange(/\)/);
  yield* codeRef().selection(lastParen, 0.6);
  yield* waitFor(0.3);

  // Return to highlighting full content
  yield* all(codeRef().selection(lines(0, Infinity), 0.6));
  yield* waitFor(0.2);
});

export const project = makeProject({
  name: 'project',
  scenes: [scene],
  settings: {
    shared: {
      background: '#ffffff',
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

