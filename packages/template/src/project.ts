import {Color, makeProject, Vector2} from '@revideo/core';

import {scene} from './example';

import './global.css';

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
      size: new Vector2(1920, 1080),
    },
    preview: {
      fps: 30,
      resolutionScale: 1,
    },
    rendering: {
      exporter: {
        name: '@revideo/core/wasm',
      },
      audio: {
        mute: false,
      },
      fps: 30,
      resolutionScale: 1,
      colorSpace: 'srgb',
    },
  },
});

export default project;
