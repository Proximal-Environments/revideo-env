import {makeProject, Vector2} from '@revideo/core';
import {Layout, Rect, makeScene2D} from '@revideo/2d';

const scene = makeScene2D('scene', function* (view) {
  // Centered parent layout with clipping enabled
  const parent = (
    <Layout
      size={[220, 160]}
      position={[0, 0]}
      clip={true}
      layout={false}
    />
  );

  yield view.add(
    <>
      {/* Background to make overflow clearly visible */}
      <Rect size={[640, 480]} fill={'#ffffff'} />
      {parent}
    </>,
  );

  // Add a large child that overflows the parent bounds on all sides
  parent.add(
    <Rect
      size={[360, 120]}
      fill={'#e91e63'}
      position={[0, 0]}
    />,
  );
});

export const project = makeProject({
  name: 'clip_layout_children',
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

