import {makeProject, Vector2} from '@revideo/core';
import {Rect, Layout, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

export const scene = makeScene2D('scene', function* (view) {
  // A cached parent with opacity<1 must composite using globalAlpha.
  // Without opacity support, this will render fully opaque.
  view.add(
    <Layout cache={true} opacity={0.5}>
      <Rect width={480} height={360} fill={'#FF00FF'} />
    </Layout>,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'opacity_cached_group',
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

