import {makeProject, Vector2, waitFor} from '@revideo/core';
import {Img, Rect, makeScene2D} from '@revideo/2d';
import {createRef} from '@revideo/core';

// Tests per-media alpha on Img by animating a fade-in.
export const scene = makeScene2D('scene', function* (view) {
  const imgRef = createRef<Img>();

  // Solid background to make blending differences obvious.
  view.add(<Rect size={'100%'} fill={'#0044AA'} />);

  view.add(
    <Img
      ref={imgRef}
      width={'60%'}
      alpha={0}
      src={'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'}
    />,
  );

  // Fade in over 1s using the media alpha channel.
  yield* imgRef().alpha(1, 1);
  yield* waitFor(0.25);
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
        options: {format: 'mp4'},
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

