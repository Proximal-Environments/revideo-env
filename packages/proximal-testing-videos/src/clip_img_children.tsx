import {makeProject, Vector2} from '@revideo/core';
import {Img, Rect, makeScene2D} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  yield view.add(<Rect size={[640, 480]} fill={'#ffffff'} />);

  const parent = (
    <Img
      size={[240, 160]}
      clip={true}
      src={'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'}
    />
  );
  yield view.add(parent);

  // Child overflow rectangle that should be masked by Img when clip is true
  parent.add(
    <Rect size={[360, 80]} fill={'#4caf50'} position={[0, 0]} />,
  );
});

export const project = makeProject({
  name: 'clip_img_children',
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

