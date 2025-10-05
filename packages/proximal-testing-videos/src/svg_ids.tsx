import {makeProject, Vector2, waitFor} from '@revideo/core';
import {SVG, makeScene2D, Rect} from '@revideo/2d';
import {createRef} from '@revideo/core';

// Tests getChildrenById by animating a specific child within the SVG.
// With extraction disabled, no child nodes exist and the animation won’t run visibly.
const scene = makeScene2D('scene', function* (view) {
  view.add(<Rect size={'100%'} fill={'#0b1020'} />);
  const svgRef = createRef<SVG>();

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="220" height="160" viewBox="0 0 220 160">
    <rect id="left" x="20" y="20" width="80" height="120" fill="#60a5fa" />
    <rect id="right" x="120" y="20" width="80" height="120" fill="#f472b6" />
  </svg>`;

  view.add(<SVG ref={svgRef} svg={svg} width={360} height={260} />);
  yield* waitFor(0.3);

  const [left] = svgRef().getChildrenById('left');
  if (left) {
    yield* left.scale(1.4, 0.6);
    yield* left.rotation(20, 0.6);
  }
  yield* waitFor(0.3);
});

export const project = makeProject({
  name: 'svg-ids',
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

