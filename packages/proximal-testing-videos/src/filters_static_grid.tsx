import {makeProject, Vector2, waitFor} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';
import {Gradient, blur, brightness, contrast, grayscale, hue, invert, saturate} from '@revideo/2d';

const W = 640;
const H = 480;

/**
 * A static grid showcasing each filter applied to the same gradient rect.
 * Useful to validate filter serialization and visual output.
 */
export const scene = makeScene2D('scene', function* (view) {
  const baseFill = new Gradient({
    type: 'linear',
    from: [-160, -120],
    to: [160, 120],
    stops: [
      {offset: 0, color: '#ff0000'},
      {offset: 0.5, color: '#00ff00'},
      {offset: 1, color: '#0000ff'},
    ],
  });

  type Item = {x: number; y: number; label: string; filters: any[]};
  const items: Item[] = [
    {x: -200, y: -140, label: 'none', filters: []},
    {x: 0, y: -140, label: 'invert', filters: [invert(1)]},
    {x: 200, y: -140, label: 'grayscale', filters: [grayscale(1)]},
    {x: -200, y: 0, label: 'brightness', filters: [brightness(1.6)]},
    {x: 0, y: 0, label: 'contrast', filters: [contrast(1.8)]},
    {x: 200, y: 0, label: 'saturate', filters: [saturate(1.8)]},
    {x: -100, y: 140, label: 'hue-rotate', filters: [hue(180)]},
    {x: 100, y: 140, label: 'blur', filters: [blur(8)]},
  ];

  for (const it of items) {
    view.add(
      <Rect
        position={[it.x, it.y]}
        size={[180, 120]}
        fill={baseFill}
        lineWidth={2}
        stroke={'#222'}
        filters={it.filters}
      />,
    );
  }

  // Hold for a short, fixed duration for deterministic render.
  yield* waitFor(2);
});

export const project = makeProject({
  name: 'filters_static_grid',
  scenes: [scene],
  settings: {
    shared: {
      background: '#ffffff',
      range: [0, 2],
      size: new Vector2(W, H),
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

