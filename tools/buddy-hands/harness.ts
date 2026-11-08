// Headless check of the computer-use loop: real main-process code, real
// helper, the configured provider, no windows. Development only.
//
//   npx esbuild tools/buddy-hands/harness.ts --bundle --platform=node --external:electron --outfile=.harness.cjs
//   set OFFICE_BUDDIES_USER_DATA=<profile> && npx electron .harness.cjs "open calculator and work out 7 times 6"
//
// HARNESS_DECIDE=allow|deny answers Allow cards; question cards get the first option.
import { app } from "electron";

import { runHandsTask } from "../../src/main/computer-use/loop";
import {
  answerAgentQuestion,
  decideAgentPermission,
  getAgentQueue,
} from "../../src/main/agent-events";
import { getStateManager } from "../../src/main/state";
import { stopLocalLlm } from "../../src/main/local-llm";

if (process.env.OFFICE_BUDDIES_USER_DATA) {
  app.setPath("userData", process.env.OFFICE_BUDDIES_USER_DATA);
}

app.whenReady().then(async () => {
  const task = process.argv[process.argv.length - 1];
  const settings = getStateManager().getSettings();
  const started = Date.now();
  const decide = process.env.HARNESS_DECIDE || "allow";

  const answering = setInterval(() => {
    for (const item of getAgentQueue()) {
      if (item.source !== "buddy") continue;
      if (item.kind === "permission") {
        console.log(`\n[ALLOW CARD] ${item.permission?.detail} -> ${decide}`);
        decideAgentPermission(item.id, decide === "allow");
      } else if (item.kind === "question" && item.questions?.[0]) {
        const q = item.questions[0];
        console.log(`\n[QUESTION] ${q.question} -> ${q.options[0].label}`);
        answerAgentQuestion(item.id, { [q.question]: q.options[0].label });
      }
    }
  }, 500);

  console.log(`Task: ${task}\nProvider: ${settings.aiProvider} ${settings.selectedModel || settings.remoteModel}\n`);
  try {
    for await (const chunk of runHandsTask({
      provider: (settings.aiProvider || "local") as any,
      settings,
      systemPrompt: `You are ${settings.selectedAgent || "Clippy"}, a helpful local desktop assistant.`,
      history: [
        { id: "1", sender: "user", content: task, createdAt: Date.now() },
      ],
    })) {
      process.stdout.write(chunk);
    }
  } catch (error) {
    console.error("\nFAILED:", error);
  }
  console.log(`\n\n(${((Date.now() - started) / 1000).toFixed(1)} s)`);
  clearInterval(answering);
  await stopLocalLlm();
  app.exit(0);
});
