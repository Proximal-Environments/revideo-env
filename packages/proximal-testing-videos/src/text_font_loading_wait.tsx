import {makeProject, Vector2, waitFor} from '@revideo/core';
import {Txt, makeScene2D} from '@revideo/2d';
import {all, createRef} from '@revideo/core';

/**
 * This scene introduces a web font and starts rendering immediately without
 * awaiting its load. With font-waiting logic present, frames block until the
 * font is ready; without it, early frames render with fallback metrics.
 */
export const scene = makeScene2D('scene', function* (view) {
  // Inject a web font into document.fonts and start loading it, but do not await.
  // Using a deterministic Google-hosted WOFF2.
  const fontUrl = 'https://fonts.gstatic.com/s/robotoslab/v24/BngMUXZYTXPIvIBgJJSb6ufN5qU.woff2';
  const ff = new FontFace('TestWebFont', `url(${fontUrl})`);
  // Add first so document.fonts.ready will include this pending face
  document.fonts.add(ff);
  // Start loading asynchronously
  void ff.load();

  // Immediately apply the font and text styles; with the old behavior, drawing
  // waits for fonts; with the removed behavior, early frames will use fallback.
  view.fontFamily('TestWebFont, serif');
  view.fontSize(64);
  view.lineHeight('140%');
  view.textWrap(true);
  view.textAlign('center');

  const title = createRef<Txt>();

  view.add(
    <Txt
      ref={title}
      width={'80%'}
      // Intentionally long text to induce wrapping and measurable layout
      // differences between fallback and the loaded web font.
    >
      The quick brown fox jumps over the lazy dog — every glyph matters.
    </Txt>,
  );

  // Provide some motion to generate multiple frames while the font is still loading.
  yield* waitFor(0.25);
  yield* all(title().scale(1.05, 0.75), title().rotation(5, 0.75));
  yield* all(title().scale(1.0, 0.75), title().rotation(0, 0.75));
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'text_font_loading_wait',
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

