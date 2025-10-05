import {Txt, Rect, makeScene2D} from '@revideo/2d';
import {waitFor, makeProject, Vector2} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  view.add(<Rect size={'100%'} fill={'#ffffff'} />);

  view.add(
    <Txt y={-200} text={'Font Size / Weight / Style'} fontSize={36} fontWeight={700} />,
  );

  // Big vs default size
  view.add(
    <Txt y={-100} text={'Size 96'} fontSize={96} />,
  );

  // Bold vs normal
  view.add(
    <Txt y={0} text={'Weight 800'} fontWeight={800} fontSize={48} />,
  );

  // Italic vs normal
  view.add(
    <Txt y={100} text={'Italic style'} fontStyle={'italic'} fontSize={48} />,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'text_size_weight_style',
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

