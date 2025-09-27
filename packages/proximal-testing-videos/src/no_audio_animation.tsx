import {makeProject, Vector2} from '@revideo/core';

import {Img, makeScene2D} from '@revideo/2d';
import {all, createRef, waitFor} from '@revideo/core';

/**
 * The Revideo scene
 */
export const scene = makeScene2D('scene', function* (view) {
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

  yield* all(logoRef().scale(40, 1.5), logoRef().rotation(90, 1.5));
});


export const project = makeProject({
  name: 'project',
  scenes: [scene],
  variables: {
    fill: 'green',
  },
  settings: {
    shared: {
      background: '#FFFFFF',
      range: [0, Infinity],
      size: new Vector2(640, 480),
    },
    preview: {
      fps: 30,
      resolutionScale: 1,
    },
    rendering: {
      exporter: {
        name: '@revideo/core/wasm',
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;
