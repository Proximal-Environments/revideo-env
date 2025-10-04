import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

export const scene = makeScene2D('scene', function* (view) {
  const overlay = createRef<Rect>();

  // Full-canvas black overlay fading out to transparent.
  view.add(
    <Rect ref={overlay} width={640} height={480} fill={'#000000'} opacity={1} />,
  );

  // Animate opacity from 1 -> 0 over 2 seconds.
  yield* overlay().opacity(0, 2);
  // Hold a bit so the tail frame is included.
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'opacity_fade_animation',
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
        options: {format: 'mp4'},
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

