import {makeProject, Vector2} from '@revideo/core';
import {Video, makeScene2D, Rect} from '@revideo/2d';

// Purpose: Verify intrinsic sizing for Video when no width/height/ratio is set.
// Expected (gold): Video renders at its natural size and aspect ratio.
// Broken branch: Video may collapse or render at incorrect size.

const scene = makeScene2D('scene', function* (view) {
  view.add(<Rect size={['100%', '100%']} fill={'#202030'} />);

  // No width/height/ratio specified
  view.add(
    <Video src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'} />,
  );
});

export const project = makeProject({
  name: 'video_no_size',
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

