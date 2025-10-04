import {makeProject, Vector2} from '@revideo/core';
import {Rect, Txt, makeScene2D} from '@revideo/2d';

/*
  Purpose: Validates that nested <Txt> children inherit dashed stroke styles
  (lineDash, lineDashOffset), as well as stroke and lineWidth.

  Gold branch: children show dashed outlines identical to parent.
  Removed-inheritance branch: children have no dashed stroke (default fill-only).
*/

const scene = makeScene2D('txt-inheritance-dash', function* (view) {
  view.add(
    <Rect
      size={['100%', '100%']}
      fill={'#ffffff'}
      layout
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Txt
        fontSize={90}
        fill={'#FFF59D'}
        stroke={'#2E7D32'}
        lineWidth={10}
        lineDash={[14, 10]}
        lineDashOffset={6}
        fontFamily={'"JetBrains Mono", monospace'}
      >
        DASH <Txt>CHILD A</Txt> <Txt>CHILD B</Txt>
      </Txt>
    </Rect>,
  );
});

export const project = makeProject({
  name: 'txt_inheritance_dash',
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

