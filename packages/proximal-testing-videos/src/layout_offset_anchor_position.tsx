import {Layout, Rect, makeScene2D} from '@revideo/2d';
import {waitFor, makeProject, Vector2} from '@revideo/core';

// Tests that Layout.offset affects computed position (anchoring)
// Expected (gold): with offset [-1,-1], the top-left corner of the green box
// aligns with the scene's top-left when position is set to [-320,-240].
// Broken branch: position is treated as center, so most of the box is off-screen.
export const scene = makeScene2D('scene', function* (view) {
  // Background for contrast
  view.add(<Rect size={'100%'} fill={'#ffffff'} />);

  // A 100x100 green square whose layout offset anchors its top-left corner
  view.add(
    <Layout size={[100, 100]} offset={[-1, -1]} position={[-320, -240]}>
      <Rect size={'100%'} fill={'#00aa55'} />
    </Layout>,
  );

  // Hold for a moment to make a short static video
  yield* waitFor(1);
});

export const project = makeProject({
  name: 'layout_offset_anchor_position',
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

