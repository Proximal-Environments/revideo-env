import { Environment } from "../../proximal/core/environment";
import { RepoContainer } from "../../proximal/core/container/RepoContainer";
import { TaskRunnerAgent } from "../../proximal/core/agents/TaskRunnerAgent";
import repos from "../../repos/repos";

const TASK_ID = "txt-style-inheritance";

export const revideoTxtStyleInheritanceEnvironment = new Environment({
  id: `revideo-txt-style-inheritance`,
  name: `revideo-txt-style-inheritance`,
  description: `revideo-txt-style-inheritance`,
  codebase: "Revideo",
  task: `revideo-txt-style-inheritance`,
  repoPath: repos.revideo.path,

  setupEnvironment: async (container: RepoContainer) => {
    console.log("🔧 Setting up Revideo environment...");

    await container.exec({
      command: "git fetch origin",
      stream: true,
    });

    console.log("📍 Checking out latest base branch...");
    await container.exec({
      command: "git fetch origin txt-style-inheritance-base && git checkout txt-style-inheritance-base && git pull origin txt-style-inheritance-base",
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
        `Removed automatic inheritance of text drawing styles from parent Txt to TxtLeaf. Previously, child text nodes would adopt the parent Txt’s fill, stroke, lineWidth, strokeFirst, lineCap, lineJoin, lineDash, and lineDashOffset via prototype getters; now each TxtLeaf uses its own initial/default values unless set directly. Rendering change: any text that relied on parent-applied styles may now render with defaults (e.g., default fill, no stroke), leading to visible differences in color and stroke in rendered videos.`
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
      command: "git checkout txt-style-inheritance-solution",
      stream: true,
    });

    await container.exec({
      command: "npm install && npx lerna run build --skip-nx-cache",
      stream: true,
    });

    await container.exec({
      command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/txt_inheritance_basic_fill_stroke.tsx txt_inheritance_basic_fill_stroke_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/txt_inheritance_all_styles.tsx txt_inheritance_all_styles_baseline.mp4",
      stream: true,
    });

    await container.exec({
      command: "git checkout txt-style-inheritance-base",
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
      id: "txt-style-inheritance-1",
      name: "Validate txt_inheritance_basic_fill_stroke",
      description: "Render baseline and solution for txt_inheritance_basic_fill_stroke and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/txt_inheritance_basic_fill_stroke.tsx txt_inheritance_basic_fill_stroke_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/txt_inheritance_basic_fill_stroke_baseline.mp4 packages/proximal-testing-videos/output/txt_inheritance_basic_fill_stroke_solution.mp4"
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
      id: "txt-style-inheritance-2",
      name: "Validate txt_inheritance_all_styles",
      description: "Render baseline and solution for txt_inheritance_all_styles and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/txt_inheritance_all_styles.tsx txt_inheritance_all_styles_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/txt_inheritance_all_styles_baseline.mp4 packages/proximal-testing-videos/output/txt_inheritance_all_styles_solution.mp4"
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
    base: "txt-style-inheritance-base",
    solution: "txt-style-inheritance-solution",
    diff: "https://github.com/Proximal-Labs/task-demo-revideo/compare/txt-style-inheritance-base...txt-style-inheritance-solution",
    testingPr: "https://github.com/Proximal-Environments/revideo-env/pull/12",
    environmentPr: "",
  },
});

export default revideoTxtStyleInheritanceEnvironment;