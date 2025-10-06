import {makeProject, Vector2} from '@revideo/core';
import {Rect, Video, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// Purpose: Verify that Video honors user-provided ratio when only one dimension is set.
// In the gold implementation, the Video should render square (ratio=1).
// With the removed feature, the Video should render using intrinsic videoWidth/videoHeight (likely 16:9 for the sample).
export const scene = makeScene2D('scene', function* (view) {
  view.add(<Rect size={['100%', '100%']} fill={'#113355'} />);

  view.add(
    <Video
      // Freeze on first frame for stability; ensure size is driven by ratio in gold
      src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'}
      play={false}
      time={0}
      width={'60%'}
      ratio={1}
    />,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'video_ratio_override',
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

