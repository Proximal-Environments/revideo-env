import type {
  FfmpegExporterOptions,
  RenderVideoUserProjectSettings,
} from '@revideo/core';
import type {FfmpegSettings} from '@revideo/ffmpeg';
import {
  audioCodecs,
  createSilentAudioFile,
  doesFileExist,
  extensions,
  getVideoDuration,
  mergeAudioWithVideo,
} from '@revideo/ffmpeg';
import {EventName, sendEvent} from '@revideo/telemetry';
import motionCanvas from '@revideo/vite-plugin';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type {Browser, PuppeteerLaunchOptions} from 'puppeteer';
import puppeteer from 'puppeteer';
import type {InlineConfig, ServerOptions, ViteDevServer} from 'vite';
import {createServer} from 'vite';
import {rendererPlugin} from './renderer-plugin';
import {getParamDefaultsAndCheckValidity} from './validate-settings';

export interface RenderSettings {
  // Name of the video file (default is 'video.mp4')
  outFile?: `${string}.mp4` | `${string}.webm` | `${string}.mov`;

  // Folder where the video will be saved (default is './out')
  outDir?: string;

  ffmpeg?: FfmpegSettings;

  puppeteer?: PuppeteerLaunchOptions;

  logProgress?: boolean;

  projectSettings?: RenderVideoUserProjectSettings;

  /**
   * Port used by the Vite server.
   *
   * Default is 9000
   */
  viteBasePort?: number;

  /**
   * @deprecated Use `viteConfig.server` instead.
   */
  viteServerOptions?: Omit<ServerOptions, 'port'>;
  viteConfig?: InlineConfig;
  progressCallback?: (progress: number) => void;
}

/**
 * We pass a lot of render settings to the client side of the renderer
 * via the URL. This function builds the URL with the necessary parameters.
 */
function buildUrl(port: number, fileName: string, hiddenFolderId: string) {
  const fileNameEscaped = encodeURIComponent(fileName);
  const hiddenFolderIdEscaped = encodeURIComponent(hiddenFolderId);

  return `http://localhost:${port}/render?fileName=${fileNameEscaped}&hiddenFolderId=${hiddenFolderIdEscaped}`;
}

/**
 * Starts the vite server and creates a puppeteer browser instance
 */
async function initBrowserAndServer(
  fixedPort: number,
  projectFile: string,
  outputFolderName: string,
  settings: RenderSettings,
  variables?: Record<string, unknown>,
) {
  const args = settings.puppeteer?.args ?? [];
  args.includes('--single-process') || args.push('--single-process');

  const resolvedProjectPath = path.join(process.cwd(), projectFile);
  const [browser, server] = await Promise.all([
    puppeteer.launch({headless: true, ...settings.puppeteer, args}),
    createServer({
      configFile: false,
      plugins: [
        motionCanvas({project: resolvedProjectPath, output: outputFolderName}),
        rendererPlugin(
          settings.projectSettings,
          variables,
          settings.ffmpeg,
          projectFile,
        ),
      ],
      ...settings.viteConfig,
      server: {
        port: fixedPort,
        hmr: false,
        ...settings.viteServerOptions,
        ...settings.viteConfig?.server,
      },
    }).then(server => server.listen()),
  ]);

  if (!server.httpServer) {
    throw new Error('HTTP server is not initialized');
  }
  const address = server.httpServer.address();
  const resolvedPort =
    address && typeof address === 'object' ? address.port : null;
  if (resolvedPort === null) {
    throw new Error('Server address is null');
  }

  return {browser, server, resolvedPort};
}

function trackProgress(tracker: Map<number, number>, progress: number) {
  tracker.set(0, progress);
}

/**
 * Navigates to the URL and renders the video on the page
 */
async function renderVideoOnPage(
  browser: Browser,
  server: ViteDevServer,
  url: string,
  progressTracker: Map<number, number>,
  progressCallback?: (progress: number) => void,
  logProgress?: boolean,
) {
  function printProgress() {
    let line = '';
    for (const value of progressTracker.values()) {
      line += `Render progress: ${(value * 100).toFixed(0)}% `;
    }

    if (line === '') {
      return;
    }

    console.log(line);
  }

  const interval = setInterval(() => {
    printProgress();
  }, 1000);

  const page = await browser.newPage();
  if (!server.httpServer) {
    throw new Error('HTTP server is not initialized');
  }
  const address = server.httpServer.address();
  const port = address && typeof address === 'object' ? address.port : null;
  if (port === null) {
    throw new Error('Server address is null');
  }

  sendEvent(EventName.RenderStarted);

  // Attach logs from puppeteer to the console
  page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i) {
      const message = msg.args()[i];
      if (message.toString().includes('[vite]')) {
        continue;
      }

      console.log(msg.args()[i].toString());
    }
  });

  page.exposeFunction('logProgress', (progress: number) => {
    if (progressCallback) {
      progressCallback(progress);
    }
    if (logProgress) {
      trackProgress(progressTracker, progress);
    }
  });

  const renderingComplete = new Promise<void>((resolve, reject) => {
    page.exposeFunction('onRenderComplete', async () => {
      await Promise.all([browser.close(), server.close()]);
      clearInterval(interval);
      resolve();
    });

    page.exposeFunction('onRenderFailed', async (errorMessage: string) => {
      await Promise.all([browser.close(), server.close()]);
      console.error('Rendering failed:', errorMessage);
      clearInterval(interval);
      reject(new Error(errorMessage));
    });

    page.exposeFunction('browserError', (message: string) => {
      reject(new Error(message));
    });
  });

  await page.goto(url);

  return renderingComplete;
}

