import {Txt, makeScene2D} from '@revideo/2d';
import {makeProject, Vector2, waitFor} from '@revideo/core';

// Static scene to highlight stroke vs fill draw order on text.
// Thick black stroke and yellow fill make the draw-order difference
// very visible around glyph edges.
export const scene = makeScene2D('stroke-order-text', function* (view) {
  view.add(
    <Txt
      text={'Stroke vs Fill'}
      fontSize={100}
      fill={'#FFD54F'}
      stroke={'black'}
      lineWidth={18}
      strokeFirst={true}
    />,
  );

  // Hold a couple of frames.
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'stroke-order-text',
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

