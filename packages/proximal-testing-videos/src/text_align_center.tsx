import {Txt, Rect, makeScene2D} from '@revideo/2d';
import {waitFor, makeProject, Vector2} from '@revideo/core';

// Purpose: Visualize center text alignment within a wider container.
// With the feature removed, text will render left-aligned instead of centered.
export const scene = makeScene2D('scene', function* (view) {
  // Background
  view.add(<Rect size={'100%'} fill={'white'} />);

  // Container box to make alignment obvious
  view.add(
    <Rect
      width={500}
      height={120}
      stroke={'#000'}
      lineWidth={2}
      radius={8}
    >
      <Txt
        width={500}
        height={120}
        textAlign={'center'}
        fontSize={48}
        text={'CENTER'}
      />
    </Rect>,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'text-align-center',
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

