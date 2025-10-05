import {Rect, makeScene2D} from '@revideo/2d';
import {makeProject, Vector2, waitFor} from '@revideo/core';

// Static scene to highlight stroke vs fill draw order on shapes.
// Uses a thick black stroke and opaque red fill so the visual
// difference between stroke-under-fill (strokeFirst) and stroke-over-fill
// is obvious at the inner edge.
export const scene = makeScene2D('stroke-order-shapes', function* (view) {
  view.add(
    <Rect
      size={200}
      fill={'red'}
      stroke={'black'}
      lineWidth={40}
      strokeFirst={true}
    />,
  );

  // Hold a couple of frames to ensure output is not empty
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'stroke-order-shapes',
  scenes: [scene],
  settings: {
    shared: {
      background: 'white',
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

