import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D, Layout} from '@revideo/2d';
import {waitFor} from '@revideo/core';

export const scene = makeScene2D('scene', function* (view) {
  // Solid white background is set via project settings.
  // Add a full-canvas red rect, then a semi-transparent blue overlay.
  view.add(
    <Layout>
      <Rect width={640} height={480} fill={'#FF0000'} />
      <Rect width={320} height={240} position={[0, 0]} fill={'#0000FF'} opacity={0.5} />
    </Layout>,
  );

  // Hold for 1 second to ensure multiple frames are rendered.
  yield* waitFor(1);
});

export const project = makeProject({
  name: 'opacity_static_overlay',
  scenes: [scene],
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