/**
 * Initializes the browser and starts rendering the video
 */
async function initializeBrowserAndStartRendering(
  projectFile: string,
  outputFileName: string,
  outputFolderName: string,
  settings: RenderSettings,
  hiddenFolderId: string,
  variables?: Record<string, unknown>,
  progressCallback?: (progress: number) => void,
) {
  const port = settings.viteBasePort ?? 9000;

  const {browser, server, resolvedPort} = await initBrowserAndServer(
    port,
    projectFile,
    outputFolderName,
    settings,
    variables,
  );

  const url = buildUrl(resolvedPort, outputFileName, hiddenFolderId);

  return renderVideoOnPage(
    browser,
    server,
    url,
    new Map<number, number>(),
    progressCallback,
    settings.logProgress,
  );
}

async function getRenderedMedia(
  outputFileName: string,
  format: FfmpegExporterOptions['format'],
  hiddenFolderId: string,
) {
  const videoFilePath = `${os.tmpdir()}/revideo-${outputFileName}-${hiddenFolderId}/visuals.${extensions[format]}`;
  const audioFilePath = `${os.tmpdir()}/revideo-${outputFileName}-${hiddenFolderId}/audio.wav`;

  if (!(await doesFileExist(audioFilePath))) {
    const videoDuration = await getVideoDuration(videoFilePath);
    await createSilentAudioFile(audioFilePath, videoDuration);
  }

  return {audioFilePath, videoFilePath};
}

/**
 * Merges audio and video into a single video file.
 */
async function mergeRenderedMedia(
  outputFileName: string,
  outputFolder: string,
  audioFilePath: string,
  videoFilePath: string,
  format: FfmpegExporterOptions['format'],
) {
  await mergeAudioWithVideo(
    audioFilePath,
    videoFilePath,
    path.join(outputFolder, `${outputFileName}.${extensions[format]}`),
    audioCodecs[format],
  );
}

/**
 * Deletes all temporary files after merging is done
 */
async function cleanup(
  outputFileName: string,
  hiddenFolderId: string,
) {
  await fs.promises
    .rm(`${os.tmpdir()}/revideo-${outputFileName}-${hiddenFolderId}`, {
      recursive: true,
      force: true,
    })
    .catch(() => {});
}

const defaultSettings: RenderSettings = {
  projectSettings: {
    exporter: {
      name: '@revideo/core/wasm',
    },
  },
};

interface RenderVideoParams {
  projectFile: string;
  variables?: Record<string, unknown>;
  settings?: RenderSettings;
}

/**
 * Renders a video to a file.
 * @param projectFile - Path to the project.ts file.
 * @param variables - Variables to pass to your project (see https://docs.re.video/parameterized-video)
 * @param progressCallback - Callback function to track rendering progress. Progress is a number between 0 and 1.
 * @param settings - Settings for the rendering process.
 * @returns - Path to the rendered video file.
 */
export async function renderVideo({
  projectFile,
  variables,
  settings = defaultSettings,
}: RenderVideoParams): Promise<string> {
  const {
    outputFileName,
    outputFolderName,
    hiddenFolderId,
    format,
  } = getParamDefaultsAndCheckValidity(settings);

  // Start rendering
  await initializeBrowserAndStartRendering(
    projectFile,
    outputFileName,
    outputFolderName,
    settings,
    hiddenFolderId,
    variables,
    settings.progressCallback,
  );

  const {audioFilePath, videoFilePath} = await getRenderedMedia(
    outputFileName,
    format,
    hiddenFolderId,
  );
  await mergeRenderedMedia(
    outputFileName,
    outputFolderName,
    audioFilePath,
    videoFilePath,
    format,
  );
  await cleanup(outputFileName, hiddenFolderId);

  return path.join(outputFolderName, `${outputFileName}.${extensions[format]}`);
}
