import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D, Txt} from '@revideo/2d';
import {waitFor} from '@revideo/core';

export const scene = makeScene2D('scene', function* (view) {
  // Title for context in debugging
  view.add(
    <Txt y={-200} fontSize={32} fill={'#333'}>
      Rect strokes: left fill-then-stroke, right stroke-then-fill
    </Txt>,
  );

  // Left: stroke after fill (default)
  view.add(
    <Rect
      x={-150}
      width={200}
      height={140}
      radius={24}
      fill={'#FFD966'}
      stroke={'#1F1F1F'}
      lineWidth={24}
      strokeFirst={false}
    />,
  );

  // Right: stroke before fill
  view.add(
    <Rect
      x={150}
      width={200}
      height={140}
      radius={24}
      fill={'#93C47D'}
      stroke={'#1F1F1F'}
      lineWidth={24}
      strokeFirst={true}
    />,
  );

  // Keep a small duration so there is a stable frame to render
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

