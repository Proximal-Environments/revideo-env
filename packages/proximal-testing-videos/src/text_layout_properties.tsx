import {makeProject, Vector2, waitFor} from '@revideo/core';
import {Txt, makeScene2D, Layout} from '@revideo/2d';
import {all, createRef} from '@revideo/core';

/**
 * This scene stresses layout-affecting text properties: fontFamily, fontSize,
 * fontWeight, fontStyle, lineHeight, letterSpacing, textWrap, and textAlign.
 * If style application is disabled, DOM measurement used for placement will
 * ignore these, causing different line breaks and alignment.
 */
export const scene = makeScene2D('scene', function* (view) {
  // Use the same font as the other scene to maximize layout differences.
  const fontUrl = 'https://fonts.gstatic.com/s/robotoslab/v24/BngMUXZYTXPIvIBgJJSb6ufN5qU.woff2';
  const ff = new FontFace('TestWebFont', `url(${fontUrl})`);
  document.fonts.add(ff);
  void ff.load();

  view.fontFamily('TestWebFont, serif');
  view.fontSize(42);
  view.lineHeight('150%');
  view.textWrap(true);

  const header = createRef<Txt>();
  const body = createRef<Layout>();

  view.add(
    <Txt
      ref={header}
      fontWeight={700}
      fontStyle={'italic'}
      textAlign={'center'}
      letterSpacing={1.5}
      width={'90%'}
    >
      Measuring styled text: weight, italics, spacing, and alignment
    </Txt>,
  );

  view.add(
    <Txt
      ref={body}
      y={80}
      width={520}
      textAlign={'right'}
      letterSpacing={0.75}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean euismod.
    </Txt>,
  );

  // Animate size and letter spacing to force recomputation paths that depend on
  // correct font metrics and style propagation.
  yield* waitFor(0.5);
  yield* all(header().letterSpacing(3, 0.75), body().width(440, 0.75));
  yield* all(header().letterSpacing(1.5, 0.75), body().width(520, 0.75));
  yield* waitFor(0.5);
});

export const project = makeProject({
  name: 'text_layout_properties',
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

