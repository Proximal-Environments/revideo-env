import {makeProject, Vector2} from '@revideo/core';
import {Layout, Rect, Txt, makeScene2D} from '@revideo/2d';

// Renders text with explicit newlines and multiple spaces using white-space: 'pre'.
// With correct implementation: lines and spaces are preserved across multiple lines.
// With removed feature: forced nowrap/innerText collapses into a single line (layout changes significantly).
const scene = makeScene2D('scene', function* (view) {
  const multiline = `First line\n    Second   line with   multiple   spaces\nThird line`;

  view.add(
    <>
      <Rect width={'100%'} height={'100%'} fill={'#ffffff'} />
      <Layout
        width={420}
        height={240}
        clip={true}
        justifyContent={'center'}
        alignItems={'center'}
        fill={null}
      >
        <Rect width={'100%'} height={'100%'} fill={'#fef3c7'} />
        <Layout width={360} padding={20} clip={true} fill={null}>
          <Rect width={'100%'} height={'100%'} fill={'#fde68a'} />
          <Txt
            fontFamily={'Courier New, monospace'}
            fontSize={22}
            lineHeight={'140%'}
            textWrap={'pre'}
            fill={'#1f2937'}
          >
            {multiline}
          </Txt>
        </Layout>
      </Layout>
    </>,
  );
});

export const project = makeProject({
  name: 'text_whitespace_pre',
  scenes: [scene],
  settings: {
    shared: {
      background: '#FFFFFF',
      range: [0, 60], // 2 seconds at 30 fps
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

