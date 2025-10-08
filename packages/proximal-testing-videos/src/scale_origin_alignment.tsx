import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';
import {waitFor} from '@revideo/core';

// Uses origin setters (topLeft) with rotation and scale.
// Without scale application in layout's scalingRotationMatrix/localToParent,
// the placement and size will differ from the gold implementation.
const scene = makeScene2D('scene', function* (view) {
  // Grid-like background to make alignment obvious
  view.add(<Rect size={'100%'} fill={'#e6f7ff'} />);

  view.add(
    <Rect
      size={[120, 80]}
      fill={'#32cd32'}
      rotation={30}
      scale={1.5}
      topLeft={[0, 0]}
    />,
  );

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

