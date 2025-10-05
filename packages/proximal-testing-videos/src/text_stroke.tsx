import {makeProject, Vector2} from '@revideo/core';
import {Rect, Txt, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

export const scene = makeScene2D('scene', function* (view) {
  // Background to highlight the outline contrast
  view.add(<Rect width={'100%'} height={'100%'} fill={'#F0F0F0'} />);

  view.add(
    <Txt fontFamily={"'JetBrains Mono', monospace"} fontWeight={800} fontSize={92}>
      <Txt fill={'#1E90FF'} stroke={'#000000'} lineWidth={12} strokeFirst={false}>
        Outline Text
      </Txt>
    </Txt>,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'project',
  scenes: [scene],
  variables: {},
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

