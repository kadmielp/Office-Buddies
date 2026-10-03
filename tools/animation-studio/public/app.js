const state = {
  agents: [],
  currentAgent: null,
  payload: null,
  selectedAnimation: null,
  selectedFrameIndex: -1,
  selectedFrameIndices: [],
  selectedCell: null,
  mapImage: null,
  mapZoom: 1,
  soundCache: new Map(),
  currentAudio: null,
  activeTab: "frames",
  previewTimer: null,
  previewFrameIndex: 0,
  previewStartFrameIndex: 0,
  selectedLibrarySoundId: "",
  historyStack: [],
  redoStack: [],
  copiedFrames: [],
  copiedMeta: null,
  lastSavedDefinitionJson: null,
  previewSoundEnabled: false,
  previewScenarioIndex: null,
  sequenceCaptureEnabled: false,
};

const elements = {
  agentSelect: document.getElementById("agentSelect"),
  loadAgentBtn: document.getElementById("loadAgentBtn"),
  saveBtn: document.getElementById("saveBtn"),
  undoBtn: document.getElementById("undoBtn"),
  redoBtn: document.getElementById("redoBtn"),
  statusText: document.getElementById("statusText"),
  animationPreviewCanvas: document.getElementById("animationPreviewCanvas"),
  toggleAnimationPlayBtn: document.getElementById("toggleAnimationPlayBtn"),
  togglePreviewSoundBtn: document.getElementById("togglePreviewSoundBtn"),
  previewFrameText: document.getElementById("previewFrameText"),
  framePreviewCanvas: document.getElementById("framePreviewCanvas"),
  framePreviewText: document.getElementById("framePreviewText"),
  framesTabBtn: document.getElementById("framesTabBtn"),
  soundsTabBtn: document.getElementById("soundsTabBtn"),
  framesTabContent: document.getElementById("framesTabContent"),
  soundsTabContent: document.getElementById("soundsTabContent"),
  animationSearch: document.getElementById("animationSearch"),
  animationList: document.getElementById("animationList"),
  newAnimationBtn: document.getElementById("newAnimationBtn"),
  renameAnimationBtn: document.getElementById("renameAnimationBtn"),
  duplicateAnimationBtn: document.getElementById("duplicateAnimationBtn"),
  deleteAnimationBtn: document.getElementById("deleteAnimationBtn"),
  mapMeta: document.getElementById("mapMeta"),
  selectedCell: document.getElementById("selectedCell"),
  zoomOutBtn: document.getElementById("zoomOutBtn"),
  zoomResetBtn: document.getElementById("zoomResetBtn"),
  zoomInBtn: document.getElementById("zoomInBtn"),
  zoomLabel: document.getElementById("zoomLabel"),
  sequenceCaptureBtn: document.getElementById("sequenceCaptureBtn"),
  mapCanvas: document.getElementById("mapCanvas"),
  appendFrameBtn: document.getElementById("appendFrameBtn"),
  replaceImageBtn: document.getElementById("replaceImageBtn"),
  previewSoundBtn: document.getElementById("previewSoundBtn"),
  soundButtonGrid: document.getElementById("soundButtonGrid"),
  stopLibrarySoundBtn: document.getElementById("stopLibrarySoundBtn"),
  useLibrarySoundBtn: document.getElementById("useLibrarySoundBtn"),
  selectedLibrarySoundText: document.getElementById("selectedLibrarySoundText"),
  frameList: document.getElementById("frameList"),
  durationInput: document.getElementById("durationInput"),
  soundSelect: document.getElementById("soundSelect"),
  playFrameSoundBtn: document.getElementById("playFrameSoundBtn"),
  outcomesTable: document.getElementById("outcomesTable"),
  outcomesSummary: document.getElementById("outcomesSummary"),
  addBranchBtn: document.getElementById("addBranchBtn"),
  scenariosTabBtn: document.getElementById("scenariosTabBtn"),
  scenariosTabContent: document.getElementById("scenariosTabContent"),
  scenariosHeader: document.getElementById("scenariosHeader"),
  scenariosWarnings: document.getElementById("scenariosWarnings"),
  scenariosList: document.getElementById("scenariosList"),
  playRandomBtn: document.getElementById("playRandomBtn"),
  prevScenarioBtn: document.getElementById("prevScenarioBtn"),
  nextScenarioBtn: document.getElementById("nextScenarioBtn"),
  scenarioPositionText: document.getElementById("scenarioPositionText"),
  scenarioPathText: document.getElementById("scenarioPathText"),
  imagesInput: document.getElementById("imagesInput"),
  addFrameBtn: document.getElementById("addFrameBtn"),
  duplicateFrameBtn: document.getElementById("duplicateFrameBtn"),
  removeFrameBtn: document.getElementById("removeFrameBtn"),
  moveUpBtn: document.getElementById("moveUpBtn"),
  moveDownBtn: document.getElementById("moveDownBtn"),
  selectAllFramesBtn: document.getElementById("selectAllFramesBtn"),
  invertFramesBtn: document.getElementById("invertFramesBtn"),
  clearBranchFieldsBtn: document.getElementById("clearBranchFieldsBtn"),
};

const mapCtx = elements.mapCanvas.getContext("2d");
const previewCtx = elements.animationPreviewCanvas.getContext("2d");
const framePreviewCtx = elements.framePreviewCanvas.getContext("2d");

function setStatus(text) {
  elements.statusText.textContent = text;
}

function setEditorTab(tab) {
  state.activeTab = tab;
  const tabs = {
    frames: [elements.framesTabBtn, elements.framesTabContent],
    sounds: [elements.soundsTabBtn, elements.soundsTabContent],
    scenarios: [elements.scenariosTabBtn, elements.scenariosTabContent],
  };

  for (const [name, [button, content]] of Object.entries(tabs)) {
    const active = name === tab;
    button.setAttribute("aria-selected", active ? "true" : "false");
    content.classList.toggle("active-tab", active);
  }

  if (tab === "scenarios") {
    renderScenarios();
  }
}

function updatePreviewSoundToggle() {
  const enabled = state.previewSoundEnabled;
  elements.togglePreviewSoundBtn.textContent = enabled
    ? "Sound: On"
    : "Sound: Off";
  elements.togglePreviewSoundBtn.title = enabled
    ? "Preview sound on"
    : "Preview sound off";
}

function updatePreviewPlayToggle() {
  const isPlaying = Boolean(state.previewTimer);
  elements.toggleAnimationPlayBtn.textContent = isPlaying ? "Stop" : "Play";
  elements.toggleAnimationPlayBtn.title = isPlaying
    ? "Stop preview"
    : "Play preview";
}

function updateSequenceCaptureToggle() {
  const enabled = state.sequenceCaptureEnabled;
  elements.sequenceCaptureBtn.textContent = enabled
    ? "Seq Add: On"
    : "Seq Add: Off";
  elements.sequenceCaptureBtn.title = enabled
    ? "Click map cells to append frames in order"
    : "Enable to append frames while clicking map cells";
}

function updateSelectAllFramesToggle() {
  const frames = getCurrentFrames();
  const selectedCount = new Set(
    (state.selectedFrameIndices || []).filter(
      (i) => Number.isInteger(i) && i >= 0 && i < frames.length,
    ),
  ).size;
  const allSelected = frames.length > 0 && selectedCount === frames.length;
  elements.selectAllFramesBtn.textContent = allSelected
    ? "❖ Deselect all"
    : "❖ Select All";
}

