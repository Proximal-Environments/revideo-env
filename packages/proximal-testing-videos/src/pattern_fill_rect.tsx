import {makeProject, Vector2} from '@revideo/core';
import {Rect, makeScene2D, Pattern} from '@revideo/2d';
import {waitFor} from '@revideo/core';

const scene = makeScene2D('scene', function* (view) {
  // Create a small canvas tile to be used as a repeating pattern.
  const tile = document.createElement('canvas');
  tile.width = 32;
  tile.height = 32;
  const ctx = tile.getContext('2d')!;

  // Draw a simple checkerboard-like tile with contrasting colors.
  ctx.fillStyle = '#f2f2f2';
  ctx.fillRect(0, 0, tile.width, tile.height);
  ctx.fillStyle = '#ff5252';
  ctx.fillRect(0, 0, 16, 16);
  ctx.fillStyle = '#40c4ff';
  ctx.fillRect(16, 16, 16, 16);
  ctx.strokeStyle = '#263238';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(tile.width, tile.height);
  ctx.moveTo(tile.width, 0);
  ctx.lineTo(0, tile.height);
  ctx.stroke();

  const pattern = new Pattern({image: tile, repetition: 'repeat'});

  view.add(
    <Rect
      width={440}
      height={320}
      position={[0, 0]}
      radius={16}
      // The tested feature: CanvasPattern-based fill
      fill={pattern}
      // Add a visible outline to make differences very apparent if fill fails
      stroke={'#000'}
      lineWidth={6}
    />,
  );

  // Hold for a brief moment to produce a short video
  yield* waitFor(1);
});

export const project = makeProject({
  name: 'pattern_fill_rect',
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

