import {makeProject, Vector2} from '@revideo/core';
import {Video, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// Purpose: Validate alpha=0 on Video (should skip drawing)
// Expectation (gold): Only background visible; (removed feature): video shows fully opaque

const scene = makeScene2D('scene', function* (view) {
  yield* waitFor(0.1);

  view.add(
    <Video
      src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'}
      size={['100%', '100%']}
      play={true}
      alpha={0}
    />,
  );
});

export const project = makeProject({
  name: 'video_alpha_zero',
  scenes: [scene],
  settings: {
    shared: {
      background: '#333333',
      range: [0, 1],
      size: new Vector2(640, 480),
    },
    preview: { fps: 30, resolutionScale: 1 },
    rendering: {
      exporter: { name: '@revideo/core/ffmpeg', options: { format: 'mp4' } },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

