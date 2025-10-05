import {Txt, Rect, makeScene2D} from '@revideo/2d';
import {waitFor, makeProject, Vector2} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  view.add(<Rect size={'100%'} fill={'#ffffff'} />);

  view.add(
    <Txt y={-200} text={'Line-Height / Letter-Spacing'} fontSize={36} fontWeight={700} />,
  );

  // Multi-line with custom line-height; also reduce font size to accentuate difference
  view.add(
    <Txt
      y={-60}
      text={'Line A\nLine B\nLine C'}
      fontSize={30}
      lineHeight={100}
      textAlign={'center'}
    />,
  );

  // Large letter spacing
  view.add(
    <Txt
      y={100}
      text={'S P A C E D'}
      fontSize={48}
      letterSpacing={8}
    />,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'text_lineheight_letterspacing',
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

