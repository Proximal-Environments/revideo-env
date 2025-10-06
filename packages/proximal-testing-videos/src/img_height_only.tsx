import {makeProject, Vector2} from '@revideo/core';
import {Img, makeScene2D, Rect} from '@revideo/2d';

// Purpose: Verify natural aspect-ratio fallback for Img when only height is set.
// Expected (gold): Width derives from intrinsic aspect ratio.
// Broken branch: Width may be auto/collapsed, causing incorrect rendering.

const scene = makeScene2D('scene', function* (view) {
  view.add(<Rect size={['100%', '100%']} fill={'#0a0a0a'} />);

  view.add(
    <Img
      height={240}
      src={
        'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'
      }
    />,
  );
});

export const project = makeProject({
  name: 'img_height_only',
  scenes: [scene],
  settings: {
    shared: {
      background: '#000000',
      range: [0, 1],
      size: new Vector2(640, 480),
    },
    preview: {fps: 30, resolutionScale: 1},
    rendering: {
      exporter: {name: '@revideo/core/ffmpeg', options: {format: 'mp4'}},
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

