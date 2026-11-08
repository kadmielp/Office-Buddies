import { AgentQueueItem } from "../../shared/agent-events";
import { requestInAppDecision } from "../agent-events";
import { ToolDefinition } from "../remote-ai";
import { callHands, HandsResult } from "./hands-client";

// What the model can do on the PC. Every action goes through buddy-hands,
// which acts by label, reports the changed state and refuses risky labels
// until the user allows them in the balloon.

const appParam = {
  type: "string",
  description:
    "Process name or window title words (e.g. notepad, chrome, Settings), or a window number from list_windows. Omit for the window last looked at.",
};

export const HANDS_TOOLS: ToolDefinition[] = [
  tool("list_windows", "List the open windows (number, process, title).", {}),
  tool(
    "open",
    "Open an app by name (notepad, calc, explorer), a folder, a document, a web address, or a Settings page (ms-settings:nightlight, ms-settings:display, ms-settings:bluetooth...). Waits for its window.",
    { target: { type: "string" } },
    ["target"],
  ),
  tool(
    "see",
    'Read a window: its labelled controls as [id] Role "Label" = value, plus visible text. Use it before acting and whenever unsure.',
    { app: appParam },
  ),
  tool(
    "read",
    "Read the full text of a window (documents, fields, labels), page by page.",
    { app: appParam, offset: { type: "number" } },
  ),
  tool(
    "click",
    "Click a control by its exact label from see, or by [id]. Returns the changed window state.",
    {
      target: {
        type: "string",
        description: 'Label like "Save" or id like "[12]"',
      },
      app: appParam,
      near: {
        type: "string",
        description: "Another label, to pick between duplicates",
      },
      double: { type: "boolean" },
      right: { type: "boolean" },
    },
    ["target"],
  ),
  tool(
    "type",
    "Put text into a field (by label or [id]). Replaces its text unless append is true; submit presses Enter after.",
    {
      field: { type: "string" },
      text: { type: "string" },
      app: appParam,
      submit: { type: "boolean" },
      append: { type: "boolean" },
    },
    ["field", "text"],
  ),
  tool(
    "press",
    'Press a key or shortcut in a window, like "ctrl+s", "enter", "esc", "alt+left".',
    { keys: { type: "string" }, app: appParam },
    ["keys"],
  ),
  tool(
    "show_window",
    "Restore a minimized window without taking focus.",
    { app: { type: "string" } },
    ["app"],
  ),
  tool(
    "ask_user",
    "Ask the user to choose when the request is ambiguous (which file, which window, which meaning). Never guess instead.",
    {
      question: { type: "string" },
      options: {
        type: "array",
        items: { type: "string" },
        minItems: 2,
        maxItems: 6,
      },
    },
    ["question", "options"],
  ),
];

function tool(
  name: string,
  description: string,
  properties: Record<string, unknown>,
  required: string[] = [],
): ToolDefinition {
  return {
    type: "function",
    function: {
      name,
      description,
      parameters: { type: "object", properties, required },
    },
  };
}

export interface ToolContext {
  taskId: string;
  buddyName: string;
  signal?: AbortSignal;
}

export interface ToolOutcome {
  // What the model reads back.
  result: string;
  // One line for the user, such as Clicking "Save".
  step: string;
  // The animation that fits the step.
  animation: string;
}

const MAX_RESULT_CHARS = 6000;

export async function runTool(
  name: string,
  rawArgs: string,
  context: ToolContext,
): Promise<ToolOutcome> {
  let args: Record<string, any> = {};
  try {
    args = rawArgs ? JSON.parse(rawArgs) : {};
  } catch {
    return {
      result: `Invalid arguments for ${name}: send JSON.`,
      step: `Trying ${name}`,
      animation: "Processing",
    };
  }

  const inApp = (a: Record<string, any>) =>
    a.app ? ["in", String(a.app)] : [];

  switch (name) {
    case "list_windows":
      return read(
        await callHands(["windows"]),
        "Looking at open windows",
        "Searching",
      );
    case "open":
      return read(
        await callHands(["open", String(args.target ?? "")]),
        `Opening ${args.target}`,
        "Processing",
      );
    case "see":
      return read(
        await callHands(args.app ? ["see", String(args.app)] : ["see"]),
        `Looking at ${args.app || "the window"}`,
        "Searching",
      );
    case "read":
      return read(
        await callHands([
          "read",
          ...(args.app ? [String(args.app)] : []),
          ...(args.offset ? ["--offset", String(Math.floor(args.offset))] : []),
        ]),
        `Reading ${args.app || "the window"}`,
        "Searching",
      );
    case "show_window":
      return read(
        await callHands(["show", String(args.app ?? "")]),
        `Bringing back ${args.app}`,
        "Processing",
      );
    case "click": {
      const handsArgs = [
        "click",
        String(args.target ?? ""),
        ...(args.near ? ["near", String(args.near)] : []),
        ...(args.double ? ["double"] : []),
        ...(args.right ? ["right"] : []),
        ...inApp(args),
      ];
      return act(handsArgs, `Clicking "${args.target}"`, "Processing", context);
    }
    case "type": {
      const handsArgs = [
        "type",
        String(args.field ?? ""),
        String(args.text ?? ""),
        ...(args.submit ? ["submit"] : []),
        ...(args.append ? ["append"] : []),
        ...inApp(args),
      ];
      return act(handsArgs, `Typing into "${args.field}"`, "Writing", context);
    }
    case "press":
      return act(
        ["press", String(args.keys ?? ""), ...inApp(args)],
        `Pressing ${args.keys}`,
        "Processing",
        context,
      );
    case "ask_user":
      return askUser(args, context);
    default:
      return {
        result: `Unknown tool ${name}.`,
        step: `Trying ${name}`,
        animation: "Processing",
      };
  }
}

