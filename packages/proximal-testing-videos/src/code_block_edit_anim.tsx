import {makeProject, Vector2, all, waitFor, createRef} from '@revideo/core';
import {CodeBlock, insert, remove, edit, lines, makeScene2D} from '@revideo/2d';

// Animated edits to exercise token colors during create/delete/retain morphs
const scene = makeScene2D('code-block-edit-anim', function* (view) {
  const code = createRef<CodeBlock>();

  view.add(
    <CodeBlock
      ref={code}
      language={'tsx'}
      fontFamily={'JetBrains Mono, monospace'}
      fontSize={36}
      code={`\
// Start simple, then add types/strings/comments
let value = 1;
`}
    />,
  );

  // Insert a string literal and comment (should be differently colored)
  yield* code().edit(1.0, true)`let value = ${insert('42')};// ${insert('the answer')}`;
  yield* waitFor(0.4);

  // Change keyword/identifier and add a function with types and string interpolation
  yield* all(
    code().selection(lines(0, 1), 0.6),
    code().edit(1.2, false)`let ${edit('value', 'answer')}${edit(' = 42', '')};\n${insert(
      `function greet(name: string) {\n  const msg = ${'`'}Hello, ${'${'}name{'}'}!${'`'};\n  return msg;\n}\nconsole.log(greet('World'));\n`,
    )}`,
  );
  yield* waitFor(0.6);

  // Remove a line to exercise delete morph
  yield* code().edit(1.0, false)`let answer;\n${remove(
    `function greet(name: string) {\n  const msg = ${'`'}Hello, ${'${'}name{'}'}!${'`'};\n  return msg;\n}\n`,
  )}console.log('done');\n`;
  yield* waitFor(0.6);
});

export const project = makeProject({
  name: 'code-block-edit-anim-project',
  scenes: [scene],
  settings: {
    shared: {
      background: '#0b0e14',
      range: [0, 8],
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

