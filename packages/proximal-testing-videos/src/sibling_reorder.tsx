import {Rect, makeScene2D} from '@revideo/2d';
import {createRef, waitFor, makeProject, Vector2} from '@revideo/core';

// Purpose: Detect sibling reordering APIs (moveToTop et al.).
// Behavior: Two overlapping rectangles are added so that yellow is on top
//           initially due to insertion order. At t=0.5s we call moveToTop()
//           on the blue rectangle. With correct implementation, blue moves on
//           top. With no-op move APIs, yellow remains on top.
export const scene = makeScene2D('scene', function* (view) {
  const blueRef = createRef<Rect>();

  // Background for contrast
  view.add(<Rect size={'100%'} fill={'#333'} />);

  // Bottom initially (inserted first); will be moved to top later.
  view.add(
    <Rect
      ref={blueRef}
      width={300}
      height={300}
      fill={'#3498db'}
      position={[0, 0]}
    />,
  );

  // Top initially (inserted second)
  view.add(
    <Rect
      width={300}
      height={300}
      fill={'#f1c40f'}
      position={[0, 0]}
    />,
  );

  // Wait, then attempt reordering.
  yield* waitFor(0.5);
  blueRef().moveToTop();

  // Hold to allow frames after the change
  yield* waitFor(0.7);
});

export const project = makeProject({
  name: 'sibling-reorder',
  scenes: [scene],
  settings: {
    shared: {
      background: '#000000',
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

