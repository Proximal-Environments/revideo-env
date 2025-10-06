import {makeProject, Vector2} from '@revideo/core';
import {Img, makeScene2D} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  const i = createRef<Img>();

  view.add(
    <Img
      ref={i}
      width={240}
      src={'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'}
    />,
  );

  yield* waitFor(0.2);
  // If rotation is ignored, image stays upright
  yield* i().rotation(120, 1.2);
  yield* waitFor(0.2);
});

export const project = makeProject({
  name: 'rotate_img',
  scenes: [scene],
  settings: {
    shared: {
      background: '#1e272e',
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

