import bonziAgentScript from "../../assets/agents/Bonzi/agent.js?raw";
import bonziSoundScript from "../../assets/agents/Bonzi/sounds-mp3.js?raw";
import bonziMap from "../../assets/agents/Bonzi/map.png";
import clippyAgentScript from "../../assets/agents/Clippy/agent.js?raw";
import clippySoundScript from "../../assets/agents/Clippy/sounds-mp3.js?raw";
import clippyMap from "../../assets/agents/Clippy/map.png";
import f1AgentScript from "../../assets/agents/F1/agent.js?raw";
import f1SoundScript from "../../assets/agents/F1/sounds-mp3.js?raw";
import f1Map from "../../assets/agents/F1/map.png";
import genieAgentScript from "../../assets/agents/Genie/agent.js?raw";
import genieSoundScript from "../../assets/agents/Genie/sounds-mp3.js?raw";
import genieMap from "../../assets/agents/Genie/map.png";
import geniusAgentScript from "../../assets/agents/Genius/agent.js?raw";
import geniusSoundScript from "../../assets/agents/Genius/sounds-mp3.js?raw";
import geniusMap from "../../assets/agents/Genius/map.png";
import linksAgentScript from "../../assets/agents/Links/agent.js?raw";
import linksSoundScript from "../../assets/agents/Links/sounds-mp3.js?raw";
import linksMap from "../../assets/agents/Links/map.png";
import merlinAgentScript from "../../assets/agents/Merlin/agent.js?raw";
import merlinSoundScript from "../../assets/agents/Merlin/sounds-mp3.js?raw";
import merlinMap from "../../assets/agents/Merlin/map.png";
import peedyAgentScript from "../../assets/agents/Peedy/agent.js?raw";
import peedySoundScript from "../../assets/agents/Peedy/sounds-mp3.js?raw";
import peedyMap from "../../assets/agents/Peedy/map.png";
import rockyAgentScript from "../../assets/agents/Rocky/agent.js?raw";
import rockySoundScript from "../../assets/agents/Rocky/sounds-mp3.js?raw";
import rockyMap from "../../assets/agents/Rocky/map.png";
import roverAgentScript from "../../assets/agents/Rover/agent.js?raw";
import roverSoundScript from "../../assets/agents/Rover/sounds-mp3.js?raw";
import roverMap from "../../assets/agents/Rover/map.png";

export interface AgentBranch {
  frameIndex: number;
  weight: number;
}

export interface AgentFrame {
  duration?: number;
  images?: number[][];
  sound?: string;
  exitBranch?: number;
  branching?: {
    branches: AgentBranch[];
  };
}

export interface AgentAnimation {
  frames: AgentFrame[];
}

interface RawAgentDefinition {
  framesize: [number, number];
  animations: Record<string, AgentAnimation>;
}

interface AgentCollector {
  definition?: RawAgentDefinition;
  sounds?: Record<string, string>;
}

export interface AgentPack {
  name: string;
  mapSrc: string;
  frameWidth: number;
  frameHeight: number;
  animations: Record<string, AgentAnimation>;
  sounds: Record<string, string>;
}

interface RawAgentFiles {
  name: string;
  mapSrc: string;
  agentScript: string;
  soundScript: string;
}

const RAW_AGENT_FILES: RawAgentFiles[] = [
  {
    name: "Bonzi",
    mapSrc: bonziMap,
    agentScript: bonziAgentScript,
    soundScript: bonziSoundScript,
  },
  {
    name: "Clippy",
    mapSrc: clippyMap,
    agentScript: clippyAgentScript,
    soundScript: clippySoundScript,
  },
  {
    name: "F1",
    mapSrc: f1Map,
    agentScript: f1AgentScript,
    soundScript: f1SoundScript,
  },
  {
    name: "Genie",
    mapSrc: genieMap,
    agentScript: genieAgentScript,
    soundScript: genieSoundScript,
  },
  {
    name: "Genius",
    mapSrc: geniusMap,
    agentScript: geniusAgentScript,
    soundScript: geniusSoundScript,
  },
  {
    name: "Links",
    mapSrc: linksMap,
    agentScript: linksAgentScript,
    soundScript: linksSoundScript,
  },
  {
    name: "Merlin",
    mapSrc: merlinMap,
    agentScript: merlinAgentScript,
    soundScript: merlinSoundScript,
  },
  {
    name: "Peedy",
    mapSrc: peedyMap,
    agentScript: peedyAgentScript,
    soundScript: peedySoundScript,
  },
  {
    name: "Rocky",
    mapSrc: rockyMap,
    agentScript: rockyAgentScript,
    soundScript: rockySoundScript,
  },
  {
    name: "Rover",
    mapSrc: roverMap,
    agentScript: roverAgentScript,
    soundScript: roverSoundScript,
  },
];

function evaluateAgentScript(script: string, collector: AgentCollector) {
  const clippy = {
    ready: (_name: string, definition: RawAgentDefinition) => {
      collector.definition = definition;
    },
    soundsReady: (_name: string, sounds: Record<string, string>) => {
      collector.sounds = sounds;
    },
  };

  // eslint-disable-next-line no-new-func
  const run = new Function("clippy", script) as (
    clippyApi: typeof clippy,
  ) => void;
  run(clippy);
}

function buildAgentPacks(): Record<string, AgentPack> {
  const packs: Record<string, AgentPack> = {};

  for (const file of RAW_AGENT_FILES) {
    const collector: AgentCollector = {};

    evaluateAgentScript(file.agentScript, collector);
    evaluateAgentScript(file.soundScript, collector);

    if (!collector.definition) {
      continue;
    }

    const [frameWidth, frameHeight] = collector.definition.framesize;

    packs[file.name] = {
      name: file.name,
      mapSrc: file.mapSrc,
      frameWidth,
      frameHeight,
      animations: collector.definition.animations,
      sounds: collector.sounds ?? {},
    };
  }

  return packs;
}

const AGENT_PACKS = buildAgentPacks();

export const AVAILABLE_AGENTS = Object.keys(AGENT_PACKS).sort();

export function getAgentPack(name?: string): AgentPack {
  if (name && AGENT_PACKS[name]) {
    return AGENT_PACKS[name];
  }

  if (AGENT_PACKS.Clippy) {
    return AGENT_PACKS.Clippy;
  }

  const [firstKey] = AVAILABLE_AGENTS;

  if (!firstKey) {
    throw new Error("No agent packs were loaded");
  }

  return AGENT_PACKS[firstKey];
}

export function getAnimationDuration(pack: AgentPack, key: string): number {
  const frames = pack.animations[key]?.frames ?? [];

  return frames.reduce((total, frame) => total + (frame.duration ?? 100), 0);
}

export function getAnimationKeys(pack: AgentPack): string[] {
  return Object.keys(pack.animations);
}

export function isDisallowedChatAnimationKey(key: string): boolean {
  return /^hide/i.test(key);
}

export function getChatAnimationKeys(agentName?: string): string[] {
  return getAnimationKeys(getAgentPack(agentName)).filter(
    (key) => !isDisallowedChatAnimationKey(key),
  );
}

export function getAnimationKeysBrackets(agentName?: string): string[] {
  return getChatAnimationKeys(agentName).map((key) => `[${key}]`);
}

export function getIdleAnimationKeys(pack: AgentPack): string[] {
  return getAnimationKeys(pack).filter((key) => key.startsWith("Idle"));
}
