import { Environment } from "../../proximal/core/environment";
import { RepoContainer } from "../../proximal/core/container/RepoContainer";
import { TaskRunnerAgent } from "../../proximal/core/agents/TaskRunnerAgent";
import repos from "../../repos/repos";

const TASK_ID = "2d-node-blend-modes";

export const revideo2dNodeBlendModesEnvironment = new Environment({
  id: `revideo-2d-node-blend-modes`,
  name: `revideo-2d-node-blend-modes`,
  description: `revideo-2d-node-blend-modes`,
  codebase: "Revideo",
  task: `revideo-2d-node-blend-modes`,
  repoPath: repos.revideo.path,

  setupEnvironment: async (container: RepoContainer) => {
    console.log("🔧 Setting up Revideo environment...");

    await container.exec({
      command: "git fetch origin",
      stream: true,
    });

    console.log("📍 Checking out latest base branch...");
    await container.exec({
      command: "git fetch origin 2d-node-blend-modes-base && git checkout 2d-node-blend-modes-base && git pull origin 2d-node-blend-modes-base",
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
        `Removed per-node blend mode support (Node.compositeOperation/globalCompositeOperation) and its tween/override logic. Nodes no longer set canvas composite operations or force caching for non-default modes. Rendering/export change: all content now composites with standard source-over; scenes that used multiply/screen/destination-out (e.g., masking or blend effects) will render without those blends, changing the final video’s look.`
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
      command: "git checkout 2d-node-blend-modes-solution",
      stream: true,
    });

    await container.exec({
      command: "npm install && npx lerna run build --skip-nx-cache",
      stream: true,
    });

    await container.exec({
      command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/mask_destination_out.tsx mask_destination_out_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/blend_multiply_over_image.tsx blend_multiply_over_image_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/tween_composite_operation.tsx tween_composite_operation_baseline.mp4",
      stream: true,
    });

    await container.exec({
      command: "git checkout 2d-node-blend-modes-base",
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
      id: "2d-node-blend-modes-1",
      name: "Validate mask_destination_out",
      description: "Render baseline and solution for mask_destination_out and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/mask_destination_out.tsx mask_destination_out_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/mask_destination_out_baseline.mp4 packages/proximal-testing-videos/output/mask_destination_out_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/mask_destination_out_baseline.mp4 packages/proximal-testing-videos/output/mask_destination_out_solution.mp4"
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
      id: "2d-node-blend-modes-2",
      name: "Validate blend_multiply_over_image",
      description: "Render baseline and solution for blend_multiply_over_image and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/blend_multiply_over_image.tsx blend_multiply_over_image_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/blend_multiply_over_image_baseline.mp4 packages/proximal-testing-videos/output/blend_multiply_over_image_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/blend_multiply_over_image_baseline.mp4 packages/proximal-testing-videos/output/blend_multiply_over_image_solution.mp4"
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
      id: "2d-node-blend-modes-3",
      name: "Validate tween_composite_operation",
      description: "Render baseline and solution for tween_composite_operation and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/tween_composite_operation.tsx tween_composite_operation_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/tween_composite_operation_baseline.mp4 packages/proximal-testing-videos/output/tween_composite_operation_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/tween_composite_operation_baseline.mp4 packages/proximal-testing-videos/output/tween_composite_operation_solution.mp4"
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
    base: "2d-node-blend-modes-base",
    solution: "2d-node-blend-modes-solution",
    diff: "https://github.com/Proximal-Labs/task-demo-revideo/compare/2d-node-blend-modes-base...2d-node-blend-modes-solution",
    testingPr: "https://github.com/Proximal-Environments/revideo-env/pull/31",
    environmentPr: "",
  },
});

export default revideo2dNodeBlendModesEnvironment;