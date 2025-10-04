import {makeProject, Vector2} from '@revideo/core';
import {Rect, Txt, makeScene2D} from '@revideo/2d';

/*
  Purpose: Validates that nested <Txt> children inherit `strokeFirst` ordering
  along with fill/stroke props.

  Gold branch: children use stroke-first order (stroke under fill), producing
  a softer outline.
  Removed-inheritance branch: children render default fill-then-stroke or no
  stroke at all (depending on other inheritance removals).
*/

const scene = makeScene2D('txt-inheritance-stroke-first', function* (view) {
  view.add(
    <Rect
      size={['100%', '100%']}
      fill={'#ffffff'}
      layout
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Txt
        fontSize={96}
        fill={'#FFECB3'}
        stroke={'#C62828'}
        lineWidth={14}
        strokeFirst={true}
        fontFamily={'"JetBrains Mono", monospace'}
      >
        ORDER <Txt>CHILD A</Txt> <Txt>CHILD B</Txt>
      </Txt>
    </Rect>,
  );
});

export const project = makeProject({
  name: 'txt_inheritance_stroke_first',
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

