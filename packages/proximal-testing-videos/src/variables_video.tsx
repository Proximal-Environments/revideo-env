import {Txt, makeScene2D, Rect} from '@revideo/2d';
import {waitFor, makeProject, Vector2, useScene} from '@revideo/core';

/**
 * The Revideo scene
 */
export const scene = makeScene2D('scene', function* (view) {
  const color = useScene().variables.get('color', 'red')();
  const message = useScene().variables.get('message', 'message')();
  const message2 = useScene().variables.get('message2', 'message2')();


  view.add(
    <Rect size={"100%"} fill={"red"} />
  )

  yield* waitFor(0.2);

  view.add(
    <Txt
      text={message}
      y={100}
      fontSize={30}
    />,
  );

  view.add(
    <Txt
      text={message2}
      y={-100}
      fontSize={30}
    />,
  );

  yield* waitFor(0.5);
});


export const project = makeProject({
    name: 'project',
    scenes: [scene],
    variables: {
      fill: 'green',
    },
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
