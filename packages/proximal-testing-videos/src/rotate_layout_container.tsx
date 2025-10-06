import {makeProject, Vector2} from '@revideo/core';
import {Layout, Rect, makeScene2D} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  const container = createRef<Layout>();

  view.add(
    <Layout ref={container} width={360} height={220}>
      <Rect width={180} height={100} fill={'#8e44ad'} />
    </Layout>,
  );

  yield* waitFor(0.2);
  // Container rotation should affect its children; without rotation, the child remains upright
  yield* container().rotation(90, 1.0);
  yield* waitFor(0.2);
});

export const project = makeProject({
  name: 'rotate_layout_container',
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

