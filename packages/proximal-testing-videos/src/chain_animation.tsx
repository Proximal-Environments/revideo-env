import {makeProject, Vector2} from '@revideo/core';

import {Audio, Img, makeScene2D, Video} from '@revideo/2d';
import {all, createRef, waitFor, chain} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  const logoRef = createRef<Img>();

  yield* waitFor(0.5);

  view.add(
    <Img
      width={'1%'}
      ref={logoRef}
      src={
        'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'
      }
    />,
  );

  yield* chain(logoRef().scale(40, 0.5), logoRef().rotation(90, 0.5));
});


export const project = makeProject({
  name: 'project',
  scenes: [scene],
  variables: {
    fill: 'green',
  },
  settings: {
    shared: {
      background: 'blue',
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
