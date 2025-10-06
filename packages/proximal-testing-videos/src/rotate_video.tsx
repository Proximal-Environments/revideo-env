import {makeProject, Vector2} from '@revideo/core';
import {Video, makeScene2D} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  const v = createRef<Video>();

  view.add(
    <Video
      ref={v}
      src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'}
      size={['80%', '80%']}
      play={true}
    />,
  );

  yield* waitFor(0.2);
  // Rotating a video should change its orientation; without rotation support it stays upright
  yield* v().rotation(45, 1.0);
  yield* waitFor(0.4);
});

export const project = makeProject({
  name: 'rotate_video',
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

