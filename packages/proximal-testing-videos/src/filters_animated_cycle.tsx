import {makeProject, Vector2, all, waitFor} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';
import {Gradient, blur, brightness, contrast, grayscale, hue, invert, saturate} from '@revideo/2d';

const W = 640;
const H = 480;

/**
 * Animates through a cycle of filters on a single rect.
 * Each filter animates over ~0.5s, then resets before the next one.
 * Validates filter signal animation behavior and serialization over time.
 */
export const scene = makeScene2D('scene', function* (view) {
  const fill = new Gradient({
    type: 'linear',
    from: [-160, -120],
    to: [160, 120],
    stops: [
      {offset: 0, color: '#ff0000'},
      {offset: 0.5, color: '#00ff00'},
      {offset: 1, color: '#0000ff'},
    ],
  });

  const fInvert = invert(0);
  const fGray = grayscale(0);
  const fBright = brightness(1);
  const fContrast = contrast(1);
  const fSaturate = saturate(1);
  const fHue = hue(0);
  const fBlur = blur(0);

  view.add(
    <Rect
      size={[320, 240]}
      fill={fill}
      lineWidth={2}
      stroke={'#222'}
      filters={[fInvert, fGray, fBright, fContrast, fSaturate, fHue, fBlur]}
    />,
  );

  // Invert 0 -> 1
  yield* fInvert.value(1, 0.5);
  yield* waitFor(0.2);
  fInvert.value(0);

  // Grayscale 0 -> 1
  yield* fGray.value(1, 0.5);
  yield* waitFor(0.2);
  fGray.value(0);

  // Brightness 1 -> 1.8
  yield* fBright.value(1.8, 0.5);
  yield* waitFor(0.2);
  fBright.value(1);

  // Contrast 1 -> 1.8
  yield* fContrast.value(1.8, 0.5);
  yield* waitFor(0.2);
  fContrast.value(1);

  // Saturate 1 -> 1.8
  yield* fSaturate.value(1.8, 0.5);
  yield* waitFor(0.2);
  fSaturate.value(1);

  // Hue 0 -> 180
  yield* fHue.value(180, 0.5);
  yield* waitFor(0.2);
  fHue.value(0);

  // Blur 0 -> 10
  yield* fBlur.value(10, 0.5);
  yield* waitFor(0.3);
  fBlur.value(0);

  // Hold briefly to ensure deterministic end.
  yield* waitFor(0.3);
});

export const project = makeProject({
  name: 'filters_animated_cycle',
  scenes: [scene],
  settings: {
    shared: {
      background: '#ffffff',
      range: [0, 5],
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