async function fetchJson(endpoint, options) {
  const response = await fetch(endpoint, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

function getAnimationsObject() {
  return state.payload?.definition?.animations || {};
}

function getCurrentAnimation() {
  if (!state.selectedAnimation) {
    return null;
  }
  return getAnimationsObject()[state.selectedAnimation] || null;
}

function getCurrentFrames() {
  const animation = getCurrentAnimation();
  if (!animation) {
    return [];
  }
  if (!Array.isArray(animation.frames)) {
    animation.frames = [];
  }
  return animation.frames;
}

const END = -1;
const MAX_SCENARIOS = 200;
const HOLD_LIMIT_PLAYS = 1000;

function frameDurationMs(frame) {
  const duration = Number(frame?.duration);
  return Number.isFinite(duration) && duration > 0 ? duration : 100;
}

// Everything that can happen after `frameIndex`, mirroring the runtime
// (getNextFrameIndex in Clippy.tsx): branches roll in order against a
// cumulative weight; whatever is left over (100 - sum) takes exitBranch,
// or falls through to the next frame. A target outside the animation ends it.
function computeFrameOutcomes(frameIndex, frames = getCurrentFrames()) {
  const frame = frames[frameIndex];
  if (!frame) {
    return { outcomes: [], branchTotal: 0, remainder: 0, overflow: false };
  }

  const resolveTarget = (raw) => {
    const target = Number(raw);
    if (!Number.isInteger(target)) {
      return { target: END, valid: false };
    }
    if (target < 0 || target >= frames.length) {
      return { target: END, valid: false, raw: target };
    }
    return { target, valid: true, raw: target };
  };

  const branches = Array.isArray(frame?.branching?.branches)
    ? frame.branching.branches
    : [];
  const outcomes = [];
  let cumulative = 0;
  branches.forEach((branch, branchIndex) => {
    const weight = Number(branch?.weight);
    const safeWeight = Number.isFinite(weight) && weight > 0 ? weight : 0;
    const before = Math.min(100, cumulative);
    cumulative += safeWeight;
    const effective = Math.min(100, cumulative) - before;
    const resolved = resolveTarget(branch?.frameIndex);
    outcomes.push({
      kind: "branch",
      branchIndex,
      weight: safeWeight,
      effective,
      clipped: effective < safeWeight,
      ...resolved,
    });
  });

  const remainder = Math.max(0, 100 - Math.min(100, cumulative));
  let fallback;
  if (Number.isInteger(frame.exitBranch)) {
    fallback = { kind: "exit", ...resolveTarget(frame.exitBranch) };
  } else {
    const next = frameIndex + 1;
    fallback =
      next < frames.length
        ? { kind: "next", target: next, valid: true, raw: next }
        : { kind: "next", target: END, valid: true, raw: next };
  }
  outcomes.push({
    ...fallback,
    branchIndex: null,
    weight: remainder,
    effective: remainder,
    clipped: false,
  });

  return {
    outcomes,
    branchTotal: cumulative,
    remainder,
    overflow: cumulative > 100,
  };
}

// Walk every possible playthrough from frame 0. A scenario ends when the
// animation ends or when it jumps back to a frame it already played (a loop),
// so the probabilities of all scenarios add up to 100%.
function enumerateScenarios(frames = getCurrentFrames()) {
  const scenarios = [];
  let truncated = false;
  if (!frames.length) {
    return { scenarios, truncated, reachable: new Set(), reach: new Map() };
  }

  const holds = new Map();
  const visit = (path, probability) => {
    if (scenarios.length >= MAX_SCENARIOS) {
      truncated = true;
      return;
    }
    const current = path[path.length - 1];
    const { outcomes } = computeFrameOutcomes(current, frames);

    // Merge outcomes that lead to the same place.
    const byTarget = new Map();
    for (const outcome of outcomes) {
      if (outcome.effective <= 0) {
        continue;
      }
      byTarget.set(
        outcome.target,
        (byTarget.get(outcome.target) || 0) + outcome.effective,
      );
    }

    // A frame that jumps back to itself just holds the pose for a while.
    // Treat it as a repeat count instead of a separate scenario: the chance of
    // eventually leaving is spread over the other outcomes.
    const selfChance = byTarget.get(current) || 0;
    byTarget.delete(current);
    const leaveChance = 100 - selfChance;
    const previousHold = holds.get(current);
    if (selfChance > 0 && leaveChance > 0) {
      holds.set(current, Math.min(HOLD_LIMIT_PLAYS, 100 / leaveChance));
    }

    if (selfChance >= 100 || (selfChance > 0 && byTarget.size === 0)) {
      scenarios.push({
        path: path.slice(),
        probability,
        end: "loop",
        loopTo: current,
        holds: new Map(holds),
      });
    } else {
      for (const [target, effective] of byTarget) {
        const scaled = selfChance > 0 ? (effective * 100) / leaveChance : effective;
        const chance = (probability * scaled) / 100;
        if (target === END) {
          scenarios.push({
            path: path.slice(),
            probability: chance,
            end: "end",
            holds: new Map(holds),
          });
        } else if (path.includes(target)) {
          scenarios.push({
            path: path.slice(),
            probability: chance,
            end: "loop",
            loopTo: target,
            holds: new Map(holds),
          });
        } else {
          path.push(target);
          visit(path, chance);
          path.pop();
        }
      }
    }

    if (previousHold === undefined) {
      holds.delete(current);
    } else {
      holds.set(current, previousHold);
    }
  };
  visit([0], 100);

  const reachable = new Set();
  const reach = new Map();
  for (const scenario of scenarios) {
    for (const index of scenario.path) {
      reachable.add(index);
      reach.set(index, (reach.get(index) || 0) + scenario.probability);
    }
  }

  scenarios.sort((a, b) => b.probability - a.probability);
  return { scenarios, truncated, reachable, reach };
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  const rounded = Math.round(value * 100) / 100;
  return `${rounded}%`;
}

function formatFramePath(path, loopTo = null, holds = null) {
  const tokens = [];
  let i = 0;
  while (i < path.length) {
    const hold = holds?.get(path[i]);
    if (hold) {
      tokens.push(`${path[i]} ⟲×${Math.round(hold)}`);
      i += 1;
      continue;
    }
    let j = i;
    while (
      j + 1 < path.length &&
      path[j + 1] === path[j] + 1 &&
      !holds?.get(path[j + 1])
    ) {
      j += 1;
    }
    tokens.push(j - i >= 2 ? `${path[i]}–${path[j]}` : path.slice(i, j + 1).join(" → "));
    i = j + 1;
  }
  let text = tokens.join(" → ");
  if (loopTo !== null) {
    text += ` ↻ ${loopTo}`;
  }
  return text;
}

function validateAnimation(frames = getCurrentFrames()) {
  const problems = [];
  if (!frames.length) {
    return problems;
  }

  frames.forEach((frame, index) => {
    const { outcomes, branchTotal, overflow } = computeFrameOutcomes(index, frames);
    outcomes.forEach((outcome) => {
      if (outcome.kind !== "next" && !outcome.valid) {
        problems.push({
          level: "error",
          frame: index,
          text: `Frame ${index}: jumps to ${outcome.raw ?? "nothing"}, which does not exist (the animation just ends).`,
        });
      }
    });
    if (overflow) {
      problems.push({
        level: "error",
        frame: index,
        text: `Frame ${index}: weights add up to ${branchTotal}%. Anything above 100% is ignored.`,
      });
    }
  });

  const { reachable } = enumerateScenarios(frames);
  const unreachable = frames
    .map((_, index) => index)
    .filter((index) => !reachable.has(index));
  if (unreachable.length) {
    problems.push({
      level: "warn",
      frame: unreachable[0],
      text: `Never played: ${formatFramePath(unreachable).replaceAll(" → ", ", ")}.`,
    });
  }

  // Can the animation always finish? Find frames that cannot reach the end.
  const canEnd = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    frames.forEach((_, index) => {
      if (canEnd.has(index)) {
        return;
      }
      const { outcomes } = computeFrameOutcomes(index, frames);
      if (
        outcomes.some(
          (o) => o.effective > 0 && (o.target === END || canEnd.has(o.target)),
        )
      ) {
        canEnd.add(index);
        changed = true;
      }
    });
  }
  const stuck = [...reachable].filter((index) => !canEnd.has(index));
  if (stuck.length) {
    problems.push({
      level: "error",
      frame: stuck[0],
      text: `Frames ${formatFramePath(stuck.sort((a, b) => a - b)).replaceAll(" → ", ", ")} loop forever: no branch leads to the end.`,
    });
  }

  return problems;
}

function validateAnimationsForSave() {
  const lines = [];
  for (const [name, animation] of Object.entries(getAnimationsObject())) {
    const frames = Array.isArray(animation?.frames) ? animation.frames : [];
    for (const problem of validateAnimation(frames)) {
      if (problem.level === "error") {
        lines.push(`${name}: ${problem.text}`);
      }
    }
  }
  return lines;
}

let analysisCache = null;

function getAnalysis() {
  const frames = getCurrentFrames();
  if (!analysisCache || analysisCache.frames !== frames) {
    analysisCache = { frames, ...enumerateScenarios(frames) };
  }
  return analysisCache;
}

function invalidateAnalysis() {
  analysisCache = null;
}

function renderOutcomes() {
  const table = elements.outcomesTable;
  const summary = elements.outcomesSummary;
  table.innerHTML = "";
  summary.textContent = "";
  summary.className = "outcomes-summary";

  const frames = getCurrentFrames();
  const frameIndex = state.selectedFrameIndex;
  const frame = frames[frameIndex];
  elements.addBranchBtn.disabled = !frame;
  if (!frame) {
    return;
  }

  const { outcomes, branchTotal, remainder, overflow } = computeFrameOutcomes(
    frameIndex,
    frames,
  );

  const addCell = (row, child, className) => {
    const cell = document.createElement("div");
    if (className) {
      cell.className = className;
    }
    if (typeof child === "string") {
      cell.textContent = child;
    } else if (child) {
      cell.appendChild(child);
    }
    row.appendChild(cell);
    return cell;
  };

  const header = document.createElement("div");
  header.className = "outcome-row outcome-head";
  addCell(header, "Go to frame");
  addCell(header, "Weight");
  addCell(header, "Chance");
  addCell(header, "");
  table.appendChild(header);

  const makeNumberInput = (value, placeholder, onChange, title) => {
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.step = "1";
    input.value = value;
    input.placeholder = placeholder;
    input.title = title;
    input.addEventListener("change", () => onChange(input.value.trim()));
    return input;
  };

  const makeChance = (outcome) => {
    const wrap = document.createElement("div");
    wrap.className = "chance";
    const bar = document.createElement("div");
    bar.className = "chance-bar";
    const fill = document.createElement("div");
    fill.className = "chance-fill";
    fill.style.width = `${Math.max(0, Math.min(100, outcome.effective))}%`;
    bar.appendChild(fill);
    const label = document.createElement("span");
    label.textContent = formatPercent(outcome.effective);
    wrap.append(bar, label);
    return wrap;
  };

  const hasBranchRows = outcomes.some((outcome) => outcome.kind === "branch");
  let ghostAdded = hasBranchRows;

  // With no branches, show an empty branch row so the panel keeps its size.
  // Filling in both fields creates the branch.
  const addGhostRow = () => {
    const ghost = document.createElement("div");
    ghost.className = "outcome-row";
    const frameInput = makeNumberInput("", "", () => {}, "Frame to jump to");
    const weightInput = makeNumberInput("", "", () => {}, "Weight in percent");
    const create = () => {
      const target = frameInput.value.trim();
      const weight = weightInput.value.trim();
      if (target === "" || weight === "") {
        return;
      }
      createBranch(frameIndex, target, weight);
    };
    frameInput.addEventListener("change", create);
    weightInput.addEventListener("change", create);
    addCell(ghost, frameInput);
    addCell(ghost, weightInput);
    addCell(
      ghost,
      makeChance({ effective: 0 }),
    );
    addCell(ghost, "");
    table.appendChild(ghost);
  };

  outcomes.forEach((outcome) => {
    if (!ghostAdded && outcome.kind !== "branch") {
      addGhostRow();
      ghostAdded = true;
    }
    const row = document.createElement("div");
    row.className = "outcome-row";
    if (outcome.kind !== "branch") {
      row.classList.add("outcome-fallback");
    }
    if (!outcome.valid && outcome.kind !== "next") {
      row.classList.add("outcome-bad");
    }
    if (outcome.clipped) {
      row.classList.add("outcome-clipped");
    }

    if (outcome.kind === "branch") {
      addCell(
        row,
        makeNumberInput(
          Number.isInteger(outcome.raw) ? String(outcome.raw) : "",
          "frame",
          (value) =>
            editBranch(frameIndex, outcome.branchIndex, "frameIndex", value),
          "Frame to jump to",
        ),
      );
      addCell(
        row,
        makeNumberInput(
          String(outcome.weight),
          "0-100",
          (value) =>
            editBranch(frameIndex, outcome.branchIndex, "weight", value),
          "Weight in percent",
        ),
      );
    } else {
      addCell(
        row,
        makeNumberInput(
          outcome.kind === "exit" ? String(outcome.raw) : "",
          "",
          (value) => editExitBranch(frameIndex, value),
          "Where the rest of the chance goes. Empty = next frame, or the end on the last frame.",
        ),
      );
      addCell(row, outcome.kind === "exit" ? "the rest" : "the rest", "outcome-rest");
    }

    addCell(row, makeChance(outcome));

    const actions = document.createElement("div");
    actions.className = "outcome-actions";
    if (outcome.kind === "branch") {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "✘";
      remove.title = "Remove this branch";
      remove.addEventListener("click", () =>
        removeBranch(frameIndex, outcome.branchIndex),
      );
      actions.appendChild(remove);
    }
    addCell(row, actions);

    table.appendChild(row);
  });

  const restLabel =
    remainder > 0 ? ` + ${formatPercent(remainder)} for the rest` : "";
  if (overflow) {
    summary.classList.add("outcomes-error");
    summary.textContent = `Weights add up to ${branchTotal}%, more than 100%. The extra is ignored.`;
  } else if (!frame.branching?.branches?.length) {
    summary.textContent = Number.isInteger(frame.exitBranch)
      ? `No branches: always goes to frame ${frame.exitBranch}.`
      : "No branches: plays the next frame.";
  } else {
    summary.textContent = `Branches ${formatPercent(branchTotal)}${restLabel} = 100%`;
  }
}

function ensureBranches(frame) {
  if (!frame.branching || typeof frame.branching !== "object") {
    frame.branching = {};
  }
  if (!Array.isArray(frame.branching.branches)) {
    frame.branching.branches = [];
  }
  return frame.branching.branches;
}

function runBranchEdit(label, mutate) {
  pushHistorySnapshot();
  try {
    mutate();
  } catch (error) {
    state.historyStack.pop();
    updateToolbarButtons();
    setStatus(error.message);
    renderOutcomes();
    return;
  }
  renderFrameList();
  setStatus(label);
}

function editBranch(frameIndex, branchIndex, field, rawValue) {
  const frame = getCurrentFrames()[frameIndex];
  if (!frame) {
    return;
  }
  runBranchEdit(`Updated branch ${branchIndex + 1} of frame ${frameIndex}`, () => {
    const branch = ensureBranches(frame)[branchIndex];
    if (!branch) {
      return;
    }
    const value = Number(rawValue);
    if (rawValue === "" || !Number.isInteger(value) || value < 0) {
      throw new Error(
        field === "weight"
          ? "Weight must be a whole number between 0 and 100"
          : "Frame must be a whole number >= 0",
      );
    }
    if (field === "weight" && value > 100) {
      throw new Error("Weight must be a whole number between 0 and 100");
    }
    branch[field] = value;
  });
}

function editExitBranch(frameIndex, rawValue) {
  const frame = getCurrentFrames()[frameIndex];
  if (!frame) {
    return;
  }
  runBranchEdit(`Updated exit of frame ${frameIndex}`, () => {
    if (rawValue === "") {
      delete frame.exitBranch;
      return;
    }
    const value = Number(rawValue);
    if (!Number.isInteger(value) || value < 0) {
      throw new Error("Exit frame must be a whole number >= 0");
    }
    frame.exitBranch = value;
  });
}

function removeBranch(frameIndex, branchIndex) {
  const frame = getCurrentFrames()[frameIndex];
  if (!frame) {
    return;
  }
  runBranchEdit(`Removed branch from frame ${frameIndex}`, () => {
    const branches = ensureBranches(frame);
    branches.splice(branchIndex, 1);
    if (!branches.length) {
      delete frame.branching;
    }
  });
}

function createBranch(frameIndex, rawTarget, rawWeight) {
  const frame = getCurrentFrames()[frameIndex];
  if (!frame) {
    return;
  }
  runBranchEdit(`Added branch to frame ${frameIndex}`, () => {
    const target = Number(rawTarget);
    const weight = Number(rawWeight);
    if (!Number.isInteger(target) || target < 0) {
      throw new Error("Frame must be a whole number >= 0");
    }
    if (!Number.isInteger(weight) || weight < 0 || weight > 100) {
      throw new Error("Weight must be a whole number between 0 and 100");
    }
    ensureBranches(frame).push({ frameIndex: target, weight });
  });
}

function addBranch() {
  const frames = getCurrentFrames();
  const frameIndex = state.selectedFrameIndex;
  const frame = frames[frameIndex];
  if (!frame) {
    return;
  }
  runBranchEdit(`Added branch to frame ${frameIndex}`, () => {
    const branches = ensureBranches(frame);
    const { remainder } = computeFrameOutcomes(frameIndex, frames);
    branches.push({
      frameIndex: Math.min(frameIndex + 1, Math.max(0, frames.length - 1)),
      weight: Math.round(remainder > 0 ? remainder / 2 : 0),
    });
  });
}

function scenarioPlayPath(scenario) {
  const last = scenario.path[scenario.path.length - 1];
  const basePath =
    scenario.end === "loop" && scenario.loopTo !== last
      ? [...scenario.path, scenario.loopTo]
      : scenario.path;
  return basePath.flatMap((i) =>
    Array(Math.max(1, Math.round(scenario.holds?.get(i) || 1))).fill(i),
  );
}

function updateScenarioSelector() {
  const { scenarios, truncated } = getAnalysis();
  const count = scenarios.length;
  const index = state.previewScenarioIndex;
  const valid = Number.isInteger(index) && index >= 0 && index < count;
  if (!valid) {
    state.previewScenarioIndex = null;
  }
  elements.prevScenarioBtn.disabled = count === 0;
  elements.nextScenarioBtn.disabled = count === 0;

  if (!valid) {
    elements.scenarioPositionText.textContent = count
      ? `Random (${count}${truncated ? "+" : ""} paths)`
      : "No paths";
    elements.scenarioPathText.textContent = "";
    elements.scenarioPathText.title = "";
  } else {
    const scenario = scenarios[index];
    elements.scenarioPositionText.textContent = `Path ${index + 1}/${count} · ${formatPercent(scenario.probability)}`;
    const isLoop = scenario.end === "loop";
    const text =
      formatFramePath(
        scenario.path,
        isLoop && scenario.loopTo !== scenario.path[scenario.path.length - 1]
          ? scenario.loopTo
          : null,
        scenario.holds,
      ) + (isLoop ? "" : " → end");
    elements.scenarioPathText.textContent = text;
    elements.scenarioPathText.title = text;
  }

  for (const row of elements.scenariosList.querySelectorAll(".scenario-row")) {
    row.classList.toggle(
      "active",
      valid && Number(row.dataset.scenarioIndex) === index,
    );
  }
}

function playScenario(index) {
  const { scenarios } = getAnalysis();
  if (!scenarios.length) {
    return;
  }
  const wrapped = ((index % scenarios.length) + scenarios.length) % scenarios.length;
  state.previewScenarioIndex = wrapped;
  playAnimationPreview({ forcedPath: scenarioPlayPath(scenarios[wrapped]) });
  updateScenarioSelector();
}

function stepScenario(direction) {
  const current = state.previewScenarioIndex;
  const { scenarios } = getAnalysis();
  if (!scenarios.length) {
    return;
  }
  if (!Number.isInteger(current)) {
    playScenario(direction > 0 ? 0 : scenarios.length - 1);
  } else {
    playScenario(current + direction);
  }
}

function selectFrameForEditing(index) {
  const frames = getCurrentFrames();
  if (!Number.isInteger(index) || index < 0 || index >= frames.length) {
    return;
  }
  state.selectedFrameIndex = index;
  state.selectedFrameIndices = [index];
  setEditorTab("frames");
  renderFrameList();
}

function renderScenarios() {
  const header = elements.scenariosHeader;
  const warnings = elements.scenariosWarnings;
  const list = elements.scenariosList;
  header.textContent = "";
  warnings.innerHTML = "";
  list.innerHTML = "";

  const frames = getCurrentFrames();
  if (!frames.length) {
    header.textContent = "This animation has no frames.";
    return;
  }

  const { scenarios, truncated, reachable } = getAnalysis();
  const count = scenarios.length;
  header.textContent =
    `${count}${truncated ? "+" : ""} scenario${count === 1 ? "" : "s"}, ` +
    `${reachable.size} of ${frames.length} frames can be played. ` +
    "Chances are measured from frame 0 and add up to 100%. " +
    "⟲×N means the frame repeats about N times in a row (it jumps to itself). " +
    "↻ means the path jumps back to a frame already played and may repeat.";

  for (const problem of validateAnimation(frames)) {
    const line = document.createElement("div");
    line.className = `scenario-problem scenario-${problem.level}`;
    line.textContent = `${problem.level === "error" ? "✘" : "⚠"} ${problem.text}`;
    line.title = "Click to select the frame";
    line.addEventListener("click", () => selectFrameForEditing(problem.frame));
    warnings.appendChild(line);
  }

  const table = document.createElement("div");
  table.className = "scenario-table";
  const head = document.createElement("div");
  head.className = "scenario-row scenario-head";
  for (const label of ["Chance", "Time", "Frames played"]) {
    const cell = document.createElement("div");
    cell.textContent = label;
    head.appendChild(cell);
  }
  table.appendChild(head);

  scenarios.forEach((scenario) => {
    const row = document.createElement("div");
    row.className = "scenario-row";
    const seconds =
      scenario.path.reduce(
        (sum, i) =>
          sum + frameDurationMs(frames[i]) * (scenario.holds?.get(i) || 1),
        0,
      ) / 1000;
    const isLoop = scenario.end === "loop";
    const cells = [
      formatPercent(scenario.probability),
      `${Math.round(seconds * 10) / 10}s${isLoop ? "+" : ""}`,
      formatFramePath(
        scenario.path,
        isLoop && scenario.loopTo !== scenario.path[scenario.path.length - 1]
          ? scenario.loopTo
          : null,
        scenario.holds,
      ) +
        (isLoop && scenario.loopTo === scenario.path[scenario.path.length - 1]
          ? " ↻ forever"
          : "") +
        (isLoop ? "" : " → end"),
    ];
    for (const text of cells) {
      const cell = document.createElement("div");
      cell.textContent = text;
      row.appendChild(cell);
    }
    row.title = isLoop
      ? `Goes back to frame ${scenario.loopTo} and can repeat from there. Click to play.`
      : "Click to play this path";
    row.dataset.scenarioIndex = String(scenarios.indexOf(scenario));
    row.addEventListener("click", () => {
      playScenario(Number(row.dataset.scenarioIndex));
    });
    table.appendChild(row);
  });
  if (truncated) {
    const more = document.createElement("div");
    more.className = "scenario-problem scenario-warn";
    more.textContent = `⚠ Showing the ${MAX_SCENARIOS} most likely scenarios only.`;
    table.appendChild(more);
  }
  list.appendChild(table);
  updateScenarioSelector();
}


function getFrameImageCoordsList(frame) {
  if (!frame || !Array.isArray(frame.images) || !state.payload) {
    return [];
  }

  const [fw, fh] = state.payload.frameSize;
  const cols = state.payload.map.cols;
  const coordsList = [];

  for (const ref of frame.images) {
    if (Array.isArray(ref) && ref.length >= 2) {
      const x = Number(ref[0]);
      const y = Number(ref[1]);
      if (Number.isFinite(x) && Number.isFinite(y)) {
        coordsList.push({ x, y });
      }
    } else if (Number.isFinite(ref)) {
      const idx = Number(ref);
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      coordsList.push({ x: col * fw, y: row * fh });
    }
  }

  return coordsList;
}

function stopAnimationPreview() {
  if (state.previewTimer) {
    clearTimeout(state.previewTimer);
    state.previewTimer = null;
  }
  updatePreviewPlayToggle();
}

function drawPreviewFrame(canvas, ctx, frameIndex = 0) {
  const [fw, fh] = state.payload?.frameSize || [128, 128];
  const frames = getCurrentFrames();
  canvas.width = fw;
  canvas.height = fh;
  ctx.clearRect(0, 0, fw, fh);
  ctx.fillStyle = "#1f1f1f";
  ctx.fillRect(0, 0, fw, fh);

  if (!frames.length || !state.mapImage) {
    return -1;
  }

  const bounded = Math.max(0, Math.min(frameIndex, frames.length - 1));
  const frame = frames[bounded];
  const coordsList = getFrameImageCoordsList(frame);
  for (const coords of coordsList) {
    ctx.drawImage(
      state.mapImage,
      coords.x,
      coords.y,
      fw,
      fh,
      0,
      0,
      fw,
      fh,
    );
  }

  return bounded;
}

function renderSelectedFramePreview() {
  const bounded = drawPreviewFrame(
    elements.framePreviewCanvas,
    framePreviewCtx,
    state.selectedFrameIndex,
  );
  elements.framePreviewText.textContent = Number.isInteger(bounded) && bounded >= 0
    ? `Frame: ${bounded}`
    : "Frame: -";
}

function renderAnimationPreview(frameIndex = 0) {
  const bounded = drawPreviewFrame(
    elements.animationPreviewCanvas,
    previewCtx,
    frameIndex,
  );

  if (bounded < 0) {
    elements.previewFrameText.textContent = "Frame: -";
    return;
  }

  state.previewFrameIndex = bounded;
  if (!state.previewTimer) {
    state.previewStartFrameIndex = bounded;
  }

  elements.previewFrameText.textContent = `Frame: ${bounded}`;
}

function playAnimationPreview(options = {}) {
  const frames = getCurrentFrames();
  if (!frames.length) {
    stopAnimationPreview();
    setStatus("No frames in this animation");
    return;
  }

  const forcedPath = Array.isArray(options.forcedPath) ? options.forcedPath : null;
  if (!forcedPath) {
    state.previewScenarioIndex = null;
  }
  const requestedStart = Number(options.startIndex);
  const startIndex = forcedPath
    ? forcedPath[0]
    : Number.isInteger(requestedStart)
      ? Math.max(0, Math.min(requestedStart, frames.length - 1))
      : Math.max(0, Math.min(state.previewFrameIndex, frames.length - 1));

  stopAnimationPreview();
  state.previewStartFrameIndex = startIndex;
  updateScenarioSelector();
  let cursor = startIndex;
  let step = 0;

  // Roll the same dice as the runtime. Returns { target, chance }.
  const rollNext = (currentIndex) => {
    const { outcomes } = computeFrameOutcomes(currentIndex, frames);
    const roll = Math.random() * 100;
    let cumulative = 0;
    for (const outcome of outcomes) {
      if (outcome.effective <= 0) {
        continue;
      }
      cumulative += outcome.effective;
      if (roll < cumulative) {
        return { target: outcome.target, chance: outcome.effective };
      }
    }
    const last = outcomes[outcomes.length - 1];
    return { target: last ? last.target : END, chance: last?.effective ?? 100 };
  };

  const tick = () => {
    const frame = frames[cursor] || {};
    renderAnimationPreview(cursor);
    if (state.previewSoundEnabled && frame.sound) {
      playSoundById(String(frame.sound), { silent: true }).catch(() => {});
    }
    const duration = frameDurationMs(frame);

    let next;
    if (forcedPath) {
      step += 1;
      next = step < forcedPath.length ? forcedPath[step] : END;
    } else {
      const rolled = rollNext(cursor);
      next = rolled.target;
    }

    if (next === END) {
      // The runtime ends the animation here. The preview waits out the last
      // frame, then starts over (the same path, or a fresh random roll).
      state.previewTimer = setTimeout(() => {
        cursor = startIndex;
        step = 0;
          tick();
      }, duration);
    } else {
      cursor = next;
      state.previewTimer = setTimeout(tick, duration);
    }
    updatePreviewPlayToggle();
  };

  tick();
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function serializeDefinition(definition) {
  return JSON.stringify(definition ?? null);
}

function createHistorySnapshot() {
  return {
    definition: deepClone(state.payload.definition),
    selectedAnimation: state.selectedAnimation,
    selectedFrameIndex: state.selectedFrameIndex,
    selectedFrameIndices: deepClone(state.selectedFrameIndices),
    selectedCell: state.selectedCell,
    previewFrameIndex: state.previewFrameIndex,
  };
}

function hasPendingFrameEditorChanges() {
  const frame = getCurrentFrames()[state.selectedFrameIndex];
  if (!frame) {
    return false;
  }

  return (
    elements.durationInput.value !== String(Number(frame.duration ?? 0)) ||
    elements.soundSelect.value !== (frame.sound ? String(frame.sound) : "") ||
    elements.imagesInput.value !== formatImages(frame.images)
  );
}

function isSessionDirty() {
  if (!state.currentAgent || !state.payload?.definition) {
    return false;
  }

  if (state.lastSavedDefinitionJson !== serializeDefinition(state.payload.definition)) {
    return true;
  }

  return hasPendingFrameEditorChanges();
}

function updateToolbarButtons() {
  elements.undoBtn.disabled = state.historyStack.length === 0;
  elements.redoBtn.disabled = state.redoStack.length === 0;
  elements.saveBtn.disabled = !isSessionDirty();
}

function pushHistorySnapshot(options = {}) {
  const { clearRedo = true } = options;
  if (!state.payload?.definition) {
    return;
  }

  state.historyStack.push(createHistorySnapshot());

  if (state.historyStack.length > 100) {
    state.historyStack.shift();
  }

  if (clearRedo) {
    state.redoStack = [];
  }

  updateToolbarButtons();
}

function restoreSnapshot(snapshot) {
  state.payload.definition = deepClone(snapshot.definition);
  state.selectedAnimation = snapshot.selectedAnimation;
  if (!getAnimationsObject()[state.selectedAnimation]) {
    state.selectedAnimation = animationNames().at(0) || null;
  }

  const frames = getCurrentFrames();
  state.selectedFrameIndex = Math.max(
    0,
    Math.min(snapshot.selectedFrameIndex, Math.max(0, frames.length - 1)),
  );
  state.selectedFrameIndices = Array.isArray(snapshot.selectedFrameIndices)
    ? snapshot.selectedFrameIndices.filter(
        (i) => Number.isInteger(i) && i >= 0 && i < frames.length,
      )
    : [];
  if (
    !state.selectedFrameIndices.length &&
    state.selectedFrameIndex >= 0 &&
    frames.length > 0
  ) {
    state.selectedFrameIndices = [state.selectedFrameIndex];
  }
  state.selectedCell = snapshot.selectedCell;
  state.previewFrameIndex = Math.max(
    0,
    Number(snapshot.previewFrameIndex) || 0,
  );
  state.previewStartFrameIndex = state.previewFrameIndex;

  renderAnimationList();
  renderFrameList();
  renderMapMeta();
  drawMap();
  renderAnimationPreview(state.previewFrameIndex);
  updateToolbarButtons();
}

function frameToCell(frame) {
  if (!frame || !Array.isArray(frame.images) || frame.images.length === 0) {
    return null;
  }
  const first = frame.images[0];
  if (Number.isFinite(first)) {
    return cellIndexToCoords(Number(first));
  }

  if (!Array.isArray(first) || first.length < 2) {
    return null;
  }
  const [x, y] = first;
  const [fw, fh] = state.payload.frameSize;
  const col = Math.floor(x / fw);
  const row = Math.floor(y / fh);
  return {
    col,
    row,
    x,
    y,
    index: row * state.payload.map.cols + col,
  };
}

function cellIndexToCoords(index) {
  const cols = state.payload.map.cols;
  const [fw, fh] = state.payload.frameSize;
  const col = index % cols;
  const row = Math.floor(index / cols);
  return { col, row, x: col * fw, y: row * fh, index };
}

function drawMap() {
  if (!state.mapImage || !state.payload) {
    return;
  }

  const { width, height, cols, rows } = state.payload.map;
  const [fw, fh] = state.payload.frameSize;

  elements.mapCanvas.width = width;
  elements.mapCanvas.height = height;
  elements.mapCanvas.style.width = `${Math.max(1, Math.round(width * state.mapZoom))}px`;
  elements.mapCanvas.style.height = `${Math.max(1, Math.round(height * state.mapZoom))}px`;

  mapCtx.clearRect(0, 0, width, height);
  mapCtx.drawImage(state.mapImage, 0, 0);

  mapCtx.strokeStyle = "rgba(255,255,255,0.23)";
  mapCtx.lineWidth = 1;
  for (let c = 0; c <= cols; c += 1) {
    const x = c * fw + 0.5;
    mapCtx.beginPath();
    mapCtx.moveTo(x, 0);
    mapCtx.lineTo(x, height);
    mapCtx.stroke();
  }
  for (let r = 0; r <= rows; r += 1) {
    const y = r * fh + 0.5;
    mapCtx.beginPath();
    mapCtx.moveTo(0, y);
    mapCtx.lineTo(width, y);
    mapCtx.stroke();
  }

  const selectedFrame = getCurrentFrames()[state.selectedFrameIndex];
  const selectedFrameCell = frameToCell(selectedFrame);
  if (selectedFrameCell) {
    mapCtx.strokeStyle = "#00ff55";
    mapCtx.lineWidth = 2;
    mapCtx.strokeRect(
      selectedFrameCell.x + 1,
      selectedFrameCell.y + 1,
      fw - 2,
      fh - 2,
    );
  }

  if (state.selectedCell) {
    const cell = cellIndexToCoords(state.selectedCell);
    mapCtx.strokeStyle = "#ffea00";
    mapCtx.lineWidth = 2;
    mapCtx.strokeRect(cell.x + 1, cell.y + 1, fw - 2, fh - 2);
  }
}

function setMapZoom(value) {
  const clamped = Math.min(4, Math.max(0.25, Number(value) || 1));
  state.mapZoom = clamped;
  elements.zoomLabel.textContent = `${Math.round(clamped * 100)}%`;
  drawMap();
}

function renderMapMeta() {
  if (!state.payload) {
    elements.mapMeta.textContent = "";
    elements.selectedCell.textContent = "";
    return;
  }

  const map = state.payload.map;
  const [fw, fh] = state.payload.frameSize;
  elements.mapMeta.textContent = `Map ${map.width}x${map.height}, Grid ${map.cols}x${map.rows}, Frame ${fw}x${fh}`;

  if (state.selectedCell === null) {
    elements.selectedCell.textContent = "Selected: none";
  } else {
    const c = cellIndexToCoords(state.selectedCell);
    elements.selectedCell.textContent = `Selected: #${c.index} (${c.x},${c.y})`;
  }
}

function animationNames() {
  return Object.keys(getAnimationsObject()).sort((a, b) => a.localeCompare(b));
}

function renderAnimationList() {
  const list = elements.animationList;
  list.innerHTML = "";
  const query = elements.animationSearch.value.trim().toLowerCase();

  for (const name of animationNames()) {
    if (query && !name.toLowerCase().includes(query)) {
      continue;
    }
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    if (name === state.selectedAnimation) {
      option.selected = true;
    }
    list.appendChild(option);
  }
}

function renderSoundOptions() {
  elements.soundSelect.innerHTML = "";

  const none = document.createElement("option");
  none.value = "";
  none.textContent = "(none)";
  elements.soundSelect.appendChild(none);

  if (!state.payload) {
    return;
  }

  for (const sound of state.payload.sounds) {
    const option = document.createElement("option");
    option.value = sound.id;
    option.textContent = sound.id;
    elements.soundSelect.appendChild(option);
  }
}

function renderSoundLibrary() {
  elements.soundButtonGrid.innerHTML = "";
  state.selectedLibrarySoundId = "";
  elements.selectedLibrarySoundText.textContent = "Selected: (none)";
  if (!state.payload) {
    return;
  }

  for (const sound of state.payload.sounds) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.soundId = sound.id;
    button.textContent = `${sound.id} >`;
    button.addEventListener("click", async () => {
      state.selectedLibrarySoundId = sound.id;
      elements.selectedLibrarySoundText.textContent = `Selected: ${sound.id}`;
      for (const el of elements.soundButtonGrid.querySelectorAll("button")) {
        el.classList.toggle("active", el === button);
      }
      try {
        await playSoundById(sound.id);
      } catch (error) {
        setStatus(error.message);
      }
    });
    elements.soundButtonGrid.appendChild(button);
  }
}

function describeFrame(frame, index) {
  const duration = Number(frame?.duration ?? 0);
  const imageCell = frameToCell(frame);
  const sound = frame?.sound ? ` sound:${frame.sound}` : "";
  const img = imageCell ? ` #${imageCell.index}` : " n/a";

  let flow = "";
  const hasBranching =
    Number.isInteger(frame?.exitBranch) ||
    (Array.isArray(frame?.branching?.branches) && frame.branching.branches.length > 0);
  if (hasBranching) {
    const { outcomes } = computeFrameOutcomes(index);
    const merged = new Map();
    for (const outcome of outcomes) {
      if (outcome.effective > 0) {
        merged.set(outcome.target, (merged.get(outcome.target) || 0) + outcome.effective);
      }
    }
    const parts = [...merged].map(
      ([target, chance]) =>
        `${target === END ? "end" : target}${merged.size > 1 ? ` ${formatPercent(chance)}` : ""}`,
    );
    flow = ` →${parts.join(", ")}`;
  }

  const unreachable = getAnalysis().reachable.has(index) ? "" : " ✗unused";
  return `${index.toString().padStart(3, "0")} | ${duration}ms | ${img}${flow}${sound}${unreachable}`;
}

function renderFrameList() {
  invalidateAnalysis();
  state.previewScenarioIndex = null;
  const list = elements.frameList;
  list.innerHTML = "";

  const frames = getCurrentFrames();
  if (state.selectedFrameIndex >= frames.length) {
    state.selectedFrameIndex = frames.length - 1;
  }
  state.selectedFrameIndices = (state.selectedFrameIndices || []).filter(
    (i) => Number.isInteger(i) && i >= 0 && i < frames.length,
  );
  if (
    !state.selectedFrameIndices.length &&
    state.selectedFrameIndex >= 0 &&
    frames.length > 0
  ) {
    state.selectedFrameIndices = [state.selectedFrameIndex];
  }

  updateSelectAllFramesToggle();

  frames.forEach((frame, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = describeFrame(frame, index);
    if (state.selectedFrameIndices.includes(index)) {
      option.selected = true;
    }
    list.appendChild(option);
  });

  renderFrameEditor();
  drawMap();
  renderSelectedFramePreview();
  renderAnimationPreview(state.previewFrameIndex);
  if (state.activeTab === "scenarios") {
    renderScenarios();
  }
  updateScenarioSelector();
}

function formatImages(images) {
  if (!Array.isArray(images)) {
    return "";
  }
  return images
    .map((image) => {
      if (Number.isFinite(image)) {
        return String(Number(image));
      }

      if (Array.isArray(image) && image.length >= 2) {
        return `${image[0]},${image[1]}`;
      }

      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function renderFrameEditor() {
  const frame = getCurrentFrames()[state.selectedFrameIndex];

  if (!frame) {
    elements.durationInput.value = "";
    elements.soundSelect.value = "";
    elements.imagesInput.value = "";
    renderOutcomes();
    updateToolbarButtons();
    return;
  }

  elements.durationInput.value = Number(frame.duration ?? 0);
  elements.soundSelect.value = frame.sound ? String(frame.sound) : "";
  elements.imagesInput.value = formatImages(frame.images);
  renderOutcomes();
  updateToolbarButtons();
}

function parseImages(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const images = [];
  for (const line of lines) {
    const normalized = line.replace(/\s+/g, "");
    if (/^#?\d+$/.test(normalized)) {
      images.push(Number(normalized.replace("#", "")));
      continue;
    }

    const [xRaw, yRaw, ...extraParts] = normalized.split(",");
    if (extraParts.length > 0) {
      throw new Error(`Invalid image coordinate: ${line}`);
    }

    const x = Number(xRaw);
    const y = Number(yRaw);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(`Invalid image reference: ${line}`);
    }
    images.push([x, y]);
  }

  return images;
}

function getSelectedFrameIndices() {
  const frames = getCurrentFrames();
  const selected = Array.from(
    new Set(
      (state.selectedFrameIndices || []).filter(
        (i) => Number.isInteger(i) && i >= 0 && i < frames.length,
      ),
    ),
  ).sort((a, b) => a - b);

  if (selected.length) {
    return selected;
  }

  if (
    Number.isInteger(state.selectedFrameIndex) &&
    state.selectedFrameIndex >= 0 &&
    state.selectedFrameIndex < frames.length
  ) {
    return [state.selectedFrameIndex];
  }

  return [];
}

// Rewrite every frame jump (exit + branches) with mapIndex(oldIndex), which
// returns the new index or null to drop the jump. Returns how many were dropped.
function remapFrameRefs(frame, mapIndex) {
  let dropped = 0;
  if (Number.isInteger(frame.exitBranch)) {
    const mapped = mapIndex(frame.exitBranch);
    if (mapped === null) {
      delete frame.exitBranch;
      dropped += 1;
    } else {
      frame.exitBranch = mapped;
    }
  }

  const branches = frame.branching?.branches;
  if (Array.isArray(branches)) {
    frame.branching.branches = branches.filter((branch) => {
      const mapped = Number.isInteger(branch?.frameIndex)
        ? mapIndex(branch.frameIndex)
        : null;
      if (mapped === null) {
        dropped += 1;
        return false;
      }
      branch.frameIndex = mapped;
      return true;
    });
    if (!frame.branching.branches.length) {
      delete frame.branching;
    }
  }
  return dropped;
}

// Structural edits below keep every jump pointing at the same frame it did
// before, so editing the timeline does not silently rewire the branches.
function insertFramesKeepingLinks(frames, at, newFrames) {
  const count = newFrames.length;
  const shift = (old) => (old >= at ? old + count : old);
  frames.forEach((frame) => remapFrameRefs(frame, shift));
  newFrames.forEach((frame) => remapFrameRefs(frame, shift));
  frames.splice(at, 0, ...newFrames);
}

// `indices` must be sorted ascending. Jumps to a removed frame are dropped
// (there is nothing left to jump to). Returns how many were dropped.
function removeFramesKeepingLinks(frames, indices) {
  const removed = new Set(indices);
  let dropped = 0;
  frames.forEach((frame, i) => {
    if (removed.has(i)) {
      return;
    }
    dropped += remapFrameRefs(frame, (old) => {
      if (removed.has(old)) {
        return null;
      }
      return old - indices.filter((index) => index < old).length;
    });
  });
  for (const index of [...indices].reverse()) {
    frames.splice(index, 1);
  }
  return dropped;
}

// Call after reordering `frames` in place; `before` is frames.slice() taken
// before the reorder.
function relinkAfterReorder(frames, before) {
  const newIndex = new Map(before.map((frame, i) => [i, frames.indexOf(frame)]));
  frames.forEach((frame) => remapFrameRefs(frame, (old) => newIndex.get(old) ?? null));
}

function deleteSelectedFrames() {
  const frames = getCurrentFrames();
  const selected = getSelectedFrameIndices();
  if (!selected.length) {
    return;
  }

  pushHistorySnapshot();
  const dropped = removeFramesKeepingLinks(frames, selected);

  if (frames.length === 0) {
    state.selectedFrameIndex = -1;
    state.selectedFrameIndices = [];
  } else {
    const nextIndex = Math.max(0, Math.min(selected[0], frames.length - 1));
    state.selectedFrameIndex = nextIndex;
    state.selectedFrameIndices = [nextIndex];
  }

  renderFrameList();
  setStatus(
    `Removed ${selected.length} frame(s)` +
      (dropped ? `. ${dropped} jump(s) to them were removed` : ""),
  );
}

function copySelectedFramesToClipboard(options = {}) {
  const frames = getCurrentFrames();
  const selected = getSelectedFrameIndices();
  if (!selected.length) {
    setStatus("Select at least 1 frame to copy");
    return false;
  }

  state.copiedFrames = selected.map((index) => deepClone(frames[index]));
  state.copiedMeta = {
    indices: selected,
    source: `${state.currentAgent}/${state.selectedAnimation}`,
    cut: Boolean(options.cut),
  };
  if (!options.silent) {
    setStatus(`Copied ${state.copiedFrames.length} frame(s)`);
  }
  return true;
}

function cutSelectedFramesToClipboard() {
  const frames = getCurrentFrames();
  const selected = getSelectedFrameIndices();
  if (!selected.length) {
    setStatus("Select at least 1 frame to cut");
    return false;
  }

  copySelectedFramesToClipboard({ cut: true, silent: true });

  pushHistorySnapshot();
  removeFramesKeepingLinks(frames, selected);

  const next = frames.length
    ? Math.max(0, Math.min(selected[0], frames.length - 1))
    : -1;
  state.selectedFrameIndex = next;
  state.selectedFrameIndices = next >= 0 ? [next] : [];
  renderFrameList();
  setStatus(`Cut ${selected.length} frame(s). Paste them with Ctrl+V`);
  return true;
}

function pasteCopiedFramesFromClipboard() {
  if (!state.selectedAnimation) {
    setStatus("Select an animation first");
    return false;
  }

  if (!Array.isArray(state.copiedFrames) || !state.copiedFrames.length) {
    setStatus("Copy at least 1 frame first");
    return false;
  }

  pushHistorySnapshot();
  const frames = getCurrentFrames();
  const selected = getSelectedFrameIndices();
  const insertAt = selected.length
    ? selected[selected.length - 1] + 1
    : frames.length;
  const clones = state.copiedFrames.map((frame) => deepClone(frame));
  const meta = state.copiedMeta || { indices: [], source: "", cut: false };
  const count = clones.length;

  // Inserting shifts the frames after the insert point.
  const shift = (old) => (old >= insertAt ? old + count : old);
  for (const frame of frames) {
    remapFrameRefs(frame, shift);
  }

  // Jumps between the pasted frames follow them to their new place. Jumps to
  // frames that were not copied only make sense in the animation they came
  // from (and not after a cut), otherwise they are removed.
  const sameAnimation =
    !meta.cut && meta.source === `${state.currentAgent}/${state.selectedAnimation}`;
  let dropped = 0;
  for (const clone of clones) {
    dropped += remapFrameRefs(clone, (old) => {
      const position = meta.indices.indexOf(old);
      if (position >= 0) {
        return insertAt + position;
      }
      return sameAnimation && old < frames.length ? shift(old) : null;
    });
  }
  frames.splice(insertAt, 0, ...clones);

  state.selectedFrameIndices = clones.map((_, i) => insertAt + i);
  state.selectedFrameIndex = state.selectedFrameIndices[0] ?? -1;
  renderFrameList();
  setStatus(
    `Pasted ${count} frame(s)` +
      (dropped
        ? `. ${dropped} jump(s) to frames that were not copied were removed`
        : ""),
  );
  return true;
}

function shouldHandleFrameClipboardShortcut() {
  const activeElement = document.activeElement;
  if (
    activeElement &&
    activeElement !== elements.frameList &&
    activeElement !== elements.animationList
  ) {
    const tagName = activeElement.tagName;
    if (
      activeElement.isContentEditable ||
      tagName === "INPUT" ||
      tagName === "TEXTAREA" ||
      tagName === "SELECT"
    ) {
      return false;
    }
  }

  return Boolean(state.selectedAnimation);
}

function clearFrameBranchFields(frame) {
  if (!frame || typeof frame !== "object") {
    return;
  }
  delete frame.exitBranch;
  delete frame.branching;
}

function applyFrameEditor(options = {}) {
  const { statusText = `Updated frame ${state.selectedFrameIndex} in session` } =
    options;
  const frame = getCurrentFrames()[state.selectedFrameIndex];
  if (!frame) {
    return false;
  }

  const duration = Number(elements.durationInput.value || "0");
  if (!Number.isFinite(duration) || duration < 0) {
    throw new Error("Duration must be 0 or higher");
  }

  frame.duration = duration;

  const sound = elements.soundSelect.value.trim();
  if (sound) {
    frame.sound = sound;
  } else {
    delete frame.sound;
  }

  frame.images = parseImages(elements.imagesInput.value);

  renderFrameList();
  if (statusText) {
    setStatus(statusText);
  }
  return true;
}

function applyFrameEditorToSession(options = {}) {
  const { statusText } = options;

  if (state.selectedFrameIndex < 0) {
    return;
  }

  pushHistorySnapshot();
  try {
    const applied = applyFrameEditor({ statusText });
    if (!applied) {
      state.historyStack.pop();
    }
  } catch (error) {
    state.historyStack.pop();
    throw error;
  }
}

function selectAnimation(name) {
  const wasPlaying = Boolean(state.previewTimer);
  const previousPreviewFrameIndex = state.previewFrameIndex;
  stopAnimationPreview();
  state.previewStartFrameIndex = previousPreviewFrameIndex;
  state.selectedAnimation = name;
  state.selectedFrameIndex = 0;
  state.selectedFrameIndices = [0];
  renderAnimationList();
  renderFrameList();
  if (wasPlaying) {
    playAnimationPreview({ startIndex: previousPreviewFrameIndex });
  } else {
    renderAnimationPreview(previousPreviewFrameIndex);
  }
}

async function loadAgent(name) {
  setStatus(`Loading ${name}...`);
  stopCurrentAudio();
  stopAnimationPreview();
  const payload = await fetchJson(`/api/agent/${encodeURIComponent(name)}`);

  state.currentAgent = name;
  state.payload = payload;
  state.selectedAnimation = animationNames().at(0) || null;
  state.selectedFrameIndex = 0;
  state.selectedFrameIndices = [0];
  state.previewStartFrameIndex = 0;
  state.sequenceCaptureEnabled = false;
  state.selectedCell = null;
  state.mapZoom = 1;
  state.previewSoundEnabled = false;
  state.soundCache.clear();
  state.historyStack = [];
  state.redoStack = [];
  state.lastSavedDefinitionJson = serializeDefinition(payload.definition);

  state.mapImage = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load map image"));
    img.src = payload.map.src;
  });

  renderMapMeta();
  setMapZoom(1);
  updatePreviewSoundToggle();
  updateSequenceCaptureToggle();
  renderSoundOptions();
  renderSoundLibrary();
  renderAnimationList();
  renderFrameList();
  drawMap();
  playAnimationPreview();
  updateToolbarButtons();
  setStatus(`Loaded ${name}`);
}

function selectedCellCoords() {
  if (state.selectedCell === null || !state.payload) {
    return null;
  }
  const c = cellIndexToCoords(state.selectedCell);
  return [c.x, c.y];
}

function createFrameFromSelectedCell() {
  const coords = selectedCellCoords();
  return {
    duration: 100,
    images: coords ? [coords] : [],
  };
}

async function saveAgent(options = {}) {
  const shouldApplyCurrentFrame = options.applyCurrentFrame !== false;
  if (!state.currentAgent || !state.payload) {
    return;
  }

  try {
    if (shouldApplyCurrentFrame && state.selectedFrameIndex >= 0) {
      applyFrameEditor({ statusText: null });
    }
  } catch (error) {
    setStatus(error.message);
    return;
  }

  const branchErrors = validateAnimationsForSave();
  if (branchErrors.length) {
    const listing = branchErrors.slice(0, 8).join(String.fromCharCode(10));
    const question = [
      "Some animations have branching problems:",
      listing,
      "Save anyway?",
    ].join(String.fromCharCode(10, 10));
    if (!window.confirm(question)) {
      setStatus("Save cancelled: fix the branching problems first");
      return;
    }
  }

  setStatus("Saving...");
  const result = await fetchJson(
    `/api/agent/${encodeURIComponent(state.currentAgent)}/save`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ definition: state.payload.definition }),
    },
  );

  // Read back from disk after save so UI state always matches the actual file content.
  const reloaded = await fetchJson(
    `/api/agent/${encodeURIComponent(state.currentAgent)}`,
  );
  if (!reloaded?.definition || typeof reloaded.definition !== "object") {
    throw new Error(
      "Save verification failed: could not reload agent definition",
    );
  }
  state.payload.definition = reloaded.definition;
  state.lastSavedDefinitionJson = serializeDefinition(reloaded.definition);
  if (!getAnimationsObject()[state.selectedAnimation]) {
    state.selectedAnimation = animationNames().at(0) || null;
  }
  const frames = getCurrentFrames();
  if (frames.length === 0) {
    state.selectedFrameIndex = -1;
    state.selectedFrameIndices = [];
  } else {
    state.selectedFrameIndex = Math.max(
      0,
      Math.min(state.selectedFrameIndex, frames.length - 1),
    );
    state.selectedFrameIndices = [state.selectedFrameIndex];
  }
  renderAnimationList();
  renderFrameList();

  const savedPath =
    result?.savedPath || `assets/agents/${state.currentAgent}/agent.js`;
  setStatus(`Saved: ${savedPath}`);
}

