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
  activeTab: 'frames',
  previewTimer: null,
  previewFrameIndex: 0,
  selectedLibrarySoundId: '',
  historyStack: [],
  previewSoundEnabled: false,
  previewPathChoice: 0,
  sequenceCaptureEnabled: false,
};

const elements = {
  agentSelect: document.getElementById('agentSelect'),
  loadAgentBtn: document.getElementById('loadAgentBtn'),
  saveBtn: document.getElementById('saveBtn'),
  undoBtn: document.getElementById('undoBtn'),
  statusText: document.getElementById('statusText'),
  animationPreviewCanvas: document.getElementById('animationPreviewCanvas'),
  toggleAnimationPlayBtn: document.getElementById('toggleAnimationPlayBtn'),
  togglePreviewSoundBtn: document.getElementById('togglePreviewSoundBtn'),
  previewFrameText: document.getElementById('previewFrameText'),
  framesTabBtn: document.getElementById('framesTabBtn'),
  soundsTabBtn: document.getElementById('soundsTabBtn'),
  framesTabContent: document.getElementById('framesTabContent'),
  soundsTabContent: document.getElementById('soundsTabContent'),
  animationSearch: document.getElementById('animationSearch'),
  animationList: document.getElementById('animationList'),
  newAnimationBtn: document.getElementById('newAnimationBtn'),
  renameAnimationBtn: document.getElementById('renameAnimationBtn'),
  deleteAnimationBtn: document.getElementById('deleteAnimationBtn'),
  mapMeta: document.getElementById('mapMeta'),
  selectedCell: document.getElementById('selectedCell'),
  zoomOutBtn: document.getElementById('zoomOutBtn'),
  zoomResetBtn: document.getElementById('zoomResetBtn'),
  zoomInBtn: document.getElementById('zoomInBtn'),
  zoomLabel: document.getElementById('zoomLabel'),
  sequenceCaptureBtn: document.getElementById('sequenceCaptureBtn'),
  mapCanvas: document.getElementById('mapCanvas'),
  appendFrameBtn: document.getElementById('appendFrameBtn'),
  replaceImageBtn: document.getElementById('replaceImageBtn'),
  previewSoundBtn: document.getElementById('previewSoundBtn'),
  soundButtonGrid: document.getElementById('soundButtonGrid'),
  stopLibrarySoundBtn: document.getElementById('stopLibrarySoundBtn'),
  useLibrarySoundBtn: document.getElementById('useLibrarySoundBtn'),
  selectedLibrarySoundText: document.getElementById('selectedLibrarySoundText'),
  frameList: document.getElementById('frameList'),
  durationInput: document.getElementById('durationInput'),
  soundSelect: document.getElementById('soundSelect'),
  playFrameSoundBtn: document.getElementById('playFrameSoundBtn'),
  exitBranchInput: document.getElementById('exitBranchInput'),
  prevBranchBtn: document.getElementById('prevBranchBtn'),
  nextBranchBtn: document.getElementById('nextBranchBtn'),
  branchPositionText: document.getElementById('branchPositionText'),
  branchFrameIndexInput: document.getElementById('branchFrameIndexInput'),
  weightInput: document.getElementById('weightInput'),
  imagesInput: document.getElementById('imagesInput'),
  addFrameBtn: document.getElementById('addFrameBtn'),
  duplicateFrameBtn: document.getElementById('duplicateFrameBtn'),
  removeFrameBtn: document.getElementById('removeFrameBtn'),
  moveUpBtn: document.getElementById('moveUpBtn'),
  moveDownBtn: document.getElementById('moveDownBtn'),
  selectAllFramesBtn: document.getElementById('selectAllFramesBtn'),
  invertFramesBtn: document.getElementById('invertFramesBtn'),
  applyFrameBtn: document.getElementById('applyFrameBtn'),
};

const mapCtx = elements.mapCanvas.getContext('2d');
const previewCtx = elements.animationPreviewCanvas.getContext('2d');

function setStatus(text) {
  elements.statusText.textContent = text;
}

function setEditorTab(tab) {
  state.activeTab = tab;
  const showFrames = tab === 'frames';

  elements.framesTabBtn.setAttribute('aria-selected', showFrames ? 'true' : 'false');
  elements.soundsTabBtn.setAttribute('aria-selected', showFrames ? 'false' : 'true');
  elements.framesTabContent.classList.toggle('active-tab', showFrames);
  elements.soundsTabContent.classList.toggle('active-tab', !showFrames);
}

function updatePreviewSoundToggle() {
  const enabled = state.previewSoundEnabled;
  elements.togglePreviewSoundBtn.textContent = enabled ? 'Sound: On' : 'Sound: Off';
  elements.togglePreviewSoundBtn.title = enabled ? 'Preview sound on' : 'Preview sound off';
}

