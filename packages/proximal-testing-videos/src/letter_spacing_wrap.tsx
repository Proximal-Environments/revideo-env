import {makeProject, Vector2} from '@revideo/core';
import {Layout, Txt, makeScene2D, Rect} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// A scene that relies on letterSpacing to affect wrapping.
// With letterSpacing applied, the text wraps earlier and lines differ.
export const scene = makeScene2D('scene', function* (view) {
  view.add(
    <>
      <Rect size={['100%', '100%']} fill={'#ffffff'} />
      <Layout>
        <Txt
          // Constrain width to force wrapping sensitive to spacing
          width={480}
          fontSize={36}
          letterSpacing={8}
          textWrap={true}
          fill={'#111'}
        >
          LETTER SPACING WRAP DEMO WITH MULTIPLE WORDS TO FORCE LINE BREAKS
          AND MAKE SPACING VISUALLY OBVIOUS
        </Txt>
      </Layout>
    </>,
  );

  // Keep frame stable for a short render
  yield* waitFor(2);
});

export const project = makeProject({
  name: 'letter-spacing-wrap',
  scenes: [scene],
  settings: {
    shared: {
      background: '#FFFFFF',
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

