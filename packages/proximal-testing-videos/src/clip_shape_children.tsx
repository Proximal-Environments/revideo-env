import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  // Background to visualize overflow
  yield view.add(<Rect size={[640, 480]} fill={'#ffffff'} />);

  // Parent shape (Rect) with child clipping enabled
  const parent = (
    <Rect size={[240, 180]} fill={'#bdbdbd'} clip={true} />
  );
  yield view.add(parent);

  // Child that overflows outside the parent's rounded rectangle
  parent.add(
    <Rect size={[360, 80]} fill={'#2196f3'} position={[0, 0]} />,
  );
});

export const project = makeProject({
  name: 'clip_shape_children',
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