function updatePreviewPlayToggle() {
  const isPlaying = Boolean(state.previewTimer);
  elements.toggleAnimationPlayBtn.textContent = isPlaying ? 'Stop' : 'Play';
  elements.toggleAnimationPlayBtn.title = isPlaying ? 'Stop preview' : 'Play preview';
}

function updateSequenceCaptureToggle() {
  const enabled = state.sequenceCaptureEnabled;
  elements.sequenceCaptureBtn.textContent = enabled ? 'Seq Add: On' : 'Seq Add: Off';
  elements.sequenceCaptureBtn.title = enabled
    ? 'Click map cells to append frames in order'
    : 'Enable to append frames while clicking map cells';
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

function getPreviewPathOptions(frameIndex) {
  const frames = getCurrentFrames();
  if (!frames.length || frameIndex < 0 || frameIndex >= frames.length) {
    return [];
  }

  const frame = frames[frameIndex] || {};
  const options = [];
  const seen = new Set();

  const pushOption = (targetIndex, kind, branchIndex = null) => {
    if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= frames.length) {
      return;
    }
    const key = `${kind}:${targetIndex}:${branchIndex ?? ''}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    options.push({ frameIndex: targetIndex, kind, branchIndex });
  };

  const branches = Array.isArray(frame?.branching?.branches) ? frame.branching.branches : [];
  for (let i = 0; i < branches.length; i += 1) {
    const branch = branches[i];
    const target = Number(branch?.frameIndex);
    const weight = Number(branch?.weight);
    if (Number.isInteger(target) && Number.isFinite(weight) && weight > 0) {
      pushOption(target, 'branch', i);
    }
  }

  if (Number.isInteger(frame.exitBranch)) {
    pushOption(frame.exitBranch, 'exit');
  } else if (frames.length > 0) {
    pushOption((frameIndex + 1) % frames.length, 'next');
  }

  return options;
}

function getAnimationPathChoiceCount() {
  const frames = getCurrentFrames();
  let maxOptions = 1;
  for (let i = 0; i < frames.length; i += 1) {
    const count = getPreviewPathOptions(i).length;
    if (count > maxOptions) {
      maxOptions = count;
    }
  }
  return Math.max(1, maxOptions);
}

function getActiveEditableBranchIndex() {
  const frame = getCurrentFrames()[state.selectedFrameIndex];
  const branches = Array.isArray(frame?.branching?.branches) ? frame.branching.branches : [];
  if (!branches.length) {
    return 0;
  }

  const options = getPreviewPathOptions(state.selectedFrameIndex);
  const choice = Number(state.previewPathChoice);
  if (Number.isInteger(choice) && choice >= 0 && choice < options.length) {
    const selectedOption = options[choice];
    if (selectedOption?.kind === 'branch' && Number.isInteger(selectedOption.branchIndex)) {
      return Math.max(0, Math.min(selectedOption.branchIndex, branches.length - 1));
    }
  }

  return 0;
}

function renderPreviewPathSelector() {
  const count = getAnimationPathChoiceCount();

  let choice = Number(state.previewPathChoice);
  if (!Number.isInteger(choice) || choice < 0 || choice >= count) {
    choice = 0;
    state.previewPathChoice = 0;
  }

  elements.branchPositionText.textContent = `Branch ${choice + 1}/${count}`;
  elements.prevBranchBtn.disabled = count <= 1;
  elements.nextBranchBtn.disabled = count <= 1;
  elements.prevBranchBtn.style.visibility = 'visible';
  elements.nextBranchBtn.style.visibility = 'visible';
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

function renderAnimationPreview(frameIndex = 0) {
  if (!state.payload) {
    return;
  }

  const [fw, fh] = state.payload.frameSize;
  const frames = getCurrentFrames();
  const bounded = Math.max(0, Math.min(frameIndex, Math.max(0, frames.length - 1)));
  state.previewFrameIndex = bounded;

  elements.animationPreviewCanvas.width = fw;
  elements.animationPreviewCanvas.height = fh;
  previewCtx.clearRect(0, 0, fw, fh);
  previewCtx.fillStyle = '#1f1f1f';
  previewCtx.fillRect(0, 0, fw, fh);

  if (!frames.length || !state.mapImage) {
    elements.previewFrameText.textContent = 'Frame: -';
    return;
  }

  const frame = frames[bounded];
  const coordsList = getFrameImageCoordsList(frame);
  for (const coords of coordsList) {
    previewCtx.drawImage(state.mapImage, coords.x, coords.y, fw, fh, 0, 0, fw, fh);
  }

  elements.previewFrameText.textContent = `Frame: ${bounded}`;
}

function playAnimationPreview(options = {}) {
  const frames = getCurrentFrames();
  if (!frames.length) {
    stopAnimationPreview();
    setStatus('No frames in this animation');
    return;
  }

  const requestedStart = Number(options.startIndex);
  const startIndex = Number.isInteger(requestedStart)
    ? Math.max(0, Math.min(requestedStart, frames.length - 1))
    : Math.max(0, Math.min(state.previewFrameIndex, frames.length - 1));

  stopAnimationPreview();
  let cursor = startIndex;

  const getNextFrameIndex = (currentIndex) => {
    const pathOptions = getPreviewPathOptions(currentIndex);
    if (pathOptions.length > 1) {
      const choice = Number(state.previewPathChoice);
      const boundedChoice = Number.isInteger(choice)
        ? Math.max(0, Math.min(choice, pathOptions.length - 1))
        : 0;
      return pathOptions[boundedChoice].frameIndex;
    }

    const frame = frames[currentIndex] || {};
    const branches = Array.isArray(frame?.branching?.branches) ? frame.branching.branches : [];
    const weightedBranches = branches
      .map((branch) => ({
        frameIndex: Number(branch?.frameIndex),
        weight: Number(branch?.weight),
      }))
      .filter((branch) => (
        Number.isInteger(branch.frameIndex)
        && branch.frameIndex >= 0
        && branch.frameIndex < frames.length
        && Number.isFinite(branch.weight)
        && branch.weight > 0
      ));

    if (weightedBranches.length) {
      const roll = Math.random() * 100;
      let cumulative = 0;
      for (const branch of weightedBranches) {
        cumulative += branch.weight;
        if (roll < cumulative) {
          return branch.frameIndex;
        }
      }
    }

    if (Number.isInteger(frame.exitBranch)) {
      if (frame.exitBranch >= 0 && frame.exitBranch < frames.length) {
        return frame.exitBranch;
      }
      return 0;
    }
    return (currentIndex + 1) % frames.length;
  };

  const tick = () => {
    const frame = frames[cursor] || {};
    renderAnimationPreview(cursor);
    if (state.previewSoundEnabled && frame.sound) {
      playSoundById(String(frame.sound), { silent: true }).catch(() => {});
    }
    let duration = Number(frame.duration);
    if (!Number.isFinite(duration) || duration <= 0) {
      duration = 100;
    }

    cursor = getNextFrameIndex(cursor);
    state.previewTimer = setTimeout(tick, duration);
    updatePreviewPlayToggle();
  };

  tick();
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function pushHistorySnapshot() {
  if (!state.payload?.definition) {
    return;
  }

  state.historyStack.push({
    definition: deepClone(state.payload.definition),
    selectedAnimation: state.selectedAnimation,
    selectedFrameIndex: state.selectedFrameIndex,
    selectedFrameIndices: deepClone(state.selectedFrameIndices),
    selectedCell: state.selectedCell,
    previewFrameIndex: state.previewFrameIndex,
  });

  if (state.historyStack.length > 100) {
    state.historyStack.shift();
  }
}

function restoreSnapshot(snapshot) {
  state.payload.definition = deepClone(snapshot.definition);
  state.selectedAnimation = snapshot.selectedAnimation;
  if (!getAnimationsObject()[state.selectedAnimation]) {
    state.selectedAnimation = animationNames().at(0) || null;
  }

  const frames = getCurrentFrames();
  state.selectedFrameIndex = Math.max(0, Math.min(snapshot.selectedFrameIndex, Math.max(0, frames.length - 1)));
  state.selectedFrameIndices = Array.isArray(snapshot.selectedFrameIndices)
    ? snapshot.selectedFrameIndices.filter((i) => Number.isInteger(i) && i >= 0 && i < frames.length)
    : [];
  if (!state.selectedFrameIndices.length && state.selectedFrameIndex >= 0 && frames.length > 0) {
    state.selectedFrameIndices = [state.selectedFrameIndex];
  }
  state.selectedCell = snapshot.selectedCell;
  state.previewFrameIndex = Math.max(0, Number(snapshot.previewFrameIndex) || 0);
  state.previewPathChoice = 0;

  renderAnimationList();
  renderFrameList();
  renderMapMeta();
  drawMap();
  renderAnimationPreview(state.previewFrameIndex);
}

function frameToCell(frame) {
  if (!frame || !Array.isArray(frame.images) || frame.images.length === 0) {
    return null;
  }
  const first = frame.images[0];
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

  mapCtx.strokeStyle = 'rgba(255,255,255,0.23)';
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
    mapCtx.strokeStyle = '#00ff55';
    mapCtx.lineWidth = 2;
    mapCtx.strokeRect(selectedFrameCell.x + 1, selectedFrameCell.y + 1, fw - 2, fh - 2);
  }

  if (state.selectedCell) {
    const cell = cellIndexToCoords(state.selectedCell);
    mapCtx.strokeStyle = '#ffea00';
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
    elements.mapMeta.textContent = '';
    elements.selectedCell.textContent = '';
    return;
  }

  const map = state.payload.map;
  const [fw, fh] = state.payload.frameSize;
  elements.mapMeta.textContent = `Map ${map.width}x${map.height}, Grid ${map.cols}x${map.rows}, Frame ${fw}x${fh}`;

  if (state.selectedCell === null) {
    elements.selectedCell.textContent = 'Selected: none';
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
  list.innerHTML = '';
  const query = elements.animationSearch.value.trim().toLowerCase();

  for (const name of animationNames()) {
    if (query && !name.toLowerCase().includes(query)) {
      continue;
    }
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    if (name === state.selectedAnimation) {
      option.selected = true;
    }
    list.appendChild(option);
  }
}

function renderSoundOptions() {
  elements.soundSelect.innerHTML = '';

  const none = document.createElement('option');
  none.value = '';
  none.textContent = '(none)';
  elements.soundSelect.appendChild(none);

  if (!state.payload) {
    return;
  }

  for (const sound of state.payload.sounds) {
    const option = document.createElement('option');
    option.value = sound.id;
    option.textContent = sound.id;
    elements.soundSelect.appendChild(option);
  }
}

function renderSoundLibrary() {
  elements.soundButtonGrid.innerHTML = '';
  state.selectedLibrarySoundId = '';
  elements.selectedLibrarySoundText.textContent = 'Selected: (none)';
  if (!state.payload) {
    return;
  }

  for (const sound of state.payload.sounds) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.soundId = sound.id;
    button.textContent = `${sound.id} >`;
    button.addEventListener('click', async () => {
      state.selectedLibrarySoundId = sound.id;
      elements.selectedLibrarySoundText.textContent = `Selected: ${sound.id}`;
      for (const el of elements.soundButtonGrid.querySelectorAll('button')) {
        el.classList.toggle('active', el === button);
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
  const sound = frame?.sound ? ` sound:${frame.sound}` : '';
  const branch = Number.isInteger(frame?.exitBranch) ? ` ->${frame.exitBranch}` : '';
  const branches = Array.isArray(frame?.branching?.branches) ? frame.branching.branches : [];
  const branchLabels = branches
    .map((item) => ({
      frameIndex: Number(item?.frameIndex),
      weight: Number(item?.weight),
    }))
    .filter((item) => Number.isInteger(item.frameIndex) && item.frameIndex >= 0 && Number.isFinite(item.weight) && item.weight > 0)
    .map((item) => `${item.weight}@${item.frameIndex}`);
  const weighted = branchLabels.length ? ` w:${branchLabels.join('|')}` : '';
  const img = imageCell ? ` #${imageCell.index}` : ' n/a';
  return `${index.toString().padStart(3, '0')} | ${duration}ms | ${img}${branch}${weighted}${sound}`;
}

function renderFrameList() {
  const list = elements.frameList;
  list.innerHTML = '';

  const frames = getCurrentFrames();
  if (state.selectedFrameIndex >= frames.length) {
    state.selectedFrameIndex = frames.length - 1;
  }
  state.selectedFrameIndices = (state.selectedFrameIndices || [])
    .filter((i) => Number.isInteger(i) && i >= 0 && i < frames.length);
  if (!state.selectedFrameIndices.length && state.selectedFrameIndex >= 0 && frames.length > 0) {
    state.selectedFrameIndices = [state.selectedFrameIndex];
  }

  frames.forEach((frame, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = describeFrame(frame, index);
    if (state.selectedFrameIndices.includes(index)) {
      option.selected = true;
    }
    list.appendChild(option);
  });

  renderFrameEditor();
  renderPreviewPathSelector();
  drawMap();
  renderAnimationPreview(state.previewFrameIndex);
}

function formatImages(images) {
  if (!Array.isArray(images)) {
    return '';
  }
  return images
    .filter((image) => Array.isArray(image) && image.length >= 2)
    .map((image) => `${image[0]},${image[1]}`)
    .join('\n');
}

function renderFrameEditor() {
  const frame = getCurrentFrames()[state.selectedFrameIndex];

  if (!frame) {
    elements.durationInput.value = '';
    elements.soundSelect.value = '';
    elements.exitBranchInput.value = '';
    elements.branchFrameIndexInput.value = '';
    elements.weightInput.value = '';
    elements.imagesInput.value = '';
    renderPreviewPathSelector();
    return;
  }

  elements.durationInput.value = Number(frame.duration ?? 0);
  elements.soundSelect.value = frame.sound ? String(frame.sound) : '';
  elements.exitBranchInput.value = Number.isInteger(frame.exitBranch) ? String(frame.exitBranch) : '';
  const branches = Array.isArray(frame?.branching?.branches) ? frame.branching.branches : [];
  const editableBranchIndex = getActiveEditableBranchIndex();
  const activeBranch = branches[editableBranchIndex] || null;
  elements.branchFrameIndexInput.value = Number.isInteger(activeBranch?.frameIndex) ? String(activeBranch.frameIndex) : '';
  elements.weightInput.value = Number.isFinite(Number(activeBranch?.weight)) ? String(Number(activeBranch.weight)) : '';
  elements.imagesInput.value = formatImages(frame.images);
  renderPreviewPathSelector();
}

function parseImages(text) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const images = [];
  for (const line of lines) {
    const normalized = line.replace(/\s+/g, '');
    const [xRaw, yRaw] = normalized.split(',');
    const x = Number(xRaw);
    const y = Number(yRaw);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(`Invalid image coordinate: ${line}`);
    }
    images.push([x, y]);
  }

  return images;
}

