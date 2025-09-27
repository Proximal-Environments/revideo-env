import {makeProject} from '@revideo/core';

import {Audio, Img, makeScene2D, Video} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';

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
