import {Txt, Rect, makeScene2D} from '@revideo/2d';
import {waitFor, makeProject, Vector2} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  view.add(<Rect size={'100%'} fill={'#ffffff'} />);

  // Title
  view.add(
    <Txt y={-200} text={'Font Family Overrides'} fontSize={36} fontWeight={700} />,
  );

  // Three lines using generic families to avoid custom font installs.
  view.add(
    <Txt y={-80} text={'Monospace family'} fontFamily={'monospace'} fontSize={48} />,
  );
  view.add(
    <Txt y={0} text={'Serif family'} fontFamily={'serif'} fontSize={48} />,
  );
  view.add(
    <Txt y={80} text={'Sans-serif family'} fontFamily={'sans-serif'} fontSize={48} />,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'text_font_family',
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

