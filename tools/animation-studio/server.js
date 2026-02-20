const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');
const vm = require('node:vm');

const HOST = '127.0.0.1';
const PORT = Number(process.env.ANIM_STUDIO_PORT || 4177);
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const AGENTS_ROOT = path.join(REPO_ROOT, 'assets', 'agents');
const PUBLIC_ROOT = path.join(__dirname, 'public');
const WIN98_CSS_PATH = path.join(REPO_ROOT, 'node_modules', '98.css', 'dist', '98.css');
const PUBLIC_ICONS_ROOT = path.join(PUBLIC_ROOT, 'icons');
const ICONS_ROOT = path.join(REPO_ROOT, 'src', 'renderer', 'images', 'icons');

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function sendText(res, status, text, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(text),
    'Cache-Control': 'no-store',
  });
  res.end(text);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function ensureSafeAgentName(agentName) {
  if (!/^[A-Za-z0-9_\-]+$/.test(agentName)) {
    throw new Error('Invalid agent name');
  }
}

function agentPath(agentName, filename) {
  ensureSafeAgentName(agentName);
  return path.join(AGENTS_ROOT, agentName, filename);
}

function listAgents() {
  const entries = fs.readdirSync(AGENTS_ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => fs.existsSync(agentPath(name, 'agent.js')) && fs.existsSync(agentPath(name, 'map.png')))
    .sort((a, b) => a.localeCompare(b));
}

function parseDefinitionFromScript(filePath) {
  const scriptText = fs.readFileSync(filePath, 'utf8');
  let captured = null;
  const context = {
    clippy: {
      ready: (_name, definition) => {
        captured = definition;
      },
      soundsReady: () => {},
    },
  };

  vm.runInNewContext(scriptText, context, { filename: filePath });

  if (!captured || typeof captured !== 'object') {
    throw new Error(`Unable to parse definition from ${path.basename(filePath)}`);
  }

  return JSON.parse(JSON.stringify(captured));
}

function parseSoundsFromScript(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const scriptText = fs.readFileSync(filePath, 'utf8');
  let captured = {};

  const context = {
    clippy: {
      soundsReady: (_name, sounds) => {
        captured = sounds || {};
      },
      ready: () => {},
    },
  };

  vm.runInNewContext(scriptText, context, { filename: filePath });
  return captured;
}

function readPngSize(filePath) {
  const data = fs.readFileSync(filePath);
  if (data.length < 24) {
    throw new Error('Invalid PNG file');
  }

  const signature = data.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') {
    throw new Error('Expected PNG file');
  }

  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);
  return { width, height };
}

function isIdentifier(key) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}

function serializeJs(value, indentLevel = 0) {
  const indent = '  '.repeat(indentLevel);
  const nextIndent = '  '.repeat(indentLevel + 1);

  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }

    const parts = value.map((item) => `${nextIndent}${serializeJs(item, indentLevel + 1)}`);
    return `[\n${parts.join(',\n')}\n${indent}]`;
  }

  const type = typeof value;
  if (type === 'number' || type === 'boolean') {
    return String(value);
  }

  if (type === 'string') {
    return JSON.stringify(value);
  }

  if (type === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) {
      return '{}';
    }

    const parts = keys.map((key) => {
      const jsKey = isIdentifier(key) ? key : JSON.stringify(key);
      return `${nextIndent}${jsKey}: ${serializeJs(value[key], indentLevel + 1)}`;
    });

    return `{\n${parts.join(',\n')}\n${indent}}`;
  }

  return 'null';
}

function serializeAgentScript(agentName, definition) {
  return `clippy.ready(${JSON.stringify(agentName)}, ${serializeJs(definition, 0)});\n`;
}

function loadAgentPayload(agentName) {
  const agentScriptPath = agentPath(agentName, 'agent.js');
  const mapPath = agentPath(agentName, 'map.png');
  const soundsPath = agentPath(agentName, 'sounds-mp3.js');

  const definition = parseDefinitionFromScript(agentScriptPath);
  const sounds = parseSoundsFromScript(soundsPath);
  const size = readPngSize(mapPath);

  const frameSize = Array.isArray(definition.framesize) && definition.framesize.length >= 2
    ? definition.framesize
    : [1, 1];

  const cols = Math.max(1, Math.floor(size.width / Number(frameSize[0] || 1)));
  const rows = Math.max(1, Math.floor(size.height / Number(frameSize[1] || 1)));

  return {
    agent: agentName,
    frameSize,
    map: {
      width: size.width,
      height: size.height,
      cols,
      rows,
      totalFrames: cols * rows,
      src: `/assets/agents/${encodeURIComponent(agentName)}/map.png`,
    },
    sounds: Object.keys(sounds)
      .sort((a, b) => Number(a) - Number(b))
      .map((id) => ({ id: String(id) })),
    definition,
  };
}