async function undoLastChange() {
  if (!state.historyStack.length) {
    setStatus("Nothing to undo");
    return;
  }

  stopAnimationPreview();
  state.redoStack.push(createHistorySnapshot());
  if (state.redoStack.length > 100) {
    state.redoStack.shift();
  }
  const snapshot = state.historyStack.pop();
  restoreSnapshot(snapshot);
  playAnimationPreview();
  setStatus("Undid last change in session");
}

async function redoLastChange() {
  if (!state.redoStack.length) {
    setStatus("Nothing to redo");
    return;
  }

  stopAnimationPreview();
  pushHistorySnapshot({ clearRedo: false });
  const snapshot = state.redoStack.pop();
  restoreSnapshot(snapshot);
  playAnimationPreview();
  setStatus("Redid last change in session");
}

async function playSoundById(soundId, options = {}) {
  const { silent = false } = options;
  if (!soundId || !state.currentAgent) {
    if (!silent) {
      setStatus("Pick a sound first");
    }
    return;
  }

  let uri = state.soundCache.get(soundId);
  if (!uri) {
    const data = await fetchJson(
      `/api/agent/${encodeURIComponent(state.currentAgent)}/sound/${encodeURIComponent(soundId)}`,
    );
    uri = data.uri;
    state.soundCache.set(soundId, uri);
  }

  stopCurrentAudio();
  const audio = new Audio(uri);
  state.currentAudio = audio;
  audio.addEventListener("ended", () => {
    if (state.currentAudio === audio) {
      state.currentAudio = null;
    }
  });
  await audio.play();
  if (!silent) {
    setStatus(`Playing sound ${soundId}`);
  }
}

