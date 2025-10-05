import {Txt, Rect, makeScene2D} from '@revideo/2d';
import {waitFor, makeProject, Vector2} from '@revideo/core';

// Purpose: Visualize center alignment with wrapped multi-line text in a narrow container.
// With the feature removed, lines will be left-aligned instead of centered.
export const scene = makeScene2D('scene', function* (view) {
  view.add(<Rect size={'100%'} fill={'white'} />);

  view.add(
    <Rect
      width={360}
      height={200}
      stroke={'#000'}
      lineWidth={2}
      radius={8}
    >
      <Txt
        width={360}
        height={200}
        textAlign={'center'}
        fontSize={28}
        textWrap={true}
        text={'Center aligned multi-line text sample to verify wrapping alignment.'}
      />
    </Rect>,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'text-align-center-wrapped',
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

