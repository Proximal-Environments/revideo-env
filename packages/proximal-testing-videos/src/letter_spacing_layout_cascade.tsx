import {makeProject, Vector2} from '@revideo/core';
import {Layout, Txt, makeScene2D, Rect} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// A scene where letterSpacing is set on a parent Layout only.
// Children should inherit letter-spacing via CSS, affecting wrap/alignment.
export const scene = makeScene2D('scene', function* (view) {
  view.add(
    <>
      <Rect size={['100%', '100%']} fill={'#ffffff'} />
      <Layout width={'100%'} height={'100%'} letterSpacing={6} textAlign={'center'}>
        <Txt
          width={520}
          fontSize={34}
          textWrap={true}
          fill={'#222'}
        >
          CENTERED TEXT INHERITING LETTER SPACING FROM PARENT LAYOUT TO CHANGE
          LINE BREAKS AND EDGE ALIGNMENT VISIBLY
        </Txt>
      </Layout>
    </>,
  );

  yield* waitFor(2);
});

export const project = makeProject({
  name: 'letter-spacing-layout-cascade',
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

