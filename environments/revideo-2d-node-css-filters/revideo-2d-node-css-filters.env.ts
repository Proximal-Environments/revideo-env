import { Environment } from "../../proximal/core/environment";
import { RepoContainer } from "../../proximal/core/container/RepoContainer";
import { TaskRunnerAgent } from "../../proximal/core/agents/TaskRunnerAgent";
import repos from "../../repos/repos";

const TASK_ID = "2d-node-css-filters";

export const revideo2dNodeCssFiltersEnvironment = new Environment({
  id: `revideo-2d-node-css-filters`,
  name: `revideo-2d-node-css-filters`,
  description: `revideo-2d-node-css-filters`,
  codebase: "Revideo",
  task: `revideo-2d-node-css-filters`,
  repoPath: repos.revideo.path,

  setupEnvironment: async (container: RepoContainer) => {
    console.log("🔧 Setting up Revideo environment...");

    await container.exec({
      command: "git fetch origin",
      stream: true,
    });

    console.log("📍 Checking out latest base branch...");
    await container.exec({
      command: "git fetch origin 2d-node-css-filters-base && git checkout 2d-node-css-filters-base && git pull origin 2d-node-css-filters-base",
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
        `Removed the CSS-like filters system from the 2D engine (blur, invert, grayscale, brightness, contrast, saturate, hue-rotate). Nodes can no longer set or animate filters via the filters API. When rendering videos, any previously applied filters will not appear (frames render without those effects), and scenes referencing node.filters will error. Cache/bounding boxes no longer expand for blur, which may slightly change cached region edges.`
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
      command: "git restore --source origin/testing-branch -- packages/proximal-testing-videos",
      stream: true,
    });

    await container.exec({
      command: "git checkout 2d-node-css-filters-solution",
      stream: true,
    });

    await container.exec({
      command: "npm install && npx lerna run build --skip-nx-cache",
      stream: true,
    });

    await container.exec({
      command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/filters_static_grid.tsx filters_static_grid_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/filters_animated_cycle.tsx filters_animated_cycle_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/blur_bounds_motion.tsx blur_bounds_motion_baseline.mp4",
      stream: true,
    });

    await container.exec({
      command: "git checkout 2d-node-css-filters-base",
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
      id: "2d-node-css-filters-1",
      name: "Validate filters_static_grid",
      description: "Render baseline and solution for filters_static_grid and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/filters_static_grid.tsx filters_static_grid_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/filters_static_grid_baseline.mp4 packages/proximal-testing-videos/output/filters_static_grid_solution.mp4"
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
      id: "2d-node-css-filters-2",
      name: "Validate filters_animated_cycle",
      description: "Render baseline and solution for filters_animated_cycle and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/filters_animated_cycle.tsx filters_animated_cycle_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/filters_animated_cycle_baseline.mp4 packages/proximal-testing-videos/output/filters_animated_cycle_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/filters_animated_cycle_baseline.mp4 packages/proximal-testing-videos/output/filters_animated_cycle_solution.mp4"
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
      id: "2d-node-css-filters-3",
      name: "Validate blur_bounds_motion",
      description: "Render baseline and solution for blur_bounds_motion and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/blur_bounds_motion.tsx blur_bounds_motion_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages-proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/blur_bounds_motion_baseline.mp4 packages/proximal-testing-videos/output/blur_bounds_motion_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/blur_bounds_motion_baseline.mp4 packages/proximal-testing-videos/output/blur_bounds_motion_solution.mp4"
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
    base: "2d-node-css-filters-base",
    solution: "2d-node-css-filters-solution",
    diff: "https://github.com/Proximal-Labs/task-demo-revideo/compare/2d-node-css-filters-base...2d-node-css-filters-solution",
    testingPr: "https://github.com/Proximal-Environments/revideo-env/pull/10",
    environmentPr: "",
  },
});

export default revideo2dNodeCssFiltersEnvironment;