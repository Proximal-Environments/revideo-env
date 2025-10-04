import {makeProject, Vector2} from '@revideo/core';
import {Rect, Txt, makeScene2D} from '@revideo/2d';

/*
  Purpose: Validates that nested <Txt> children inherit paint styles
  (fill, stroke, lineWidth) from their parent <Txt>.

  Gold branch: children are outlined (stroke) and filled as parent.
  Removed-inheritance branch: children render with default fill-only (no stroke).
*/

const scene = makeScene2D('txt-inheritance-stroke', function* (view) {
  view.add(
    <Rect
      size={['100%', '100%']}
      fill={'#ffffff'}
      layout
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Txt
        fontSize={100}
        fill={'#FFF59D'}
        stroke={'#1565C0'}
        lineWidth={12}
        fontFamily={'"JetBrains Mono", monospace'}
      >
        PARENT <Txt>CHILD A</Txt> <Txt>CHILD B</Txt>
      </Txt>
    </Rect>,
  );
});

export const project = makeProject({
  name: 'txt_inheritance_stroke',
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
        options: {format: 'mp4'},
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

