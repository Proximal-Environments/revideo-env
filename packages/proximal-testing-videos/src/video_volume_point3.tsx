import {makeProject, Vector2} from '@revideo/core';
import {Video, makeScene2D} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Video
      src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'}
      size={['100%', '100%']}
      play={true}
      volume={0.3}
    />,
  );
});

export const project = makeProject({
  name: 'video_volume_point3',
  scenes: [scene],
  settings: {
    shared: {
      background: '#000000',
      range: [0, 2],
      size: new Vector2(640, 360),
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