function applyFrameEditor() {
  const frame = getCurrentFrames()[state.selectedFrameIndex];
  if (!frame) {
    return;
  }

  const duration = Number(elements.durationInput.value || '0');
  if (!Number.isFinite(duration) || duration < 0) {
    throw new Error('Duration must be 0 or higher');
  }

  frame.duration = duration;

  const sound = elements.soundSelect.value.trim();
  if (sound) {
    frame.sound = sound;
  } else {
    delete frame.sound;
  }

  const exitBranchRaw = elements.exitBranchInput.value.trim();
  if (exitBranchRaw) {
    const exitBranch = Number(exitBranchRaw);
    if (!Number.isInteger(exitBranch) || exitBranch < 0) {
      throw new Error('Exit Branch must be a whole number >= 0');
    }
    frame.exitBranch = exitBranch;
  } else {
    delete frame.exitBranch;
  }

  const branchFrameIndexRaw = elements.branchFrameIndexInput.value.trim();
  const weightRaw = elements.weightInput.value.trim();
  const hasBranchFrameIndex = branchFrameIndexRaw.length > 0;
  const hasWeight = weightRaw.length > 0;
  const editableBranchIndex = getActiveEditableBranchIndex();

  if (!hasBranchFrameIndex && !hasWeight) {
    if (frame.branching && Array.isArray(frame.branching.branches) && frame.branching.branches.length > editableBranchIndex) {
      frame.branching.branches.splice(editableBranchIndex, 1);
      if (frame.branching.branches.length === 0) {
        delete frame.branching;
      }
    }
  } else {
    if (!hasBranchFrameIndex || !hasWeight) {
      throw new Error('Set both Branch Frame Index and Weight, or clear both to remove branch');
    }

    const branchFrameIndex = Number(branchFrameIndexRaw);
    if (!Number.isInteger(branchFrameIndex) || branchFrameIndex < 0) {
      throw new Error('Branch Frame Index must be a whole number >= 0');
    }

    const weight = Number(weightRaw);
    if (!Number.isInteger(weight) || weight < 0 || weight > 100) {
      throw new Error('Weight must be a whole number between 0 and 100');
    }

    if (!frame.branching || typeof frame.branching !== 'object') {
      frame.branching = {};
    }
    if (!Array.isArray(frame.branching.branches)) {
      frame.branching.branches = [];
    }
    while (frame.branching.branches.length <= editableBranchIndex) {
      frame.branching.branches.push({});
    }
    if (!frame.branching.branches[editableBranchIndex] || typeof frame.branching.branches[editableBranchIndex] !== 'object') {
      frame.branching.branches[editableBranchIndex] = {};
    }

    frame.branching.branches[editableBranchIndex].frameIndex = branchFrameIndex;
    frame.branching.branches[editableBranchIndex].weight = weight;
  }

  frame.images = parseImages(elements.imagesInput.value);

  renderFrameList();
  setStatus(`Applied edits to frame ${state.selectedFrameIndex}`);
}

