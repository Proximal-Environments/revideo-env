import {makeProject, Vector2, waitFor} from '@revideo/core';
import {SVG, makeScene2D, Rect} from '@revideo/2d';

// A simple static SVG render. If SVG parsing is broken, the logo won't appear.
// We also include a contrasting background to make the absence obvious.
const scene = makeScene2D('scene', function* (view) {
  // Background for contrast
  view.add(<Rect size={'100%'} fill={'#111827'} />);

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect id="bgrect" x="10" y="10" width="180" height="180" rx="16" ry="16" fill="#0ea5e9"/>
    <circle id="dot" cx="100" cy="100" r="50" fill="#f59e0b" stroke="#111827" stroke-width="6"/>
  </svg>`;

  view.add(<SVG svg={svg} width={300} height={300} />);

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'svg-static',
  scenes: [scene],
  settings: {
    shared: {
      background: '#000000',
      range: [0, Infinity],
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

