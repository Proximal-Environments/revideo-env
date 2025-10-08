import {makeProject, Vector2, waitFor} from '@revideo/core';
import {Circle, Rect, makeScene2D} from '@revideo/2d';

export const scene = makeScene2D('scene', function* (view) {
  // Two filled shapes without strokes; removal of fill will make them disappear
  view.add(
    <Rect width={200} height={150} fill={'#ff3333'} x={-120} y={0} />,
  );
  view.add(
    <Circle width={120} height={120} fill={'#33cc66'} x={130} y={10} />,
  );

  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'project',
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

