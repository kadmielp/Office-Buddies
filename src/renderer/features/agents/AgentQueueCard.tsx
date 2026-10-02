import { useState } from "react";

import {
  AgentQuestionAnswers,
  AgentQueueItem,
} from "../../../shared/agent-events";
import { clippyApi } from "../../clippyApi";
import { Checkbox } from "../../ui/Checkbox";

export type AgentQueueCardProps = {
  item: AgentQueueItem;
  position: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
};

// One agent request at a time, shown in the buddy's speech balloon.
export const AgentQueueCard: React.FC<AgentQueueCardProps> = (props) => {
  if (props.item.kind === "question" && props.item.questions?.length) {
    // Keyed so a new question starts with a clean set of answers.
    return (
      <AgentQuestionCard
        key={`${props.item.id}:${props.item.receivedAt}`}
        {...props}
      />
    );
  }

  if (props.item.kind === "permission" && props.item.permission) {
    return <AgentPermissionCard {...props} />;
  }

  return <AgentNoticeCard {...props} />;
};

const AgentNoticeCard: React.FC<AgentQueueCardProps> = ({
  item,
  position,
  total,
  onPrevious,
  onNext,
}) => {
  const title = item.kind === "finished" ? "Finished" : "Needs your input";

  return (
    <div className="buddy-speech app-no-drag" aria-live="polite">
      <div className="buddy-speech-content buddy-agent-card">
        <div className="buddy-agent-card-header">
          <span
            className={`buddy-agent-card-kind is-${item.kind.replace("_", "-")}`}
          >
            {title}
          </span>
          <AgentSourceLabel item={item} />
        </div>
        <p className="buddy-agent-card-message">{item.message}</p>
      </div>
      <div className="buddy-agent-card-actions">
        <QueuePager
          position={position}
          total={total}
          onPrevious={onPrevious}
          onNext={onNext}
        />
        <div className="buddy-agent-card-buttons">
          {item.canOpen && (
            <button onClick={() => clippyApi.openAgentQueueItem(item.id)}>
              Open
            </button>
          )}
          <button onClick={() => clippyApi.dismissAgentQueueItem(item.id)}>
            Dismiss
          </button>
        </div>
      </div>
      <div className="buddy-speech-tail" />
    </div>
  );
};

// Classic Office Assistant style: the question, then clickable bullets.
const AgentQuestionCard: React.FC<AgentQueueCardProps> = ({
  item,
  position,
  total,
  onPrevious,
  onNext,
}) => {
  const questions = item.questions ?? [];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AgentQuestionAnswers>({});
  const [checked, setChecked] = useState<string[]>([]);
  const current = questions[Math.min(step, questions.length - 1)];

  const submit = (answer: string) => {
    const nextAnswers = { ...answers, [current.question]: answer };

    if (step + 1 < questions.length) {
      setAnswers(nextAnswers);
      setChecked([]);
      setStep(step + 1);
      return;
    }

    clippyApi.answerAgentQuestion(item.id, nextAnswers);
  };

  const toggle = (label: string, isChecked: boolean) => {
    setChecked((previous) =>
      isChecked
        ? [...previous, label]
        : previous.filter((value) => value !== label),
    );
  };

  return (
    <div
      className="buddy-speech buddy-agent-question app-no-drag"
      aria-live="polite"
    >
      <div className="buddy-speech-content buddy-agent-card">
        <div className="buddy-agent-card-header">
          <AgentSourceLabel item={item} />
          {questions.length > 1 && (
            <span className="buddy-agent-card-source">
              · Question {step + 1} of {questions.length}
            </span>
          )}
        </div>
        <p className="buddy-agent-question-text">{current.question}</p>
      </div>
      <div className="buddy-speech-options buddy-agent-question-options">
        {current.multiSelect ? (
          <>
            {current.options.map((option, index) => (
              <div
                key={option.label}
                className="buddy-agent-question-check"
                title={option.description}
              >
                <Checkbox
                  id={`agent-question-${step}-${index}`}
                  label={option.label}
                  checked={checked.includes(option.label)}
                  onChange={(isChecked) => toggle(option.label, isChecked)}
                />
              </div>
            ))}
            <button
              className="buddy-speech-option"
              disabled={checked.length === 0}
              onClick={() =>
                // Keep the order the options were offered in.
                submit(
                  current.options
                    .map((option) => option.label)
                    .filter((label) => checked.includes(label))
                    .join(", "),
                )
              }
            >
              <span className="buddy-speech-option-dot" />
              OK
            </button>
          </>
        ) : (
          current.options.map((option) => (
            <button
              key={option.label}
              className="buddy-speech-option"
              title={option.description}
              onClick={() => submit(option.label)}
            >
              <span className="buddy-speech-option-dot" />
              {option.label}
            </button>
          ))
        )}
        <HandoffOption item={item} />
      </div>
      {total > 1 && (
        <div className="buddy-agent-card-actions">
          <QueuePager
            position={position}
            total={total}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </div>
      )}
      <div className="buddy-speech-tail" />
    </div>
  );
};

