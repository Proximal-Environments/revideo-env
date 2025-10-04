import {makeProject, Vector2, waitFor} from '@revideo/core';
import {Txt, makeScene2D} from '@revideo/2d';
import {createRef} from '@revideo/core';

/**
 * This scene verifies that text tweening accounts for font metrics by waiting
 * for font readiness before measuring. Without the wait, intermediate sizes and
 * interpolation paths differ, producing visual mismatches.
 */
export const scene = makeScene2D('scene', function* (view) {
  const fontUrl = 'https://fonts.gstatic.com/s/robotoslab/v24/BngMUXZYTXPIvIBgJJSb6ufN5qU.woff2';
  const ff = new FontFace('TestWebFont', `url(${fontUrl})`);
  document.fonts.add(ff);
  void ff.load();

  view.fontFamily('TestWebFont, serif');
  view.fontSize(56);
  view.lineHeight('130%');
  view.textWrap(true);
  view.textAlign('left');

  const t = createRef<Txt>();

  view.add(
    <Txt ref={t} width={560} letterSpacing={0.5}>
      Start
    </Txt>,
  );

  yield* waitFor(0.25);
  // Tween text content. The implementation measures sizes before animating,
  // and should wait for document.fonts.ready when fonts are loading.
  yield* t().text('The quick brown fox jumps over the lazy dog', 1.2);
  yield* waitFor(0.3);
  yield* t().text('Pack my box with five dozen liquor jugs', 1.2);
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'text_tween_font_ready',
  scenes: [scene],
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
        options: {
          format: 'mp4',
        },
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

