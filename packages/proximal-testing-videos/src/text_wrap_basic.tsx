import {makeProject, Vector2} from '@revideo/core';
import {Layout, Rect, Txt, makeScene2D} from '@revideo/2d';

// Renders a long sentence inside a narrow text box with wrapping enabled.
// With correct implementation: text wraps into multiple lines.
// With removed feature (forced nowrap/innerText): text appears as one long line and overflows.
const scene = makeScene2D('scene', function* (view) {
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
        <Rect width={'100%'} height={'100%'} fill={'#eef2ff'} />
        <Layout width={280} padding={20} clip={true} fill={null}>
          <Rect width={'100%'} height={'100%'} fill={'#c7d2fe'} />
          <Txt
            fontFamily={'Arial, sans-serif'}
            fontSize={20}
            lineHeight={'130%'}
            textWrap={true}
            fill={'#111827'}
          >
            {`This is a long piece of text intended to wrap across multiple lines within a narrow container. If wrapping is disabled, it will overflow as a single unbroken line.`}
          </Txt>
        </Layout>
      </Layout>
    </>,
  );
});

export const project = makeProject({
  name: 'text_wrap_basic',
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

