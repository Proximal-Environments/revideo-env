import {makeProject, Vector2} from '@revideo/core';
import {Img, Rect, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// Purpose: Verify that Img honors user-provided ratio when only one dimension is set.
// In the gold implementation, the Img should render square (ratio=1).
// With the removed feature, the Img should render using the intrinsic ratio of the image.
export const scene = makeScene2D('scene', function* (view) {
  // Helpful background to accentuate size differences
  view.add(<Rect size={['100%', '100%']} fill={'#222'} />);

  view.add(
    <Img
      // Only width is specified; height should be derived from ratio in gold
      width={'60%'}
      ratio={1}
      src={'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'}
    />,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'img_ratio_override',
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

