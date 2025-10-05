import { Environment } from "../../proximal/core/environment";
import { RepoContainer } from "../../proximal/core/container/RepoContainer";
import { TaskRunnerAgent } from "../../proximal/core/agents/TaskRunnerAgent";
import repos from "../../repos/repos";

const TASK_ID = "rounded-rect-smooth-corners";

export const revideoRoundedRectSmoothCornersEnvironment = new Environment({
  id: `revideo-rounded-rect-smooth-corners`,
  name: `revideo-rounded-rect-smooth-corners`,
  description: `revideo-rounded-rect-smooth-corners`,
  codebase: "Revideo",
  task: `revideo-rounded-rect-smooth-corners`,
  repoPath: repos.revideo.path,

  setupEnvironment: async (container: RepoContainer) => {
    console.log("🔧 Setting up Revideo environment...");

    await container.exec({
      command: "git fetch origin",
      stream: true,
    });

    console.log("📍 Checking out latest base branch...");
    await container.exec({
      command: "git fetch origin rounded-rect-smooth-corners-base && git checkout rounded-rect-smooth-corners-base && git pull origin rounded-rect-smooth-corners-base",
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
        `Removed support for rounded and smoothed rectangle corners in the 2D renderer. drawRoundRect now draws a plain rectangle and ignores radius, smoothCorners, and cornerSharpness; the radius adjustment helper was deleted. Rendering change: any shapes that previously had rounded or smoothed corners will now appear with sharp 90° corners in frames/videos.`
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
      command: "git checkout rounded-rect-smooth-corners-solution",
      stream: true,
    });

    await container.exec({
      command: "npm install && npx lerna run build --skip-nx-cache",
      stream: true,
    });

    await container.exec({
      command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/round_rect_uniform.tsx round_rect_uniform_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/round_rect_per_corner.tsx round_rect_per_corner_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/round_rect_smooth.tsx round_rect_smooth_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/round_rect_large_radius_adjust.tsx round_rect_large_radius_adjust_baseline.mp4",
      stream: true,
    });

    await container.exec({
      command: "git checkout rounded-rect-smooth-corners-base",
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
      id: "rounded-rect-smooth-corners-1",
      name: "Validate round_rect_uniform",
      description: "Render baseline and solution for round_rect_uniform and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/round_rect_uniform.tsx round_rect_uniform_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/round_rect_uniform_baseline.mp4 packages/proximal-testing-videos/output/round_rect_uniform_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/round_rect_uniform_baseline.mp4 packages/proximal-testing-videos/output/round_rect_uniform_solution.mp4"
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
      id: "rounded-rect-smooth-corners-2",
      name: "Validate round_rect_per_corner",
      description: "Render baseline and solution for round_rect_per_corner and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/round_rect_per_corner.tsx round_rect_per_corner_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/round_rect_per_corner_baseline.mp4 packages/proximal-testing-videos/output/round_rect_per_corner_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/round_rect_per_corner_baseline.mp4 packages/proximal-testing-videos/output/round_rect_per_corner_solution.mp4"
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
      id: "rounded-rect-smooth-corners-3",
      name: "Validate round_rect_smooth",
      description: "Render baseline and solution for round_rect_smooth and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/round_rect_smooth.tsx round_rect_smooth_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/round_rect_smooth_baseline.mp4 packages/proximal-testing-videos/output/round_rect_smooth_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/round_rect_smooth_baseline.mp4 packages/proximal-testing-videos/output/round_rect_smooth_solution.mp4"
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
      id: "rounded-rect-smooth-corners-4",
      name: "Validate round_rect_large_radius_adjust",
      description: "Render baseline and solution for round_rect_large_radius_adjust and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/round_rect_large_radius_adjust.tsx round_rect_large_radius_adjust_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/round_rect_large_radius_adjust_baseline.mp4 packages/proximal-testing-videos/output/round_rect_large_radius_adjust_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/round_rect_large_radius_adjust_baseline.mp4 packages/proximal-testing-videos/output/round_rect_large_radius_adjust_solution.mp4"
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
    base: "rounded-rect-smooth-corners-base",
    solution: "rounded-rect-smooth-corners-solution",
    diff: "https://github.com/Proximal-Labs/task-demo-revideo/compare/rounded-rect-smooth-corners-base...rounded-rect-smooth-corners-solution",
    testingPr: "https://github.com/Proximal-Environments/revideo-env/pull/17",
    environmentPr: "",
  },
});

export default revideoRoundedRectSmoothCornersEnvironment;