function saveAgentDefinition(agentName, definition) {
  const filePath = agentPath(agentName, 'agent.js');
  const script = serializeAgentScript(agentName, definition);
  fs.writeFileSync(filePath, script, 'utf8');
  return { savedPath: filePath };
}

function serveFile(res, filePath, contentType) {
  if (!fs.existsSync(filePath)) {
    sendText(res, 404, 'Not found');
    return;
  }

  const data = fs.readFileSync(filePath);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': data.length,
    'Cache-Control': 'no-store',
  });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  try {
    const parsed = url.parse(req.url || '', true);
    const pathname = parsed.pathname || '/';

    if (req.method === 'GET' && pathname === '/') {
      serveFile(res, path.join(PUBLIC_ROOT, 'index.html'), 'text/html; charset=utf-8');
      return;
    }

    if (req.method === 'GET' && pathname === '/app.js') {
      serveFile(res, path.join(PUBLIC_ROOT, 'app.js'), 'application/javascript; charset=utf-8');
      return;
    }

    if (req.method === 'GET' && pathname === '/app.css') {
      serveFile(res, path.join(PUBLIC_ROOT, 'app.css'), 'text/css; charset=utf-8');
      return;
    }

    if (req.method === 'GET' && pathname === '/vendor/98.css') {
      serveFile(res, WIN98_CSS_PATH, 'text/css; charset=utf-8');
      return;
    }

    const iconMatch = pathname.match(/^\/icons\/([A-Za-z0-9_.-]+)$/);
    if (req.method === 'GET' && iconMatch) {
      const iconName = iconMatch[1];
      const localIcon = path.join(PUBLIC_ICONS_ROOT, iconName);
      const fallbackIcon = path.join(ICONS_ROOT, iconName);
      const target = fs.existsSync(localIcon) ? localIcon : fallbackIcon;
      serveFile(res, target, 'image/png');
      return;
    }

    if (req.method === 'GET' && pathname === '/api/agents') {
      sendJson(res, 200, { agents: listAgents() });
      return;
    }

    const agentMatch = pathname.match(/^\/api\/agent\/([^/]+)$/);
    if (req.method === 'GET' && agentMatch) {
      const agentName = decodeURIComponent(agentMatch[1]);
      sendJson(res, 200, loadAgentPayload(agentName));
      return;
    }

    const saveMatch = pathname.match(/^\/api\/agent\/([^/]+)\/save$/);
    if (req.method === 'POST' && saveMatch) {
      const agentName = decodeURIComponent(saveMatch[1]);
      const body = await readBody(req);
      const payload = JSON.parse(body || '{}');

      if (!payload || typeof payload !== 'object' || !payload.definition || typeof payload.definition !== 'object') {
        sendJson(res, 400, { error: 'Request must include definition object' });
        return;
      }

      const result = saveAgentDefinition(agentName, payload.definition);
      sendJson(res, 200, { ok: true, savedPath: path.relative(REPO_ROOT, result.savedPath) });
      return;
    }

    const soundMatch = pathname.match(/^\/api\/agent\/([^/]+)\/sound\/([^/]+)$/);
    if (req.method === 'GET' && soundMatch) {
      const agentName = decodeURIComponent(soundMatch[1]);
      const soundId = decodeURIComponent(soundMatch[2]);
      const sounds = parseSoundsFromScript(agentPath(agentName, 'sounds-mp3.js'));
      const uri = sounds[soundId];

      if (!uri) {
        sendJson(res, 404, { error: 'Sound not found' });
        return;
      }

      sendJson(res, 200, { id: soundId, uri });
      return;
    }

    const mapMatch = pathname.match(/^\/assets\/agents\/([^/]+)\/map\.png$/);
    if (req.method === 'GET' && mapMatch) {
      const agentName = decodeURIComponent(mapMatch[1]);
      serveFile(res, agentPath(agentName, 'map.png'), 'image/png');
      return;
    }

    sendText(res, 404, 'Not found');
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Animation Studio running at http://${HOST}:${PORT}`);
});
