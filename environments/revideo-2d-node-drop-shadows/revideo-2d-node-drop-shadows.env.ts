import { Environment } from "../../proximal/core/environment";
import { RepoContainer } from "../../proximal/core/container/RepoContainer";
import { TaskRunnerAgent } from "../../proximal/core/agents/TaskRunnerAgent";
import repos from "../../repos/repos";

const TASK_ID = "2d-node-drop-shadows";

export const revideo2dNodeDropShadowsEnvironment = new Environment({
  id: `revideo-2d-node-drop-shadows`,
  name: `revideo-2d-node-drop-shadows`,
  description: `revideo-2d-node-drop-shadows`,
  codebase: "Revideo",
  task: `revideo-2d-node-drop-shadows`,
  repoPath: repos.revideo.path,

  setupEnvironment: async (container: RepoContainer) => {
    console.log("🔧 Setting up Revideo environment...");

    await container.exec({
      command: "git fetch origin",
      stream: true,
    });

    console.log("📍 Checking out latest base branch...");
    await container.exec({
      command: "git fetch origin 2d-node-drop-shadows-base && git checkout 2d-node-drop-shadows-base && git pull origin 2d-node-drop-shadows-base",
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
        `Removed drop shadow support on 2D nodes (shadowColor, shadowBlur, shadowOffset/XY). Shadow rendering and related cache/bounding-box expansion were deleted. When rendering/exporting frames or videos, nodes will no longer show drop shadows; any shadow properties now have no effect (and may produce type errors in strict builds).`
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
      command: "git checkout 2d-node-drop-shadows-solution",
      stream: true,
    });

    await container.exec({
      command: "npm install && npx lerna run build --skip-nx-cache",
      stream: true,
    });

    await container.exec({
      command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/shadow_rect.tsx shadow_rect_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/shadow_animated.tsx shadow_animated_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/shadow_text_image.tsx shadow_text_image_baseline.mp4",
      stream: true,
    });

    await container.exec({
      command: "git checkout 2d-node-drop-shadows-base",
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
      id: "2d-node-drop-shadows-1",
      name: "Validate shadow_rect",
      description: "Render baseline and solution for shadow_rect and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/shadow_rect.tsx shadow_rect_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/shadow_rect_baseline.mp4 packages/proximal-testing-videos/output/shadow_rect_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/shadow_rect_baseline.mp4 packages/proximal-testing-videos/output/shadow_rect_solution.mp4"
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
      id: "2d-node-drop-shadows-2",
      name: "Validate shadow_animated",
      description: "Render baseline and solution for shadow_animated and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/shadow_animated.tsx shadow_animated_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/shadow_animated_baseline.mp4 packages/proximal-testing-videos/output/shadow_animated_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/shadow_animated_baseline.mp4 packages/proximal-testing-videos/output/shadow_animated_solution.mp4"
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
      id: "2d-node-drop-shadows-3",
      name: "Validate shadow_text_image",
      description: "Render baseline and solution for shadow_text_image and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/shadow_text_image.tsx shadow_text_image_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/shadow_text_image_baseline.mp4 packages/proximal-testing-videos/output/shadow_text_image_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/shadow_text_image_baseline.mp4 packages/proximal-testing-videos/output/shadow_text_image_solution.mp4"
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
    base: "testing-branch-session-mgd5w8xe-2a433b3b-env-2d-node-drop-shadows",
    solution: "testing-branch-session-mgd5w8xe-2a433b3b-env-2d-node-drop-shadows-solution",
    diff: "https://github.com/Proximal-Labs/task-demo-revideo/compare/testing-branch-session-mgd5w8xe-2a433b3b-env-2d-node-drop-shadows...testing-branch-session-mgd5w8xe-2a433b3b-env-2d-node-drop-shadows-solution",
    testingPr: "",
    environmentPr: "",
  },
});

export default revideo2dNodeDropShadowsEnvironment;