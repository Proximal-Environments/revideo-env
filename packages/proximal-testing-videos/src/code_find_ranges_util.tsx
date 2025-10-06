import {makeProject, Vector2, all, createRef, waitFor} from '@revideo/core';
import {
  Code,
  lines,
  makeScene2D,
  findAllCodeRanges,
  inverseCodeRange,
} from '@revideo/2d';

// Tests standalone findAllCodeRanges utility + applying selection
const scene = makeScene2D('code-find-ranges-util', function* (view) {
  const codeRef = createRef<Code>();

  const snippet = `const nums = [1, 2, 3];\nconsole.log(nums.join(','));\n// console.log('disabled');\nconsole.info('done');`;

  // Compute ranges directly using the standalone helper
  const consoleRanges = findAllCodeRanges(snippet, /console\.[a-z]+/g);

  yield view.add(
    <Code
      ref={codeRef}
      fontFamily={'JetBrains Mono, monospace'}
      fontSize={28}
      code={snippet}
      selection={lines(0, Infinity)}
    />,
  );

  // Show full selection, then only console.* tokens
  yield* waitFor(0.5);
  yield* codeRef().selection(consoleRanges, 0.6);
  yield* waitFor(0.4);

  // Invert selection to emphasize everything except console.*
  const inverted = inverseCodeRange(consoleRanges);
  yield* codeRef().selection(inverted, 0.6);
  yield* waitFor(0.4);

  // Restore full selection
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