function stopCurrentAudio() {
  if (!state.currentAudio) {
    return;
  }
  state.currentAudio.pause();
  state.currentAudio.currentTime = 0;
  state.currentAudio = null;
}

async function previewSelectedSound() {
  await playSoundById(elements.soundSelect.value);
}

function bindEvents() {
  elements.framesTabBtn.addEventListener("click", () => {
    setEditorTab("frames");
  });

  elements.soundsTabBtn.addEventListener("click", () => {
    setEditorTab("sounds");
  });

  elements.scenariosTabBtn.addEventListener("click", () => {
    setEditorTab("scenarios");
  });

  elements.togglePreviewSoundBtn.addEventListener("click", () => {
    state.previewSoundEnabled = !state.previewSoundEnabled;
    updatePreviewSoundToggle();
    if (!state.previewSoundEnabled) {
      stopCurrentAudio();
    }
  });

  elements.zoomOutBtn.addEventListener("click", () => {
    setMapZoom(state.mapZoom - 0.25);
  });

  elements.zoomInBtn.addEventListener("click", () => {
    setMapZoom(state.mapZoom + 0.25);
  });

  elements.zoomResetBtn.addEventListener("click", () => {
    setMapZoom(1);
  });

  elements.sequenceCaptureBtn.addEventListener("click", () => {
    state.sequenceCaptureEnabled = !state.sequenceCaptureEnabled;
    updateSequenceCaptureToggle();
    setStatus(
      state.sequenceCaptureEnabled
        ? "Sequence add enabled"
        : "Sequence add disabled",
    );
  });

  elements.loadAgentBtn.addEventListener("click", async () => {
    const name = elements.agentSelect.value;
    if (!name) {
      return;
    }
    try {
      await loadAgent(name);
    } catch (error) {
      setStatus(error.message);
    }
  });

  elements.saveBtn.addEventListener("click", async () => {
    try {
      await saveAgent();
    } catch (error) {
      setStatus(error.message);
    }
  });

  elements.undoBtn.addEventListener("click", async () => {
    try {
      await undoLastChange();
    } catch (error) {
      setStatus(error.message);
    }
  });

  elements.redoBtn.addEventListener("click", async () => {
    try {
      await redoLastChange();
    } catch (error) {
      setStatus(error.message);
    }
  });

  elements.animationSearch.addEventListener("input", renderAnimationList);

  elements.animationList.addEventListener("change", () => {
    const name = elements.animationList.value;
    if (!name) {
      return;
    }
    selectAnimation(name);
  });

  elements.toggleAnimationPlayBtn.addEventListener("click", () => {
    if (state.previewTimer) {
      stopAnimationPreview();
      renderAnimationPreview(state.previewFrameIndex);
      return;
    }
    playAnimationPreview();
  });

  elements.newAnimationBtn.addEventListener("click", () => {
    if (!state.payload) {
      return;
    }

    const name = window.prompt("Animation name");
    if (!name) {
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(name)) {
      setStatus(
        "Use only letters, numbers, and underscore for animation names",
      );
      return;
    }

    const animations = getAnimationsObject();
    if (animations[name]) {
      setStatus("Animation already exists");
      return;
    }

    pushHistorySnapshot();
    animations[name] = { frames: [] };
    selectAnimation(name);
    setStatus(`Created ${name}`);
  });

  elements.renameAnimationBtn.addEventListener("click", () => {
    if (!state.payload || !state.selectedAnimation) {
      return;
    }

    const currentName = state.selectedAnimation;
    const nextName = window.prompt("New animation name", currentName);
    if (!nextName) {
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(nextName)) {
      setStatus(
        "Use only letters, numbers, and underscore for animation names",
      );
      return;
    }
    if (nextName === currentName) {
      setStatus("Name unchanged");
      return;
    }

    const animations = getAnimationsObject();
    if (animations[nextName]) {
      setStatus("Animation name already exists");
      return;
    }

    pushHistorySnapshot();
    const renamed = {};
    for (const [name, value] of Object.entries(animations)) {
      if (name === currentName) {
        renamed[nextName] = value;
      } else {
        renamed[name] = value;
      }
    }
    state.payload.definition.animations = renamed;
    selectAnimation(nextName);
    setStatus(`Renamed ${currentName} -> ${nextName}`);
  });

  elements.duplicateAnimationBtn.addEventListener("click", () => {
    if (!state.payload || !state.selectedAnimation) {
      return;
    }

    const sourceName = state.selectedAnimation;
    const duplicateName = window.prompt(
      "Duplicate animation as",
      `${sourceName}_Copy`,
    );
    if (!duplicateName) {
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(duplicateName)) {
      setStatus(
        "Use only letters, numbers, and underscore for animation names",
      );
      return;
    }
    if (duplicateName === sourceName) {
      setStatus("Duplicate name must be different");
      return;
    }

    const animations = getAnimationsObject();
    if (animations[duplicateName]) {
      setStatus("Animation name already exists");
      return;
    }

    pushHistorySnapshot();
    animations[duplicateName] = deepClone(animations[sourceName]);
    selectAnimation(duplicateName);
    setStatus(`Duplicated ${sourceName} -> ${duplicateName}`);
  });

  elements.deleteAnimationBtn.addEventListener("click", () => {
    const name = state.selectedAnimation;
    if (!name || !state.payload) {
      return;
    }

    if (!window.confirm(`Delete animation ${name}?`)) {
      return;
    }

    pushHistorySnapshot();
    delete getAnimationsObject()[name];
    const names = animationNames();
    selectAnimation(names[0] || null);
    setStatus(`Deleted ${name}`);
  });

  elements.frameList.addEventListener("change", () => {
    const selected = Array.from(elements.frameList.selectedOptions)
      .map((o) => Number(o.value))
      .filter((v) => Number.isInteger(v))
      .sort((a, b) => a - b);

    state.selectedFrameIndices = selected;
    state.selectedFrameIndex = selected.length ? selected[0] : -1;
    updateSelectAllFramesToggle();
    renderFrameEditor();
    drawMap();
    renderSelectedFramePreview();
  });

  const applyFrameEditorChange = () => {
    try {
      applyFrameEditorToSession();
    } catch (error) {
      setStatus(error.message);
    }
  };

  elements.durationInput.addEventListener("change", applyFrameEditorChange);
  elements.soundSelect.addEventListener("change", applyFrameEditorChange);
  elements.imagesInput.addEventListener("change", applyFrameEditorChange);

  const updateSaveButtonState = () => {
    updateToolbarButtons();
  };

  elements.durationInput.addEventListener("input", updateSaveButtonState);
  elements.soundSelect.addEventListener("input", updateSaveButtonState);
  elements.soundSelect.addEventListener("change", updateSaveButtonState);
  elements.imagesInput.addEventListener("input", updateSaveButtonState);

  elements.addBranchBtn.addEventListener("click", addBranch);
  elements.prevScenarioBtn.addEventListener("click", () => stepScenario(-1));
  elements.nextScenarioBtn.addEventListener("click", () => stepScenario(1));
  elements.playRandomBtn.addEventListener("click", () => {
    playAnimationPreview({ startIndex: 0 });
  });

  elements.addFrameBtn.addEventListener("click", () => {
    pushHistorySnapshot();
    const frames = getCurrentFrames();
    const insertAt =
      state.selectedFrameIndex >= 0
        ? state.selectedFrameIndex + 1
        : frames.length;
    insertFramesKeepingLinks(frames, insertAt, [createFrameFromSelectedCell()]);
    state.selectedFrameIndex = insertAt;
    state.selectedFrameIndices = [insertAt];
    renderFrameList();
    setStatus(`Inserted frame ${insertAt}`);
  });

  elements.appendFrameBtn.addEventListener("click", () => {
    pushHistorySnapshot();
    const frames = getCurrentFrames();
    frames.push(createFrameFromSelectedCell());
    state.selectedFrameIndex = frames.length - 1;
    state.selectedFrameIndices = [state.selectedFrameIndex];
    renderFrameList();
    setStatus(`Appended frame ${state.selectedFrameIndex}`);
  });

  elements.duplicateFrameBtn.addEventListener("click", () => {
    const frames = getCurrentFrames();
    const selected = (state.selectedFrameIndices || [])
      .filter((i) => Number.isInteger(i) && i >= 0 && i < frames.length)
      .sort((a, b) => a - b);

    if (!selected.length) {
      return;
    }

    pushHistorySnapshot();

    const clones = selected.map((index) => deepClone(frames[index]));
    const insertAt = selected[selected.length - 1] + 1;
    insertFramesKeepingLinks(frames, insertAt, clones);

    state.selectedFrameIndices = clones.map((_, i) => insertAt + i);
    state.selectedFrameIndex = state.selectedFrameIndices[0];
    renderFrameList();
    setStatus(`Duplicated ${clones.length} frame(s)`);
  });

  elements.removeFrameBtn.addEventListener("click", deleteSelectedFrames);

  elements.frameList.addEventListener("keydown", (event) => {
    if (event.key !== "Delete") {
      return;
    }
    event.preventDefault();
    deleteSelectedFrames();
  });

  document.addEventListener("keydown", (event) => {
    if ((!event.ctrlKey && !event.metaKey) || event.altKey) {
      return;
    }

    if (!shouldHandleFrameClipboardShortcut()) {
      return;
    }

    const key = event.key.toLowerCase();
    if (key === "c") {
      event.preventDefault();
      copySelectedFramesToClipboard();
      return;
    }

    if (key === "x") {
      event.preventDefault();
      cutSelectedFramesToClipboard();
      return;
    }

    if (key === "v") {
      event.preventDefault();
      pasteCopiedFramesFromClipboard();
    }
  });

  elements.moveUpBtn.addEventListener("click", () => {
    const frames = getCurrentFrames();
    const selected = getSelectedFrameIndices();
    if (!selected.length || selected[0] <= 0) {
      return;
    }

    pushHistorySnapshot();
    const before = frames.slice();
    selected.forEach((index) => {
      [frames[index - 1], frames[index]] = [frames[index], frames[index - 1]];
    });
    relinkAfterReorder(frames, before);
    state.selectedFrameIndices = selected.map((index) => index - 1);
    state.selectedFrameIndex = state.selectedFrameIndices[0];
    renderFrameList();
    setStatus(`Moved ${selected.length} frame(s) up`);
  });

  elements.moveDownBtn.addEventListener("click", () => {
    const frames = getCurrentFrames();
    const selected = getSelectedFrameIndices();
    if (!selected.length || selected[selected.length - 1] >= frames.length - 1) {
      return;
    }

    pushHistorySnapshot();
    const before = frames.slice();
    [...selected].reverse().forEach((index) => {
      [frames[index], frames[index + 1]] = [frames[index + 1], frames[index]];
    });
    relinkAfterReorder(frames, before);
    state.selectedFrameIndices = selected.map((index) => index + 1);
    state.selectedFrameIndex = state.selectedFrameIndices[0];
    renderFrameList();
    setStatus(`Moved ${selected.length} frame(s) down`);
  });

  elements.selectAllFramesBtn.addEventListener("click", () => {
    const frames = getCurrentFrames();
    if (!frames.length) {
      return;
    }

    const allSelected =
      new Set(
        (state.selectedFrameIndices || []).filter(
          (i) => Number.isInteger(i) && i >= 0 && i < frames.length,
        ),
      ).size === frames.length;

    if (allSelected) {
      state.selectedFrameIndices = [];
      state.selectedFrameIndex = -1;
      renderFrameList();
      setStatus(`Deselected ${frames.length} frame(s)`);
      return;
    }

    state.selectedFrameIndices = frames.map((_, i) => i);
    state.selectedFrameIndex = 0;
    renderFrameList();
    setStatus(`Selected ${frames.length} frame(s)`);
  });

  elements.invertFramesBtn.addEventListener("click", () => {
    const frames = getCurrentFrames();
    const selected = (state.selectedFrameIndices || [])
      .filter((i) => Number.isInteger(i) && i >= 0 && i < frames.length)
      .sort((a, b) => a - b);

    if (selected.length < 2) {
      setStatus("Select at least 2 frames to invert");
      return;
    }

    pushHistorySnapshot();
    const before = frames.slice();
    const reversedValues = selected.map((i) => frames[i]).reverse();
    selected.forEach((frameIndex, i) => {
      frames[frameIndex] = reversedValues[i];
    });
    relinkAfterReorder(frames, before);

    state.selectedFrameIndices = selected;
    state.selectedFrameIndex = selected[0];
    renderFrameList();
    setStatus(`Inverted ${selected.length} selected frame(s)`);
  });

  elements.clearBranchFieldsBtn.addEventListener("click", () => {
    const frames = getCurrentFrames();
    const selected = getSelectedFrameIndices();
    if (!selected.length) {
      setStatus("Select at least 1 frame");
      return;
    }

    pushHistorySnapshot();
    selected.forEach((index) => {
      clearFrameBranchFields(frames[index]);
    });

    renderFrameList();
    setStatus(`Cleared branches for ${selected.length} frame(s) in session`);
  });

  elements.replaceImageBtn.addEventListener("click", () => {
    const frame = getCurrentFrames()[state.selectedFrameIndex];
    const coords = selectedCellCoords();
    if (!frame || !coords) {
      setStatus("Select a frame and a map cell first");
      return;
    }

    pushHistorySnapshot();
    if (!Array.isArray(frame.images)) {
      frame.images = [];
    }

    if (frame.images.length === 0) {
      frame.images.push(coords);
    } else {
      frame.images[0] = coords;
    }

    renderFrameList();
    setStatus("Updated first image reference");
  });

  elements.previewSoundBtn.addEventListener("click", async () => {
    try {
      await previewSelectedSound();
    } catch (error) {
      setStatus(error.message);
    }
  });

  elements.playFrameSoundBtn.addEventListener("click", async () => {
    try {
      await previewSelectedSound();
    } catch (error) {
      setStatus(error.message);
    }
  });

  elements.stopLibrarySoundBtn.addEventListener("click", () => {
    stopCurrentAudio();
    setStatus("Stopped sound");
  });

  elements.useLibrarySoundBtn.addEventListener("click", () => {
    const soundId = state.selectedLibrarySoundId;
    if (!soundId) {
      setStatus("Select a sound first");
      return;
    }
    elements.soundSelect.value = soundId;
    setEditorTab("frames");
    try {
      applyFrameEditorToSession({
        statusText: `Updated sound for frame ${state.selectedFrameIndex} in session`,
      });
    } catch (error) {
      setStatus(error.message);
    }
  });

  elements.mapCanvas.addEventListener("click", (event) => {
    if (!state.payload) {
      return;
    }

    const rect = elements.mapCanvas.getBoundingClientRect();
    const [fw, fh] = state.payload.frameSize;
    const scaleX = elements.mapCanvas.width / rect.width;
    const scaleY = elements.mapCanvas.height / rect.height;

    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);

    const col = Math.floor(x / fw);
    const row = Math.floor(y / fh);
    if (
      col < 0 ||
      row < 0 ||
      col >= state.payload.map.cols ||
      row >= state.payload.map.rows
    ) {
      return;
    }

    state.selectedCell = row * state.payload.map.cols + col;
    renderMapMeta();
    if (state.sequenceCaptureEnabled) {
      const frames = getCurrentFrames();
      if (!frames) {
        setStatus("Select an animation first");
        drawMap();
        return;
      }

      let duration = Number(elements.durationInput.value || "100");
      if (!Number.isFinite(duration) || duration < 0) {
        duration = 100;
      }

      pushHistorySnapshot();
      const newFrame = {
        duration,
        images: [[col * fw, row * fh]],
      };
      frames.push(newFrame);
      state.selectedFrameIndex = frames.length - 1;
      state.selectedFrameIndices = [state.selectedFrameIndex];
      renderFrameList();
      setStatus(`Added sequence frame ${state.selectedFrameIndex}`);
      return;
    }

    drawMap();
  });

  updateToolbarButtons();
}

async function bootstrap() {
  bindEvents();
  setEditorTab("frames");
  updatePreviewSoundToggle();
  updatePreviewPlayToggle();
  updateSequenceCaptureToggle();

  try {
    const data = await fetchJson("/api/agents");
    state.agents = data.agents;

    elements.agentSelect.innerHTML = "";
    for (const agent of state.agents) {
      const option = document.createElement("option");
      option.value = agent;
      option.textContent = agent;
      elements.agentSelect.appendChild(option);
    }

    if (state.agents.length > 0) {
      await loadAgent(state.agents[0]);
    } else {
      setStatus("No agents found");
    }
  } catch (error) {
    setStatus(error.message);
  }
}

bootstrap();
