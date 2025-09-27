import {renderVideo} from '@revideo/renderer';

async function render() {
  const projectFile = process.argv[2] ?? './src/project.ts';
  const outFile = process.argv[3] ?? 'video.mp4';

  console.log(`Rendering video using ${projectFile} -> ${outFile}...`);

  const file = await renderVideo({
    projectFile,
    settings: {
      logProgress: true,
      outFile: outFile as `${string}.mp4` | `${string}.webm` | `${string}.mov`,
    },
  });

  console.log(`Rendered video to ${file}`);
}

render();
