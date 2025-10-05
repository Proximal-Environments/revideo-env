import {makeProject, Vector2} from '@revideo/core';
import {Video, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// Purpose: Validate per-media alpha blending on Video (alpha=0.5)
// Expectation (gold): Video blends with background; (removed feature): fully opaque video

const scene = makeScene2D('scene', function* (view) {
  yield* waitFor(0.1);

  view.add(
    <Video
      src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'}
      size={['100%', '100%']}
      play={true}
      alpha={0.5}
    />,
  );
});

export const project = makeProject({
  name: 'video_alpha_half',
  scenes: [scene],
  settings: {
    shared: {
      background: '#00AA66',
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

