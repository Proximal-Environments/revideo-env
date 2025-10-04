import { Environment } from "../../proximal/core/environment";
import { RepoContainer } from "../../proximal/core/container/RepoContainer";
import { TaskRunnerAgent } from "../../proximal/core/agents/TaskRunnerAgent";
import repos from "../../repos/repos";

const TASK_ID = "node-opacity-rendering";

export const revideoNodeOpacityRenderingEnvironment = new Environment({
  id: `revideo-node-opacity-rendering`,
  name: `revideo-node-opacity-rendering`,
  description: `revideo-node-opacity-rendering`,
  codebase: "Revideo",
  task: `revideo-node-opacity-rendering`,
  repoPath: repos.revideo.path,

  setupEnvironment: async (container: RepoContainer) => {
    console.log("🔧 Setting up Revideo environment...");

    await container.exec({
      command: "git fetch origin",
      stream: true,
    });

    console.log("📍 Checking out latest base branch...");
    await container.exec({
      command: "git fetch origin node-opacity-rendering-base && git checkout node-opacity-rendering-base && git pull origin node-opacity-rendering-base",
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
        `Removed support for node opacity affecting rendering. The absoluteOpacity chain and its early-return skip were deleted, opacity is no longer applied to globalAlpha when drawing from cache, and requiresCache no longer checks opacity. When rendering videos, opacity values have no visual effect: nodes (even with opacity 0) render fully opaque, fade/transition transparency is lost, and caching decisions no longer change due to opacity.`
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
      command: "git checkout node-opacity-rendering-solution",
      stream: true,
    });

    await container.exec({
      command: "npm install && npx lerna run build --skip-nx-cache",
      stream: true,
    });

    await container.exec({
      command: "cd packages/proximal-testing-videos && npx tsc",
      stream: true,
    });

    await container.exec({
      command: "git checkout node-opacity-rendering-base",
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

  ],

  prompt: `${environmentPrompt}`,
  branches: {
    base: "node-opacity-rendering-base",
    solution: "node-opacity-rendering-solution",
    diff: "https://github.com/Proximal-Labs/task-demo-revideo/compare/node-opacity-rendering-base...node-opacity-rendering-solution",
    testingPr: "https://github.com/Proximal-Environments/revideo-env/pull/14",
    environmentPr: "",
  },
});

export default revideoNodeOpacityRenderingEnvironment;