import {makeProject, Vector2, waitFor} from '@revideo/core';
import {Rect, Video, makeScene2D} from '@revideo/2d';

// Tests per-media alpha on Video using a constant semi-transparent overlay.
export const scene = makeScene2D('scene', function* (view) {
  // Solid background helps reveal blending vs full opacity.
  view.add(<Rect size={'100%'} fill={'#AA2200'} />);

  // A semi-transparent video overlay (alpha=0.5) over the background.
  view.add(
    <Video
      src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'}
      size={['100%', '100%']}
      play={true}
      alpha={0.5}
    />,
  );

  yield* waitFor(1.0);
});

export const project = makeProject({
  name: 'project',
  scenes: [scene],
  variables: {},
  settings: {
    shared: {
      background: '#000000',
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
        options: {format: 'mp4'},
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

