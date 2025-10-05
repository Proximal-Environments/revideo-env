// Lightweight JS wrapper to render a project file via @revideo/renderer
async function main() {
  const {renderVideo} = require('@revideo/renderer');
  const projectFile = process.argv[2] || './src/project.ts';
  const outFile = process.argv[3] || 'video.mp4';

  console.log(`Rendering video using ${projectFile} -> ${outFile}...`);
  const file = await renderVideo({
    projectFile,
    settings: {
      logProgress: true,
      outFile,
      puppeteer: {
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process'],
        headless: true,
      },
    },
  });
  console.log(`Rendered video to ${file}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

