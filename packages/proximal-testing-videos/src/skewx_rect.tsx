import {makeProject, Vector2, waitFor} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';

// Static scene showing a clear X-skew on a rectangle
export const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Rect
      width={300}
      height={150}
      x={0}
      y={0}
      fill={'#00AAFF'}
      stroke={'#002244'}
      lineWidth={4}
      skewX={30}
    />,
  );

  // Keep the frame for a moment to render a short clip
  yield* waitFor(0.8);
});

export const project = makeProject({
  name: 'skewx_rect',
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

