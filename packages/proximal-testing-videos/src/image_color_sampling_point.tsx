import {makeProject, Vector2} from '@revideo/core';
import {Img, Rect, makeScene2D} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

// Helper to create a tiny 3x1 PNG with pixels: [red, green, blue]
function createTestImageDataURL(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 3;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', {willReadFrequently: true});
  if (!ctx) throw new Error('No 2D context');
  const imageData = ctx.createImageData(3, 1);
  const d = imageData.data;
  // pixel 0: red
  d[0] = 255; d[1] = 0; d[2] = 0; d[3] = 255;
  // pixel 1: green
  d[4] = 0; d[5] = 255; d[6] = 0; d[7] = 255;
  // pixel 2: blue
  d[8] = 0; d[9] = 0; d[10] = 255; d[11] = 255;
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

const scene = makeScene2D('scene', function* (view) {
  const bgRef = createRef<Rect>();
  const imgRef = createRef<Img>();

  // Background rect that we will fill using a sampled color via getColorAtPoint.
  view.add(
    <Rect ref={bgRef} size={['100%', '100%']} fill={'#000'} />,
  );

  // Add the tiny image at its natural pixel size (3x1) so mapping is exact.
  const src = createTestImageDataURL();
  view.add(
    <Img ref={imgRef} src={src} width={3} height={1} smoothing={false} />,
  );

  // getColorAtPoint expects local-space coords centered at (0,0).
  // For a 3x1 image drawn at size 3x1, to sample pixel (1,0):
  // position = [1 - width/2, 0 - height/2] = [-0.5, -0.5]
  const color = imgRef().getColorAtPoint(new Vector2(-0.5, -0.5));
  bgRef().fill(color);

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'image_color_sampling_point',
  scenes: [scene],
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
        options: {format: 'mp4'},
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;

