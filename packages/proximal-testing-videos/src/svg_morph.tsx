import {makeProject, Vector2, waitFor} from '@revideo/core';
import {SVG, makeScene2D, Rect} from '@revideo/2d';
import {createRef} from '@revideo/core';

// Morphs between two simple paths. If SVG parsing/extraction is broken,
// the tween will show no shapes and output will differ.
const scene = makeScene2D('scene', function* (view) {
  view.add(<Rect size={'100%'} fill={'#ffffff'} />);

  const svgRef = createRef<SVG>();

  const svg1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <path id="shape" d="M 40 40 L 160 40 L 160 160 L 40 160 Z" fill="#ef4444" stroke="#111827" stroke-width="6"/>
  </svg>`;

  const svg2 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <path id="shape" d="M 100 20 C 140 20 180 60 180 100 C 180 140 140 180 100 180 C 60 180 20 140 20 100 C 20 60 60 20 100 20 Z" fill="#22c55e" stroke="#111827" stroke-width="6"/>
  </svg>`;

  view.add(<SVG ref={svgRef} svg={svg1} width={320} height={320} />);

  yield* waitFor(0.5);
  // This triggers SVG.tweenSvg under the hood
  yield* svgRef().svg(svg2, 1);
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'svg-morph',
  scenes: [scene],
  settings: {
    shared: {
      background: '#ffffff',
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

