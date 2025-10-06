import {makeProject, Vector2} from '@revideo/core';
import {makeScene2D, Video} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// Scene renders a looping background video at double speed (playbackRate=2)
const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Video
      src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'}
      size={['100%', '100%']}
      play={true}
      playbackRate={2}
    />,
  );

  // Keep the scene alive for a short, deterministic duration
  yield* waitFor(2);
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

