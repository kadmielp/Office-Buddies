import { useState } from "react";
import Markdown from "react-markdown";

// A computer-use reply streams its steps as "*▸ step*" lines before the
// answer. Show one step at a time (the current one) while the buddy works,
// a one-line summary once it is done, and the full list on click.

const STEP_LINE = /^\*▸ (.+)\*$/;

export function splitSteps(content: string): {
  steps: string[];
  answer: string;
} {
  const steps: string[] = [];
  const lines = content.split("\n");
  let index = 0;

  for (; index < lines.length; index++) {
    const line = lines[index].trim();
    if (!line) continue;
    const match = line.match(STEP_LINE);
    if (!match) break;
    steps.push(match[1].replace(/\\([*_`[\]])/g, "$1"));
  }

  return { steps, answer: lines.slice(index).join("\n").trim() };
}

const markdownComponents = {
  a: ({ node: _node, ...props }: any) => (
    <a target="_blank" rel="noopener noreferrer" {...props} />
  ),
};

export function ReplyContent({
  content,
  live = false,
}: {
  content: string;
  // Still streaming: the last step is the one in progress.
  live?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const { steps, answer } = splitSteps(content);

  if (steps.length === 0) {
    return <Markdown components={markdownComponents}>{content}</Markdown>;
  }

  const working = live && !answer;
  const summary = working
    ? steps[steps.length - 1]
    : `${steps.length} step${steps.length === 1 ? "" : "s"}`;

  return (
    <>
      <div className={`reply-steps${working ? " is-working" : ""}`}>
        <button
          type="button"
          className="reply-steps-toggle"
          aria-expanded={expanded}
          title={expanded ? "Hide steps" : "Show all steps"}
          onClick={() => setExpanded((value) => !value)}
        >
          <span className="reply-steps-chevron" aria-hidden="true">
            {expanded ? "▾" : "▸"}
          </span>
          <span className="reply-steps-summary">
            {working ? summary : `✓ ${summary}`}
          </span>
          {working && <span className="reply-steps-dots" aria-hidden="true" />}
          {working && steps.length > 1 && (
            <span className="reply-steps-count"> · step {steps.length}</span>
          )}
        </button>
        {expanded && (
          <ol className="reply-steps-list">
            {steps.map((step, index) => (
              <li
                key={index}
                className={
                  working && index === steps.length - 1 ? "is-current" : ""
                }
              >
                {step}
              </li>
            ))}
          </ol>
        )}
      </div>
      {answer && <Markdown components={markdownComponents}>{answer}</Markdown>}
    </>
  );
}
