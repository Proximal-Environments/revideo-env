import {makeProject, Vector2} from '@revideo/core';
import {makeScene2D, Txt, Img} from '@revideo/2d';
import {all, createRef, waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  const title = createRef<Txt>();
  const logo = createRef<Img>();

  view.add(
    <>
      <Txt
        ref={title}
        x={0}
        y={-100}
        fontSize={64}
        fill={'#1B1B1B'}
        shadowColor={'rgba(0,0,0,0.7)'}
        shadowBlur={20}
        shadowOffset={{x: 12, y: 12}}
      >
        Shadowed Text
      </Txt>
      <Img
        ref={logo}
        y={80}
        width={160}
        src={'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'}
        shadowColor={'rgba(0,0,0,0.85)'}
        shadowBlur={28}
        shadowOffset={{x: 18, y: 14}}
      />
    </>,
  );

  yield* waitFor(0.3);
  yield* all(title().x(-120, 0.6), logo().x(120, 0.6));
  yield* waitFor(0.3);
});

export const project = makeProject({
  name: 'shadow-text-image',
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

