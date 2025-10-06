import {makeProject, Vector2} from '@revideo/core';
import {Video, makeScene2D, Rect} from '@revideo/2d';

// Purpose: Verify natural aspect-ratio fallback for Video when only height is set.
// Expected (gold): Width derives from intrinsic aspect ratio.
// Broken branch: Width may be auto/collapsed, causing incorrect rendering.

const scene = makeScene2D('scene', function* (view) {
  view.add(<Rect size={['100%', '100%']} fill={'#0c0c14'} />);

  view.add(
    <Video
      height={240}
      src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'}
    />,
  );
});

export const project = makeProject({
  name: 'video_height_only',
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

