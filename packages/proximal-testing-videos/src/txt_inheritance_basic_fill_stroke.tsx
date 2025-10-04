import {makeProject, Vector2} from '@revideo/core';
import {Txt, makeScene2D} from '@revideo/2d';

// This scene relies on parent Txt applying fill/stroke/lineWidth to children
// that do not specify these explicitly.
const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Txt
      fontFamily={'Inter, Arial, sans-serif'}
      fontSize={96}
      // Parent styles to inherit
      fill={'#1E90FF'}
      stroke={'#000000'}
      lineWidth={12}
      strokeFirst={true}
      position={[0, 0]}
      alignItems={'center'}
      justifyContent={'center'}
      width={'100%'}
      height={'100%'}
    >
      Parent <Txt>Child</Txt> Leaf
    </Txt>,
  );
});

export const project = makeProject({
  name: 'txt_inheritance_basic_fill_stroke',
  scenes: [scene],
  settings: {
    shared: {
      background: '#FFFFFF',
      range: [0, 2],
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