function read(r: HandsResult, step: string, animation: string): ToolOutcome {
  return {
    result: clip(r.ok ? r.text || "" : `Error: ${r.error}`),
    step,
    animation,
  };
}

// Actions run once without permission; a risky label comes back refused, the
// user decides in the balloon, and only then does it run for real.
async function act(
  handsArgs: string[],
  step: string,
  animation: string,
  context: ToolContext,
): Promise<ToolOutcome> {
  let r = await callHands(handsArgs);

  if (!r.ok && r.error?.startsWith("RISKY:")) {
    const decision = await askPermission(step, handsArgs, context);

    if (decision !== "allow") {
      return {
        result:
          decision === "deny"
            ? "DENIED: the user said no to this action. It was not done."
            : "NO ANSWER: the user did not answer the Allow card in time. It was not done.",
        step: `${step}: not allowed`,
        animation: "Alert",
      };
    }

    r = await callHands(handsArgs, { allowRisky: true });
  }

  if (!r.ok) {
    return { result: clip(`Error: ${r.error}`), step, animation };
  }

  const changed = r.changed
    ? "The window changed."
    : "Nothing visible changed: check before assuming it worked.";
  return {
    result: clip(`${r.did}. ${changed}\n${r.map ?? ""}`),
    step,
    animation,
  };
}

async function askPermission(
  step: string,
  handsArgs: string[],
  context: ToolContext,
): Promise<"allow" | "deny" | "no answer"> {
  const item: AgentQueueItem = {
    id: `buddy:${context.taskId}`,
    source: "buddy",
    agentLabel: context.buddyName,
    kind: "permission",
    sessionId: context.taskId,
    canOpen: false,
    host: "unknown",
    message: `${context.buddyName} wants to do this on your computer:`,
    permission: {
      toolName: handsArgs[0],
      detail: describeArgs(handsArgs),
      description: step,
    },
    receivedAt: Date.now(),
  };
  const response = await requestInAppDecision(item, context.signal);
  if (!response) return "no answer";
  return response.allow === true ? "allow" : "deny";
}

async function askUser(
  args: Record<string, any>,
  context: ToolContext,
): Promise<ToolOutcome> {
  const question = String(args.question ?? "Which one?");
  const options = (Array.isArray(args.options) ? args.options : [])
    .map(String)
    .filter(Boolean)
    .slice(0, 6);

  if (options.length < 2) {
    return {
      result: "ask_user needs 2-6 options.",
      step: "Asking you",
      animation: "Thinking",
    };
  }

  const response = await requestInAppDecision(
    {
      id: `buddy:${context.taskId}`,
      source: "buddy",
      agentLabel: context.buddyName,
      kind: "question",
      sessionId: context.taskId,
      canOpen: false,
      host: "unknown",
      message: question,
      questions: [
        {
          question,
          multiSelect: false,
          options: options.map((label: string) => ({ label })),
        },
      ],
      receivedAt: Date.now(),
    },
    context.signal,
  );
  const answer = (response?.answers as Record<string, string> | undefined)?.[
    question
  ];

  return {
    result: answer
      ? `The user chose: ${answer}`
      : "The user did not answer. Stop and say what you need.",
    step: `Asking: ${question}`,
    animation: "Thinking",
  };
}

function describeArgs(handsArgs: string[]): string {
  return handsArgs
    .map((a) => (/\s|"/.test(a) ? JSON.stringify(a) : a))
    .join(" ");
}

function clip(text: string): string {
  return text.length > MAX_RESULT_CHARS
    ? `${text.slice(0, MAX_RESULT_CHARS)}\n(cut; use read for more)`
    : text;
}
