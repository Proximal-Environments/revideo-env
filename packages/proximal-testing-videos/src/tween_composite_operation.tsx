import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D} from '@revideo/2d';
import {all, createRef, waitFor} from '@revideo/core';

// Tests tween/override logic when animating compositeOperation.
// We tween from source-over to screen, then back to source-over.
export const scene = makeScene2D('scene', function* (view) {
  const overlayRef = createRef<Rect>();

  // High-contrast background improves visibility of blend changes
  view.add(
    <>
      <Rect
        size={['100%', '50%']}
        position={[0, -120]}
        fill={'#143C2E'} // dark green
      />
      <Rect
        size={['100%', '50%']}
        position={[0, 120]}
        fill={'#7C2D12'} // dark orange
      />
    </>,
  );

  // Overlay rectangle starts as normal composition
  view.add(
    <Rect
      ref={overlayRef}
      width={'70%'}
      height={'60%'}
      fill={'rgba(80, 180, 255, 0.7)'}
      position={[0, 0]}
      radius={24}
      smoothCorners
      compositeOperation={'source-over'}
    />,
  );

  yield* waitFor(0.3);

  // Tween into 'screen' over 1.0s (should gradually brighten due to override)
  yield* overlayRef().compositeOperation('screen', 1.0);

  // Add some movement/rotation while in screen mode
  yield* all(
    overlayRef().rotation(20, 0.8),
    overlayRef().position([-80, -40], 0.8),
  );

  // Tween back to source-over over 0.8s
  yield* overlayRef().compositeOperation('source-over', 0.8);
});

export const project = makeProject({
  name: 'project',
  scenes: [scene],
  variables: {},
  settings: {
    shared: {
      background: '#000000',
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
