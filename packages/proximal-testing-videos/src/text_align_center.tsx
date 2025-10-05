import {makeProject, Vector2} from '@revideo/core';
import {Rect, Txt, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// Verifies that textAlign={'center'} centers text within a wider container.
export const scene = makeScene2D('scene', function* (view) {
  // Draw a subtle container background for visual reference
  view.add(
    <Rect
      size={[400, 200]}
      position={[0, 0]}
      fill={'#f0f0f0'}
      stroke={'#cccccc'}
      lineWidth={2}
    >
      <Txt
        textAlign={'center'}
        size={['100%', null]}
        fontSize={48}
        fontWeight={600}
        marginTop={60}
      >
        Centered
      </Txt>
    </Rect>,
  );

  yield* waitFor(1.0);
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

