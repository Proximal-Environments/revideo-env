import { Environment } from "../../proximal/core/environment";
import { RepoContainer } from "../../proximal/core/container/RepoContainer";
import { TaskRunnerAgent } from "../../proximal/core/agents/TaskRunnerAgent";
import repos from "../../repos/repos";

const TASK_ID = "2d-gradient-fills-and-strokes";

export const revideo2dGradientFillsAndStrokesEnvironment = new Environment({
  id: `revideo-2d-gradient-fills-and-strokes`,
  name: `revideo-2d-gradient-fills-and-strokes`,
  description: `revideo-2d-gradient-fills-and-strokes`,
  codebase: "Revideo",
  task: `revideo-2d-gradient-fills-and-strokes`,
  repoPath: repos.revideo.path,

  setupEnvironment: async (container: RepoContainer) => {
    console.log("🔧 Setting up Revideo environment...");

    await container.exec({
      command: "git fetch origin",
      stream: true,
    });

    console.log("📍 Checking out latest base branch...");
    await container.exec({
      command: "git fetch origin 2d-gradient-fills-and-strokes-base && git checkout 2d-gradient-fills-and-strokes-base && git pull origin 2d-gradient-fills-and-strokes-base",
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
        `Removed the Gradient canvas style from the 2D renderer (linear/conic/radial). Gradient objects are no longer accepted in fill/stroke styles—only solid colors and patterns remain. When rendering/exporting videos, any shapes that previously used gradients will no longer display gradient transitions and will instead render with flat colors (or missing fill/stroke if no color fallback), altering the visual appearance of those scenes.`
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
      command: "git checkout 2d-gradient-fills-and-strokes-solution",
      stream: true,
    });

    await container.exec({
      command: "npm install && npx lerna run build --skip-nx-cache",
      stream: true,
    });

    await container.exec({
      command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/gradient_conic.tsx gradient_conic_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/gradient_linear.tsx gradient_linear_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/gradient_radial.tsx gradient_radial_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/gradient_stroke_linear.tsx gradient_stroke_linear_baseline.mp4",
      stream: true,
    });

    await container.exec({
      command: "git checkout 2d-gradient-fills-and-strokes-base",
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
      id: "2d-gradient-fills-and-strokes-1",
      name: "Validate gradient_conic",
      description: "Render baseline and solution for gradient_conic and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/gradient_conic.tsx gradient_conic_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/gradient_conic_baseline.mp4 packages/proximal-testing-videos/output/gradient_conic_solution.mp4"
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
      id: "2d-gradient-fills-and-strokes-2",
      name: "Validate gradient_linear",
      description: "Render baseline and solution for gradient_linear and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/gradient_linear.tsx gradient_linear_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/gradient_linear_baseline.mp4 packages/proximal-testing-videos/output/gradient_linear_solution.mp4"
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
      id: "2d-gradient-fills-and-strokes-3",
      name: "Validate gradient_radial",
      description: "Render baseline and solution for gradient_radial and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/gradient_radial.tsx gradient_radial_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/gradient_radial_baseline.mp4 packages/proximal-testing-videos/output/gradient_radial_solution.mp4"
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
      id: "2d-gradient-fills-and-strokes-4",
      name: "Validate gradient_stroke_linear",
      description: "Render baseline and solution for gradient_stroke_linear and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/gradient_stroke_linear.tsx gradient_stroke_linear_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/gradient_stroke_linear_baseline.mp4 packages/proximal-testing-videos/output/gradient_stroke_linear_solution.mp4"
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
    base: "testing-branch-session-mgd5w8xe-2a433b3b-env-2d-gradient-fills-and-strokes",
    solution: "testing-branch-session-mgd5w8xe-2a433b3b-env-2d-gradient-fills-and-strokes-solution",
    diff: "https://github.com/Proximal-Labs/task-demo-revideo/compare/testing-branch-session-mgd5w8xe-2a433b3b-env-2d-gradient-fills-and-strokes...testing-branch-session-mgd5w8xe-2a433b3b-env-2d-gradient-fills-and-strokes-solution",
    testingPr: "",
    environmentPr: "",
  },
});

export default revideo2dGradientFillsAndStrokesEnvironment;