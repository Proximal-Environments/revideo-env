import {makeProject, Vector2} from '@revideo/core';
import {Circle, Rect, makeScene2D, Pattern} from '@revideo/2d';
import {waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  // Background block so the patterned stroke is clearly visible
  view.add(
    <Rect width={'100%'} height={'100%'} fill={'#fafafa'} />,
  );

  // Create a stripe tile for the stroke pattern
  const tile = document.createElement('canvas');
  tile.width = 32;
  tile.height = 32;
  const ctx = tile.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tile.width, tile.height);
  ctx.strokeStyle = '#7b1fa2';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-8, 8);
  ctx.lineTo(40, 56);
  ctx.moveTo(-8, -8);
  ctx.lineTo(40, 40);
  ctx.stroke();

  const strokePattern = new Pattern({image: tile, repetition: 'repeat'});

  view.add(
    <Circle
      size={300}
      position={[0, 0]}
      // The tested feature: CanvasPattern-based stroke
      stroke={strokePattern}
      lineWidth={36}
      // Explicitly no fill to focus on stroke rendering
      fill={null}
    />,
  );

  yield* waitFor(1);
});

export const project = makeProject({
  name: 'pattern_stroke_circle',
  scenes: [scene],
  settings: {
    shared: {
      background: '#ffffff',
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

