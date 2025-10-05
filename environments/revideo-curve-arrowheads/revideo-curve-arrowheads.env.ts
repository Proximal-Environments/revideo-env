import { Environment } from "../../proximal/core/environment";
import { RepoContainer } from "../../proximal/core/container/RepoContainer";
import { TaskRunnerAgent } from "../../proximal/core/agents/TaskRunnerAgent";
import repos from "../../repos/repos";

const TASK_ID = "curve-arrowheads";

export const revideoCurveArrowheadsEnvironment = new Environment({
  id: `revideo-curve-arrowheads`,
  name: `revideo-curve-arrowheads`,
  description: `revideo-curve-arrowheads`,
  codebase: "Revideo",
  task: `revideo-curve-arrowheads`,
  repoPath: repos.revideo.path,

  setupEnvironment: async (container: RepoContainer) => {
    console.log("🔧 Setting up Revideo environment...");

    await container.exec({
      command: "git fetch origin",
      stream: true,
    });

    console.log("📍 Checking out latest base branch...");
    await container.exec({
      command: "git fetch origin curve-arrowheads-base && git checkout curve-arrowheads-base && git pull origin curve-arrowheads-base",
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
        `Removed support for start/end arrowheads on 2D curves. The engine no longer computes arrow size, adjusts curve endpoints, expands the bounding box, or draws arrowheads—startArrow/endArrow are effectively ignored. When rendering videos, curves that previously displayed arrow tips will now render without any arrowheads.`
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
      command: "git checkout curve-arrowheads-solution",
      stream: true,
    });

    await container.exec({
      command: "npm install && npx lerna run build --skip-nx-cache",
      stream: true,
    });

    await container.exec({
      command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/curve_arrows_end_only.tsx curve_arrows_end_only_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/curve_arrows_both_size.tsx curve_arrows_both_size_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/curve_arrows_ray.tsx curve_arrows_ray_baseline.mp4",
      stream: true,
    });

    await container.exec({
      command: "git checkout curve-arrowheads-base",
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
      id: "curve-arrowheads-1",
      name: "Validate curve_arrows_end_only",
      description: "Render baseline and solution for curve_arrows_end_only and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/curve_arrows_end_only.tsx curve_arrows_end_only_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/curve_arrows_end_only_baseline.mp4 packages/proximal-testing-videos/output/curve_arrows_end_only_solution.mp4"
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
      id: "curve-arrowheads-2",
      name: "Validate curve_arrows_both_size",
      description: "Render baseline and solution for curve_arrows_both_size and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/curve_arrows_both_size.tsx curve_arrows_both_size_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/curve_arrows_both_size_baseline.mp4 packages/proximal-testing-videos/output/curve_arrows_both_size_solution.mp4"
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
      id: "curve-arrowheads-3",
      name: "Validate curve_arrows_ray",
      description: "Render baseline and solution for curve_arrows_ray and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/curve_arrows_ray.tsx curve_arrows_ray_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_equivalence.sh packages/proximal-testing-videos/output/curve_arrows_ray_baseline.mp4 packages/proximal-testing-videos/output/curve_arrows_ray_solution.mp4"
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
    base: "testing-branch-session-mgd5w8xe-2a433b3b-env-curve-arrowheads",
    solution: "testing-branch-session-mgd5w8xe-2a433b3b-env-curve-arrowheads-solution",
    diff: "https://github.com/Proximal-Labs/task-demo-revideo/compare/testing-branch-session-mgd5w8xe-2a433b3b-env-curve-arrowheads...testing-branch-session-mgd5w8xe-2a433b3b-env-curve-arrowheads-solution",
    testingPr: "https://github.com/Proximal-Environments/revideo-env/pull/24",
    environmentPr: "",
  },
});

export default revideoCurveArrowheadsEnvironment;