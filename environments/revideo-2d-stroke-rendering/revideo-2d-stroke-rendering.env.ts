import { Environment } from "../../proximal/core/environment";
import { RepoContainer } from "../../proximal/core/container/RepoContainer";
import { TaskRunnerAgent } from "../../proximal/core/agents/TaskRunnerAgent";
import repos from "../../repos/repos";

const TASK_ID = "2d-stroke-rendering";

export const revideo2dStrokeRenderingEnvironment = new Environment({
  id: `revideo-2d-stroke-rendering`,
  name: `revideo-2d-stroke-rendering`,
  description: `revideo-2d-stroke-rendering`,
  codebase: "Revideo",
  task: `revideo-2d-stroke-rendering`,
  repoPath: repos.revideo.path,

  setupEnvironment: async (container: RepoContainer) => {
    console.log("🔧 Setting up Revideo environment...");

    await container.exec({
      command: "git fetch origin",
      stream: true,
    });

    console.log("📍 Checking out latest base branch...");
    await container.exec({
      command: "git fetch origin 2d-stroke-rendering-base && git checkout 2d-stroke-rendering-base && git pull origin 2d-stroke-rendering-base",
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
        `Removed stroke drawing for 2D shapes and text. Shapes no longer call context.stroke, text uses fillText only, and curve arrowheads (stroke-based) are not drawn. In rendered videos, outlines/borders and dashed strokes no longer appear—only fills are visible, and stroke-related properties (color, width, order) have no effect.`
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
      command: "git checkout 2d-stroke-rendering-solution",
      stream: true,
    });

    await container.exec({
      command: "npm install && npx lerna run build --skip-nx-cache",
      stream: true,
    });

    await container.exec({
      command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/stroke_rects.tsx stroke_rects_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/dashed_line.tsx dashed_line_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/text_stroke.tsx text_stroke_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/curve_arrowheads.tsx curve_arrowheads_baseline.mp4",
      stream: true,
    });

    await container.exec({
      command: "git checkout 2d-stroke-rendering-base",
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
      id: "2d-stroke-rendering-1",
      name: "Validate stroke_rects",
      description: "Render baseline and solution for stroke_rects and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/stroke_rects.tsx stroke_rects_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/stroke_rects_baseline.mp4 packages/proximal-testing-videos/output/stroke_rects_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/stroke_rects_baseline.mp4 packages/proximal-testing-videos/output/stroke_rects_solution.mp4"
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
      id: "2d-stroke-rendering-2",
      name: "Validate dashed_line",
      description: "Render baseline and solution for dashed_line and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/dashed_line.tsx dashed_line_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/dashed_line_baseline.mp4 packages/proximal-testing-videos/output/dashed_line_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/dashed_line_baseline.mp4 packages/proximal-testing-videos/output/dashed_line_solution.mp4"
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
      id: "2d-stroke-rendering-3",
      name: "Validate text_stroke",
      description: "Render baseline and solution for text_stroke and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/text_stroke.tsx text_stroke_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/text_stroke_baseline.mp4 packages/proximal-testing-videos/output/text_stroke_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/text_stroke_baseline.mp4 packages/proximal-testing-videos/output/text_stroke_solution.mp4"
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
      id: "2d-stroke-rendering-4",
      name: "Validate curve_arrowheads",
      description: "Render baseline and solution for curve_arrowheads and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/curve_arrowheads.tsx curve_arrowheads_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/curve_arrowheads_baseline.mp4 packages/proximal-testing-videos/output/curve_arrowheads_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/curve_arrowheads_baseline.mp4 packages/proximal-testing-videos/output/curve_arrowheads_solution.mp4"
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
    base: "testing-branch-session-mgd5w8xe-2a433b3b-env-2d-stroke-rendering",
    solution: "testing-branch-session-mgd5w8xe-2a433b3b-env-2d-stroke-rendering-solution",
    diff: "https://github.com/Proximal-Labs/task-demo-revideo/compare/testing-branch-session-mgd5w8xe-2a433b3b-env-2d-stroke-rendering...testing-branch-session-mgd5w8xe-2a433b3b-env-2d-stroke-rendering-solution",
    testingPr: "",
    environmentPr: "",
  },
});

export default revideo2dStrokeRenderingEnvironment;