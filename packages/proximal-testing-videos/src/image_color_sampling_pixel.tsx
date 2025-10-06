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

  // Background rect that we will fill using a sampled pixel color.
  view.add(
    <Rect ref={bgRef} size={['100%', '100%']} fill={'#000'} />,
  );

  // Add a small image from a generated data URL. Disable smoothing for crisp pixels.
  const src = createTestImageDataURL();
  view.add(
    <Img ref={imgRef} src={src} width={300} height={100} smoothing={false} />,
  );

  // Sample the middle pixel (index 1, which is green) in image pixel space.
  const color = imgRef().getPixelColor([1, 0]);
  bgRef().fill(color);

  // Keep the scene alive briefly to produce a stable video.
  yield* waitFor(1);
});

export const project = makeProject({
  name: 'image_color_sampling_pixel',
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

