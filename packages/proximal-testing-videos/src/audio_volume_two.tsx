import {makeProject, Vector2} from '@revideo/core';
import {Audio, makeScene2D} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Audio
      src={'https://revideo-example-assets.s3.amazonaws.com/chill-beat.mp3'}
      play={true}
      time={10}
      volume={2}
    />,
  );
});

export const project = makeProject({
  name: 'audio_volume_two',
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