// Allow or deny a tool the agent wants to run, Office Assistant style.
const AgentPermissionCard: React.FC<AgentQueueCardProps> = ({
  item,
  position,
  total,
  onPrevious,
  onNext,
}) => {
  const permission = item.permission!;

  return (
    <div
      className="buddy-speech buddy-agent-question app-no-drag"
      aria-live="polite"
    >
      <div className="buddy-speech-content buddy-agent-card">
        <div className="buddy-agent-card-header">
          <AgentSourceLabel item={item} />
        </div>
        <p className="buddy-agent-question-text">{item.message}</p>
        {permission.description && (
          <p className="buddy-agent-permission-description">
            {permission.description}
          </p>
        )}
        {permission.detail && (
          <pre className="buddy-agent-permission-detail">
            {permission.detail}
          </pre>
        )}
      </div>
      <div className="buddy-speech-options buddy-agent-question-options">
        <button
          className="buddy-speech-option"
          onClick={() => clippyApi.decideAgentPermission(item.id, true)}
        >
          <span className="buddy-speech-option-dot" />
          Allow
        </button>
        <button
          className="buddy-speech-option"
          onClick={() => clippyApi.decideAgentPermission(item.id, false)}
        >
          <span className="buddy-speech-option-dot" />
          Deny
        </button>
        <HandoffOption item={item} />
      </div>
      {total > 1 && (
        <div className="buddy-agent-card-actions">
          <QueuePager
            position={position}
            total={total}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </div>
      )}
      <div className="buddy-speech-tail" />
    </div>
  );
};

// Hands the request back to the agent's own window and opens it when possible.
const HandoffOption: React.FC<{ item: AgentQueueItem }> = ({ item }) => (
  <button
    className="buddy-speech-option buddy-agent-question-handoff"
    title="Close this balloon and answer in the agent's own window"
    onClick={() => clippyApi.handOffAgentQueueItem(item.id)}
  >
    <span className="buddy-speech-option-dot" />
    Answer in {item.agentLabel} instead
  </button>
);

const AgentSourceLabel: React.FC<{ item: AgentQueueItem }> = ({ item }) => {
  const folderName = item.cwd?.split(/[\\/]/).filter(Boolean).pop();

  return (
    <span className="buddy-agent-card-source">
      {item.agentLabel}
      {folderName ? ` · ${folderName}` : ""}
    </span>
  );
};

const QueuePager: React.FC<{
  position: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}> = ({ position, total, onPrevious, onNext }) => {
  if (total <= 1) {
    return null;
  }

  return (
    <div className="buddy-agent-card-pager">
      <button
        aria-label="Previous request"
        onClick={onPrevious}
        disabled={position <= 1}
      >
        ‹
      </button>
      <span>
        {position} of {total}
      </span>
      <button
        aria-label="Next request"
        onClick={onNext}
        disabled={position >= total}
      >
        ›
      </button>
    </div>
  );
};
