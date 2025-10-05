import { Environment } from "../../proximal/core/environment";
import { RepoContainer } from "../../proximal/core/container/RepoContainer";
import { TaskRunnerAgent } from "../../proximal/core/agents/TaskRunnerAgent";
import repos from "../../repos/repos";

const TASK_ID = "media-shape-masking";

export const revideoMediaShapeMaskingEnvironment = new Environment({
  id: `revideo-media-shape-masking`,
  name: `revideo-media-shape-masking`,
  description: `revideo-media-shape-masking`,
  codebase: "Revideo",
  task: `revideo-media-shape-masking`,
  repoPath: repos.revideo.path,

  setupEnvironment: async (container: RepoContainer) => {
    console.log("🔧 Setting up Revideo environment...");

    await container.exec({
      command: "git fetch origin",
      stream: true,
    });

    console.log("📍 Checking out latest base branch...");
    await container.exec({
      command: "git fetch origin media-shape-masking-base && git checkout media-shape-masking-base && git pull origin media-shape-masking-base",
      stream: true,
    });

    console.log("📦 Installing dependencies...");
    await container.exec({
      command: "npm install",
      stream: true,
    });

    await container.exec({
      command: "npx lerna run build --skip-nx-cache",
      stream: true,
    });

    await container.resetDiffBaseline();

    console.log("✅ Environment setup completed");
  },

  variants: {
    "Difficult Prompt": async (container: RepoContainer, agent: TaskRunnerAgent) => {
      console.log("🧠 Running difficult prompt variant...");

      await agent.run(
        `Removed clipping of Img and Video pixels to their node’s shape path (e.g., rounded rectangles). Media is no longer masked to shapes and now renders as full rectangles. When rendering videos, rounded corners and non-rectangular masks are ignored, so video frames can spill outside the shape and no longer conform to strokes or radii.`
      );
    },
  },

  setupTests: async (container: RepoContainer) => {
    console.log("🧪 Setting up test environment...");

    await container.exec({
      command: "bash -lc 'git add -A && git stash push -u -m "agent-changes" || true'",
      stream: true,
    });

    await container.exec({
      command: `git restore --source origin/${summary.testBranch} -- packages/proximal-testing-videos`,
      stream: true,
    });

    await container.exec({
      command: "git checkout media-shape-masking-solution",
      stream: true,
    });

    await container.exec({
      command: "npm install && npx lerna run build --skip-nx-cache",
      stream: true,
    });

    await container.exec({
      command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/video_rounded_corners.tsx video_rounded_corners_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/img_rounded_corners.tsx img_rounded_corners_baseline.mp4",
      stream: true,
    });

    await container.exec({
      command: "git checkout media-shape-masking-base",
      stream: true,
    });

    await container.exec({
      command: "git stash pop || true",
      stream: true,
    });

    await container.exec({
      command: "npm install && npx lerna run build --skip-nx-cache",
      stream: true,
    });

    console.log("✅ Test setup completed");
  },

  tests: [
    {
      id: "compiles-correctly",
      name: "Correctly compiles?",
      description: "Test that code compiles correctly",
      test: async (container: RepoContainer) => {
        console.log("  Testing compile step...");
        try {
          const result = await container.exec({
            command: "npx lerna run build --skip-nx-cache",
            throwOnError: false,
            stream: true,
          });

          const exitCode = typeof result === "string" ? 0 : result.exitCode;
          return exitCode === 0;
        } catch (error) {
          console.error("Test execution error:", error);
          return false;
        }
      },
    },
    {
      id: "media-shape-masking-1",
      name: "Validate video_rounded_corners",
      description: "Render baseline and solution for video_rounded_corners and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/video_rounded_corners.tsx video_rounded_corners_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/video_rounded_corners_baseline.mp4 packages/proximal-testing-videos/output/video_rounded_corners_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/video_rounded_corners_baseline.mp4 packages/proximal-testing-videos/output/video_rounded_corners_solution.mp4"
          ];

          for (const command of commands) {
            const result = await container.exec({
              command,
              throwOnError: false,
              stream: true,
            });
            const exitCode = typeof result === "string" ? 0 : result.exitCode;
            if (exitCode !== 0) {
              return false;
            }
          }

          return true;
        } catch (error) {
          console.error("Test execution error:", error);
          return false;
        }
      },
    },

    {
      id: "media-shape-masking-2",
      name: "Validate img_rounded_corners",
      description: "Render baseline and solution for img_rounded_corners and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/img_rounded_corners.tsx img_rounded_corners_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/img_rounded_corners_baseline.mp4 packages/proximal-testing-videos/output/img_rounded_corners_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/img_rounded_corners_baseline.mp4 packages/proximal-testing-videos/output/img_rounded_corners_solution.mp4"
          ];

          for (const command of commands) {
            const result = await container.exec({
              command,
              throwOnError: false,
              stream: true,
            });
            const exitCode = typeof result === "string" ? 0 : result.exitCode;
            if (exitCode !== 0) {
              return false;
            }
          }

          return true;
        } catch (error) {
          console.error("Test execution error:", error);
          return false;
        }
      },
    }
  ],

  prompt: `${environmentPrompt}`,
  branches: {
    base: "testing-branch-session-mgd5ghmp-6f06fb77-env-media-shape-masking",
    solution: "testing-branch-session-mgd5ghmp-6f06fb77-env-media-shape-masking-solution",
    diff: "https://github.com/Proximal-Labs/task-demo-revideo/compare/testing-branch-session-mgd5ghmp-6f06fb77-env-media-shape-masking...testing-branch-session-mgd5ghmp-6f06fb77-env-media-shape-masking-solution",
    testingPr: "https://github.com/Proximal-Environments/revideo-env/pull/22",
    environmentPr: "",
  },
});

export default revideoMediaShapeMaskingEnvironment;