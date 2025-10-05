import {renderVideo} from '@revideo/renderer';

async function render() {
  const projectFile = process.argv[2] ?? './src/svg_static.tsx';
  const outFile = process.argv[3] ?? 'video.mp4';

  console.log(`Rendering video using ${projectFile} -> ${outFile}...`);

  const file = await renderVideo({
    projectFile,
    variables: {},
    settings: {
      logProgress: true,
      outFile: outFile,
      puppeteer: {
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process'],
        headless: true,
      },
    },
  });

  console.log(`Rendered video to ${file}`);
}

render().catch(err => {
  console.error(err);
  process.exit(1);
});

