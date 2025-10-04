import {makeProject, Vector2} from '@revideo/core';
import {Txt, makeScene2D} from '@revideo/2d';

// Scene to exercise inheritance of all relevant text drawing styles:
// fill, stroke, lineWidth, strokeFirst, lineCap, lineJoin, lineDash, lineDashOffset
const scene = makeScene2D('scene', function* (view) {
  view.add(
    <Txt
      fontFamily={'Inter, Arial, sans-serif'}
      fontSize={88}
      fill={'#C62828'} // red fill
      stroke={'#1A237E'} // deep blue stroke
      lineWidth={14}
      strokeFirst={false}
      lineCap={'round'}
      lineJoin={'bevel'}
      lineDash={[18, 10]}
      lineDashOffset={6}
      position={[0, -60]}
      alignItems={'center'}
      justifyContent={'center'}
      width={'100%'}
      height={'50%'}
    >
      Inherit <Txt>All</Txt> Styles
    </Txt>,
  );

  // A second line that also relies on inheritance (different dash/offset)
  view.add(
    <Txt
      fontFamily={'Inter, Arial, sans-serif'}
      fontSize={72}
      fill={'#2E7D32'} // green fill
      stroke={'#4E342E'} // brown stroke
      lineWidth={10}
      strokeFirst={true}
      lineCap={'butt'}
      lineJoin={'round'}
      lineDash={[12, 8]}
      lineDashOffset={2}
      position={[0, 80]}
      alignItems={'center'}
      justifyContent={'center'}
      width={'100%'}
      height={'50%'}
    >
      Parent <Txt>Child</Txt> Leaf
    </Txt>,
  );
});

export const project = makeProject({
  name: 'txt_inheritance_all_styles',
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

