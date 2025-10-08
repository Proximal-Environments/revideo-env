import {makeProject, Vector2} from '@revideo/core';
import {Layout, Rect, makeScene2D} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

// Parent scaling should propagate to children; without scale in transforms, child size stays small.
const scene = makeScene2D('scene', function* (view) {
  const parentRef = createRef<Layout>();

  // Background to improve contrast
  view.add(<Rect size={'100%'} fill={'#f0f0f0'} />);

  // Parent container centered, scaled up
  view.add(
    <Layout ref={parentRef} size={[200, 200]} scale={2}>
      <Rect size={[60, 60]} fill={'#1e90ff'} radius={8} />
    </Layout>,
  );

  // Small delay to ensure we render a couple of frames
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'project',
  scenes: [scene],
  variables: {},
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

