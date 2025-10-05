import {makeProject, Vector2} from '@revideo/core';
import {Rect, Video, makeScene2D} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  yield view.add(<Rect size={[640, 480]} fill={'#ffffff'} />);

  const parent = (
    <Video
      size={[260, 160]}
      clip={true}
      play={false}
      src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'}
    />
  );
  yield view.add(parent);

  // Overflow child; should be masked by Video when clip is true
  parent.add(
    <Rect size={[380, 90]} fill={'#ffeb3b'} position={[0, 0]} />,
  );
});

export const project = makeProject({
  name: 'clip_video_children',
  scenes: [scene],
  settings: {
    shared: {
      background: '#FFFFFF',
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

