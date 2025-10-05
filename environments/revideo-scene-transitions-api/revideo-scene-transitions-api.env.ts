import { Environment } from "../../proximal/core/environment";
import { RepoContainer } from "../../proximal/core/container/RepoContainer";
import { TaskRunnerAgent } from "../../proximal/core/agents/TaskRunnerAgent";
import repos from "../../repos/repos";

const TASK_ID = "scene-transitions-api";

export const revideoSceneTransitionsApiEnvironment = new Environment({
  id: `revideo-scene-transitions-api`,
  name: `revideo-scene-transitions-api`,
  description: `revideo-scene-transitions-api`,
  codebase: "Revideo",
  task: `revideo-scene-transitions-api`,
  repoPath: repos.revideo.path,

  setupEnvironment: async (container: RepoContainer) => {
    console.log("🔧 Setting up Revideo environment...");

    await container.exec({
      command: "git fetch origin",
      stream: true,
    });

    console.log("📍 Checking out latest base branch...");
    await container.exec({
      command: "git fetch origin scene-transitions-api-base && git checkout scene-transitions-api-base && git pull origin scene-transitions-api-base",
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
        `Previously provided built-in scene transitions (fade, slide, zoom-in/out) via helpers like fadeTransition, slideTransition, zoomInTransition, zoomOutTransition, and the underlying useTransition hook that applied alpha/transform to previous and current scenes. These APIs have been removed. When rendering videos, scene changes are now hard cuts with no blending or motion, and any existing imports of these helpers will fail.`
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
      command: "git checkout scene-transitions-api-solution",
      stream: true,
    });

    await container.exec({
      command: "npm install && npx lerna run build --skip-nx-cache",
      stream: true,
    });

    await container.exec({
      command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/fade_transition_demo.tsx fade_transition_demo_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/fade_hardcut_demo.tsx fade_hardcut_demo_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/slide_transition_demo.tsx slide_transition_demo_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/slide_hardcut_demo.tsx slide_hardcut_demo_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/zoom_in_transition_demo.tsx zoom_in_transition_demo_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/zoom_in_hardcut_demo.tsx zoom_in_hardcut_demo_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/zoom_out_transition_demo.tsx zoom_out_transition_demo_baseline.mp4 && node dist/render.js ./packages/proximal-testing-videos/src/zoom_out_hardcut_demo.tsx zoom_out_hardcut_demo_baseline.mp4",
      stream: true,
    });

    await container.exec({
      command: "git checkout scene-transitions-api-base",
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
      id: "scene-transitions-api-1",
      name: "Validate fade_transition_demo",
      description: "Render baseline and solution for fade_transition_demo and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/fade_transition_demo.tsx fade_transition_demo_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_difference.sh packages/proximal-testing-videos/output/fade_transition_demo_baseline.mp4 packages/proximal-testing-videos/output/fade_transition_demo_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/fade_transition_demo_baseline.mp4 packages/proximal-testing-videos/output/fade_transition_demo_solution.mp4"
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
      id: "scene-transitions-api-2",
      name: "Validate fade_hardcut_demo",
      description: "Render baseline and solution for fade_hardcut_demo and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/fade_hardcut_demo.tsx fade_hardcut_demo_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_difference.sh packages/proximal-testing-videos/output/fade_hardcut_demo_baseline.mp4 packages/proximal-testing-videos/output/fade_hardcut_demo_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/fade_hardcut_demo_baseline.mp4 packages/proximal-testing-videos/output/fade_hardcut_demo_solution.mp4"
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
      id: "scene-transitions-api-3",
      name: "Validate slide_transition_demo",
      description: "Render baseline and solution for slide_transition_demo and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/slide_transition_demo.tsx slide_transition_demo_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_difference.sh packages/proximal-testing-videos/output/slide_transition_demo_baseline.mp4 packages/proximal-testing-videos/output/slide_transition_demo_solution.mp4",
            "bash packages-proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/slide_transition_demo_baseline.mp4 packages/proximal-testing-videos/output/slide_transition_demo_solution.mp4"
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
      id: "scene-transitions-api-4",
      name: "Validate slide_hardcut_demo",
      description: "Render baseline and solution for slide_hardcut_demo and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/slide_hardcut_demo.tsx slide_hardcut_demo_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_difference.sh packages/proximal-testing-videos/output/slide_hardcut_demo_baseline.mp4 packages/proximal-testing-videos/output/slide_hardcut_demo_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/slide_hardcut_demo_baseline.mp4 packages/proximal-testing-videos/output/slide_hardcut_demo_solution.mp4"
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
      id: "scene-transitions-api-5",
      name: "Validate zoom_in_transition_demo",
      description: "Render baseline and solution for zoom_in_transition_demo and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/zoom_in_transition_demo.tsx zoom_in_transition_demo_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_difference.sh packages/proximal-testing-videos/output/zoom_in_transition_demo_baseline.mp4 packages/proximal-testing-videos/output/zoom_in_transition_demo_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/zoom_in_transition_demo_baseline.mp4 packages/proximal-testing-videos/output/zoom_in_transition_demo_solution.mp4"
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
      id: "scene-transitions-api-6",
      name: "Validate zoom_in_hardcut_demo",
      description: "Render baseline and solution for zoom_in_hardcut_demo and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/zoom_in_hardcut_demo.tsx zoom_in_hardcut_demo_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_difference.sh packages/proximal-testing-videos/output/zoom_in_hardcut_demo_baseline.mp4 packages/proximal-testing-videos/output/zoom_in_hardcut_demo_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/zoom_in_hardcut_demo_baseline.mp4 packages/proximal-testing-videos/output/zoom_in_hardcut_demo_solution.mp4"
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
      id: "scene-transitions-api-7",
      name: "Validate zoom_out_transition_demo",
      description: "Render baseline and solution for zoom_out_transition_demo and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/zoom_out_transition_demo.tsx zoom_out_transition_demo_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_difference.sh packages/proximal-testing-videos/output/zoom_out_transition_demo_baseline.mp4 packages/proximal-testing-videos/output/zoom_out_transition_demo_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/zoom_out_transition_demo_baseline.mp4 packages/proximal-testing-videos/output/zoom_out_transition_demo_solution.mp4"
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
      id: "scene-transitions-api-8",
      name: "Validate zoom_out_hardcut_demo",
      description: "Render baseline and solution for zoom_out_hardcut_demo and compare outputs.",
      test: async (container: RepoContainer) => {
        try {
          const renderResult = await container.exec({
            command: "cd packages/proximal-testing-videos && npx tsc && node dist/render.js ./packages/proximal-testing-videos/src/zoom_out_hardcut_demo.tsx zoom_out_hardcut_demo_solution.mp4",
            throwOnError: false,
            stream: true,
          });

          const renderExit = typeof renderResult === "string" ? 0 : renderResult.exitCode;
          if (renderExit !== 0) {
            return false;
          }

          const commands = [
            "bash packages/proximal-testing-videos/testing_scripts/test_visual_difference.sh packages/proximal-testing-videos/output/zoom_out_hardcut_demo_baseline.mp4 packages/proximal-testing-videos/output/zoom_out_hardcut_demo_solution.mp4",
            "bash packages/proximal-testing-videos/testing_scripts/test_video_length_similar.sh packages/proximal-testing-videos/output/zoom_out_hardcut_demo_baseline.mp4 packages/proximal-testing-videos/output/zoom_out_hardcut_demo_solution.mp4"
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
    base: "scene-transitions-api-base",
    solution: "scene-transitions-api-solution",
    diff: "https://github.com/Proximal-Labs/task-demo-revideo/compare/scene-transitions-api-base...scene-transitions-api-solution",
    testingPr: "https://github.com/Proximal-Environments/revideo-env/pull/19",
    environmentPr: "",
  },
});

export default revideoSceneTransitionsApiEnvironment;