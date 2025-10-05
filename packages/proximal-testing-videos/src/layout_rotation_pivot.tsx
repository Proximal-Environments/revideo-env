import {Layout, Rect, makeScene2D} from '@revideo/2d';
import {waitFor, makeProject, Vector2} from '@revideo/core';

// Tests that Layout.offset affects rotation pivot
// Expected (gold): rotation occurs around the top-left corner (offset [-1,-1]).
// Broken branch: rotation occurs around the geometric center, resulting in a
// visibly different placement.
export const scene = makeScene2D('scene', function* (view) {
  // Background for contrast
  view.add(<Rect size={'100%'} fill={'#ffffff'} />);

  // A 200x100 blue rectangle rotated 45° around its top-left corner
  view.add(
    <Layout size={[200, 100]} offset={[-1, -1]} position={[0, 0]} rotation={45}>
      <Rect size={'100%'} fill={'#2277ee'} />
    </Layout>,
  );

  // Hold for a moment to make a short static video
  yield* waitFor(1);
});

export const project = makeProject({
  name: 'layout_rotation_pivot',
  scenes: [scene],
  settings: {
    shared: {
      background: '#ffffff',
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

