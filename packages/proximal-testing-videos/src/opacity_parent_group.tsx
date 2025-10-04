import {makeProject, Vector2} from '@revideo/core';
import {Rect, Layout, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

export const scene = makeScene2D('scene', function* (view) {
  // Parent group opacity should affect all children.
  view.add(
    <Layout opacity={0.5}>
      <Rect width={500} height={380} fill={'#00AA00'} />
    </Layout>,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'opacity_parent_group',
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