function selectAnimation(name) {
  const wasPlaying = Boolean(state.previewTimer);
  const previousPreviewFrameIndex = state.previewFrameIndex;
  stopAnimationPreview();
  state.previewPathChoice = 0;
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
  state.previewPathChoice = 0;
  state.sequenceCaptureEnabled = false;
  state.selectedCell = null;
  state.mapZoom = 1;
  state.previewSoundEnabled = false;
  state.soundCache.clear();
  state.historyStack = [];

  state.mapImage = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load map image'));
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
      applyFrameEditor();
    }
  } catch (error) {
    setStatus(error.message);
    return;
  }

  setStatus('Saving...');
  const result = await fetchJson(`/api/agent/${encodeURIComponent(state.currentAgent)}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ definition: state.payload.definition }),
  });

  // Read back from disk after save so UI state always matches the actual file content.
  const reloaded = await fetchJson(`/api/agent/${encodeURIComponent(state.currentAgent)}`);
  if (!reloaded?.definition || typeof reloaded.definition !== 'object') {
    throw new Error('Save verification failed: could not reload agent definition');
  }
  state.payload.definition = reloaded.definition;
  if (!getAnimationsObject()[state.selectedAnimation]) {
    state.selectedAnimation = animationNames().at(0) || null;
  }
  const frames = getCurrentFrames();
  if (frames.length === 0) {
    state.selectedFrameIndex = -1;
    state.selectedFrameIndices = [];
  } else {
    state.selectedFrameIndex = Math.max(0, Math.min(state.selectedFrameIndex, frames.length - 1));
    state.selectedFrameIndices = [state.selectedFrameIndex];
  }
  renderAnimationList();
  renderFrameList();

  const savedPath = result?.savedPath || `assets/agents/${state.currentAgent}/agent.js`;
  setStatus(`Saved: ${savedPath}`);
}

async function applyAndPersistFrame() {
  pushHistorySnapshot();
  try {
    applyFrameEditor();
  } catch (error) {
    state.historyStack.pop();
    throw error;
  }
  await saveAgent({ applyCurrentFrame: false });
}

async function undoLastChange() {
  if (!state.historyStack.length) {
    setStatus('Nothing to undo');
    return;
  }

  stopAnimationPreview();
  const snapshot = state.historyStack.pop();
  restoreSnapshot(snapshot);
  await saveAgent({ applyCurrentFrame: false });
  playAnimationPreview();
  setStatus('Undid last change');
}

async function playSoundById(soundId, options = {}) {
  const { silent = false } = options;
  if (!soundId || !state.currentAgent) {
    if (!silent) {
      setStatus('Pick a sound first');
    }
    return;
  }

  let uri = state.soundCache.get(soundId);
  if (!uri) {
    const data = await fetchJson(`/api/agent/${encodeURIComponent(state.currentAgent)}/sound/${encodeURIComponent(soundId)}`);
    uri = data.uri;
    state.soundCache.set(soundId, uri);
  }

  stopCurrentAudio();
  const audio = new Audio(uri);
  state.currentAudio = audio;
  audio.addEventListener('ended', () => {
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
  elements.framesTabBtn.addEventListener('click', () => {
    setEditorTab('frames');
  });

  elements.soundsTabBtn.addEventListener('click', () => {
    setEditorTab('sounds');
  });

  elements.togglePreviewSoundBtn.addEventListener('click', () => {
    state.previewSoundEnabled = !state.previewSoundEnabled;
    updatePreviewSoundToggle();
    if (!state.previewSoundEnabled) {
      stopCurrentAudio();
    }
  });

  elements.zoomOutBtn.addEventListener('click', () => {
    setMapZoom(state.mapZoom - 0.25);
  });

  elements.zoomInBtn.addEventListener('click', () => {
    setMapZoom(state.mapZoom + 0.25);
  });

  elements.zoomResetBtn.addEventListener('click', () => {
    setMapZoom(1);
  });

  elements.sequenceCaptureBtn.addEventListener('click', () => {
    state.sequenceCaptureEnabled = !state.sequenceCaptureEnabled;
    updateSequenceCaptureToggle();
    setStatus(state.sequenceCaptureEnabled ? 'Sequence add enabled' : 'Sequence add disabled');
  });

  elements.loadAgentBtn.addEventListener('click', async () => {
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

  elements.saveBtn.addEventListener('click', async () => {
    try {
      await saveAgent();
    } catch (error) {
      setStatus(error.message);
    }
  });

  elements.undoBtn.addEventListener('click', async () => {
    try {
      await undoLastChange();
    } catch (error) {
      setStatus(error.message);
    }
  });

  elements.animationSearch.addEventListener('input', renderAnimationList);

  elements.animationList.addEventListener('change', () => {
    const name = elements.animationList.value;
    if (!name) {
      return;
    }
    selectAnimation(name);
  });

  elements.toggleAnimationPlayBtn.addEventListener('click', () => {
    if (state.previewTimer) {
      stopAnimationPreview();
      renderAnimationPreview(state.previewFrameIndex);
      return;
    }
    playAnimationPreview();
  });

  elements.newAnimationBtn.addEventListener('click', () => {
    if (!state.payload) {
      return;
    }

    const name = window.prompt('Animation name');
    if (!name) {
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(name)) {
      setStatus('Use only letters, numbers, and underscore for animation names');
      return;
    }

    const animations = getAnimationsObject();
    if (animations[name]) {
      setStatus('Animation already exists');
      return;
    }

    pushHistorySnapshot();
    animations[name] = { frames: [] };
    selectAnimation(name);
    setStatus(`Created ${name}`);
  });

  elements.renameAnimationBtn.addEventListener('click', () => {
    if (!state.payload || !state.selectedAnimation) {
      return;
    }

    const currentName = state.selectedAnimation;
    const nextName = window.prompt('New animation name', currentName);
    if (!nextName) {
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(nextName)) {
      setStatus('Use only letters, numbers, and underscore for animation names');
      return;
    }
    if (nextName === currentName) {
      setStatus('Name unchanged');
      return;
    }

    const animations = getAnimationsObject();
    if (animations[nextName]) {
      setStatus('Animation name already exists');
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

  elements.deleteAnimationBtn.addEventListener('click', () => {
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

  elements.frameList.addEventListener('change', () => {
    const selected = Array.from(elements.frameList.selectedOptions)
      .map((o) => Number(o.value))
      .filter((v) => Number.isInteger(v))
      .sort((a, b) => a - b);

    state.selectedFrameIndices = selected;
    state.selectedFrameIndex = selected.length ? selected[0] : Number(elements.frameList.value);
    renderFrameEditor();
    drawMap();
    renderAnimationPreview(state.selectedFrameIndex);
  });

  elements.applyFrameBtn.addEventListener('click', () => {
    (async () => {
      try {
        await applyAndPersistFrame();
      } catch (error) {
        setStatus(error.message);
      }
    })();
  });

  const runApplyAndPersist = () => {
    (async () => {
      try {
        await applyAndPersistFrame();
      } catch (error) {
        setStatus(error.message);
      }
    })();
  };

  const applyOnEnter = (event) => {
    if (event.key !== 'Enter') {
      return;
    }
    event.preventDefault();
    runApplyAndPersist();
  };

  const applyOnTextareaEnter = (event) => {
    if (event.key !== 'Enter') {
      return;
    }
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }
    event.preventDefault();
    runApplyAndPersist();
  };

  elements.durationInput.addEventListener('keydown', applyOnEnter);
  elements.exitBranchInput.addEventListener('keydown', applyOnEnter);
  elements.branchFrameIndexInput.addEventListener('keydown', applyOnEnter);
  elements.weightInput.addEventListener('keydown', applyOnEnter);
  elements.imagesInput.addEventListener('keydown', applyOnTextareaEnter);

  elements.prevBranchBtn.addEventListener('click', () => {
    const count = getAnimationPathChoiceCount();
    if (count <= 1) {
      return;
    }
    const current = Number(state.previewPathChoice);
    const currentIndex = Number.isInteger(current) ? current : 0;
    state.previewPathChoice = (currentIndex - 1 + count) % count;
    renderFrameEditor();
    if (state.previewTimer) {
      playAnimationPreview({ startIndex: 0 });
    } else {
      renderAnimationPreview(state.selectedFrameIndex);
    }
  });

  elements.nextBranchBtn.addEventListener('click', () => {
    const count = getAnimationPathChoiceCount();
    if (count <= 1) {
      return;
    }
    const current = Number(state.previewPathChoice);
    const currentIndex = Number.isInteger(current) ? current : 0;
    state.previewPathChoice = (currentIndex + 1) % count;
    renderFrameEditor();
    if (state.previewTimer) {
      playAnimationPreview({ startIndex: 0 });
    } else {
      renderAnimationPreview(state.selectedFrameIndex);
    }
  });

  elements.addFrameBtn.addEventListener('click', () => {
    pushHistorySnapshot();
    const frames = getCurrentFrames();
    const insertAt = state.selectedFrameIndex >= 0 ? state.selectedFrameIndex + 1 : frames.length;
    frames.splice(insertAt, 0, createFrameFromSelectedCell());
    state.selectedFrameIndex = insertAt;
    state.selectedFrameIndices = [insertAt];
    renderFrameList();
    setStatus(`Inserted frame ${insertAt}`);
  });

  elements.appendFrameBtn.addEventListener('click', () => {
    pushHistorySnapshot();
    const frames = getCurrentFrames();
    frames.push(createFrameFromSelectedCell());
    state.selectedFrameIndex = frames.length - 1;
    state.selectedFrameIndices = [state.selectedFrameIndex];
    renderFrameList();
    setStatus(`Appended frame ${state.selectedFrameIndex}`);
  });

  elements.duplicateFrameBtn.addEventListener('click', () => {
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
    frames.splice(insertAt, 0, ...clones);

    state.selectedFrameIndices = clones.map((_, i) => insertAt + i);
    state.selectedFrameIndex = state.selectedFrameIndices[0];
    renderFrameList();
    setStatus(`Duplicated ${clones.length} frame(s)`);
  });

  elements.removeFrameBtn.addEventListener('click', () => {
    const frames = getCurrentFrames();
    if (state.selectedFrameIndex < 0 || state.selectedFrameIndex >= frames.length) {
      return;
    }

    pushHistorySnapshot();
    frames.splice(state.selectedFrameIndex, 1);
    state.selectedFrameIndex = Math.max(0, state.selectedFrameIndex - 1);
    state.selectedFrameIndices = [state.selectedFrameIndex];
    renderFrameList();
    setStatus('Frame removed');
  });

  elements.frameList.addEventListener('keydown', (event) => {
    if (event.key !== 'Delete') {
      return;
    }
    event.preventDefault();

    const frames = getCurrentFrames();
    const selected = Array.from(new Set((state.selectedFrameIndices || [])
      .filter((i) => Number.isInteger(i) && i >= 0 && i < frames.length)))
      .sort((a, b) => b - a);

    if (!selected.length) {
      return;
    }

    pushHistorySnapshot();
    for (const index of selected) {
      frames.splice(index, 1);
    }

    if (frames.length === 0) {
      state.selectedFrameIndex = -1;
      state.selectedFrameIndices = [];
    } else {
      const nextIndex = Math.max(0, Math.min(selected[selected.length - 1], frames.length - 1));
      state.selectedFrameIndex = nextIndex;
      state.selectedFrameIndices = [nextIndex];
    }

    renderFrameList();
    setStatus(`Removed ${selected.length} frame(s)`);
  });

  elements.moveUpBtn.addEventListener('click', () => {
    const frames = getCurrentFrames();
    const i = state.selectedFrameIndex;
    if (i <= 0 || i >= frames.length) {
      return;
    }

    pushHistorySnapshot();
    [frames[i - 1], frames[i]] = [frames[i], frames[i - 1]];
    state.selectedFrameIndex = i - 1;
    state.selectedFrameIndices = [state.selectedFrameIndex];
    renderFrameList();
  });

  elements.moveDownBtn.addEventListener('click', () => {
    const frames = getCurrentFrames();
    const i = state.selectedFrameIndex;
    if (i < 0 || i >= frames.length - 1) {
      return;
    }

    pushHistorySnapshot();
    [frames[i], frames[i + 1]] = [frames[i + 1], frames[i]];
    state.selectedFrameIndex = i + 1;
    state.selectedFrameIndices = [state.selectedFrameIndex];
    renderFrameList();
  });

  elements.selectAllFramesBtn.addEventListener('click', () => {
    const frames = getCurrentFrames();
    if (!frames.length) {
      return;
    }
    state.selectedFrameIndices = frames.map((_, i) => i);
    state.selectedFrameIndex = 0;
    renderFrameList();
    setStatus(`Selected ${frames.length} frame(s)`);
  });

  elements.invertFramesBtn.addEventListener('click', () => {
    const frames = getCurrentFrames();
    const selected = (state.selectedFrameIndices || [])
      .filter((i) => Number.isInteger(i) && i >= 0 && i < frames.length)
      .sort((a, b) => a - b);

    if (selected.length < 2) {
      setStatus('Select at least 2 frames to invert');
      return;
    }

    pushHistorySnapshot();
    const reversedValues = selected.map((i) => frames[i]).reverse();
    selected.forEach((frameIndex, i) => {
      frames[frameIndex] = reversedValues[i];
    });

    state.selectedFrameIndices = selected;
    state.selectedFrameIndex = selected[0];
    renderFrameList();
    setStatus(`Inverted ${selected.length} selected frame(s)`);
  });

  elements.replaceImageBtn.addEventListener('click', () => {
    const frame = getCurrentFrames()[state.selectedFrameIndex];
    const coords = selectedCellCoords();
    if (!frame || !coords) {
      setStatus('Select a frame and a map cell first');
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
    setStatus('Updated first image reference');
  });

  elements.previewSoundBtn.addEventListener('click', async () => {
    try {
      await previewSelectedSound();
    } catch (error) {
      setStatus(error.message);
    }
  });

  elements.playFrameSoundBtn.addEventListener('click', async () => {
    try {
      await previewSelectedSound();
    } catch (error) {
      setStatus(error.message);
    }
  });

  elements.stopLibrarySoundBtn.addEventListener('click', () => {
    stopCurrentAudio();
    setStatus('Stopped sound');
  });

  elements.useLibrarySoundBtn.addEventListener('click', () => {
    const soundId = state.selectedLibrarySoundId;
    if (!soundId) {
      setStatus('Select a sound first');
      return;
    }
    elements.soundSelect.value = soundId;
    setEditorTab('frames');
    setStatus(`Selected sound ${soundId} for frame editor`);
  });

  elements.mapCanvas.addEventListener('click', (event) => {
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
    if (col < 0 || row < 0 || col >= state.payload.map.cols || row >= state.payload.map.rows) {
      return;
    }

    state.selectedCell = row * state.payload.map.cols + col;
    renderMapMeta();
    if (state.sequenceCaptureEnabled) {
      const frames = getCurrentFrames();
      if (!frames) {
        setStatus('Select an animation first');
        drawMap();
        return;
      }

      let duration = Number(elements.durationInput.value || '100');
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
}

async function bootstrap() {
  bindEvents();
  setEditorTab('frames');
  updatePreviewSoundToggle();
  updatePreviewPlayToggle();
  updateSequenceCaptureToggle();

  try {
    const data = await fetchJson('/api/agents');
    state.agents = data.agents;

    elements.agentSelect.innerHTML = '';
    for (const agent of state.agents) {
      const option = document.createElement('option');
      option.value = agent;
      option.textContent = agent;
      elements.agentSelect.appendChild(option);
    }

    if (state.agents.length > 0) {
      await loadAgent(state.agents[0]);
    } else {
      setStatus('No agents found');
    }
  } catch (error) {
    setStatus(error.message);
  }
}

bootstrap();
