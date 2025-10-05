import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';
import {all, createRef, waitFor} from '@revideo/core';

// Tests per-node compositeOperation by overlaying a rectangle with 'multiply'
// over an image background. Visual output differs from normal source-over.
export const scene = makeScene2D('scene', function* (view) {
  const overlayRef = createRef<Rect>();

  // Synthetic, high-contrast background: two stacked color bands
  view.add(
    <>
      <Rect
        size={['100%', '50%']}
        position={[0, -120]}
        fill={'#1E3A8A'} // deep blue
      />
      <Rect
        size={['100%', '50%']}
        position={[0, 120]}
        fill={'#A21CAF'} // magenta
      />
    </>,
  );

  // Wait a moment before animating
  yield* waitFor(0.2);

  // Semi-transparent yellow overlay using multiply to darken background
  view.add(
    <Rect
      ref={overlayRef}
      width={'60%'}
      height={'60%'}
      fill={'rgba(255, 230, 0, 0.65)'}
      position={[0, 0]}
      compositeOperation={'multiply'}
      radius={30}
      smoothCorners
    />,
  );

  // Animate to create multiple frames for hashing
  yield* all(
    overlayRef().rotation(30, 1.0),
    overlayRef().position([100, -60], 1.0),
  );
});

export const project = makeProject({
  name: 'project',
  scenes: [scene],
  variables: {},
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
