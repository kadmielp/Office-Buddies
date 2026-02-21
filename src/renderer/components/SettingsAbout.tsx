import { useEffect, useState } from "react";
import { Versions } from "../../types/interfaces";
import { clippyApi } from "../clippyApi";
import infoIcon from "../images/icons/info.png";

export const SettingsAbout: React.FC = () => {
  const [versions, setVersions] = useState<Partial<Versions>>({});

  useEffect(() => {
    clippyApi.getVersions().then((versions) => {
      setVersions(versions);
    });
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src={infoIcon}
          alt=""
          aria-hidden="true"
          style={{ width: "24px", height: "24px" }}
        />
        <h1>About</h1>
      </div>
      <fieldset>
        <legend>Version</legend>
        <p>
          Office Buddies <code>{versions.clippy || "Unknown"}</code> (with Electron{" "}
          <code>{versions.electron || "Unknown"}</code> and Node-llama-cpp:{" "}
          <code>{versions.nodeLlamaCpp || "Unknown"})</code>
        </p>
      </fieldset>
      <p>
        Office Buddies brings classic Office-style assistants into a modern LLM
        chat app with a 90s desktop vibe. It supports local GGUF models and
        optional remote providers while keeping the UI intentionally nostalgic.
        This app is a tribute to the assistant era and is <i>not</i> affiliated
        with, endorsed by, or sponsored by Microsoft.
      </p>
      <h3>Acknowledgments</h3>
      <p>
        Office Buddies began as a fork of{" "}
        <a href="https://github.com/felixrieseberg/clippy" target="_blank">
          Clippy
        </a>{" "}
        by{" "}
        <a href="https://github.com/felixrieseberg" target="_blank">
          Felix Rieseberg
        </a>
        , and has since grown into a broader assistant-focused app with
        multiple characters, richer animations, and multi-provider AI support.
        Local inference is powered by{" "}
        <a href="https://electronjs.org/" target="_blank">
          Electron
        </a>
        ,{" "}
        <a href="https://github.com/electron/llm" target="_blank">
          @electron/llm
        </a>
        , and{" "}
        <a href="https://github.com/withcatai/node-llama-cpp" target="_blank">
          node-llama-cpp
        </a>
        . The Windows 98 visual language was shaped by{" "}
        <a href="https://github.com/jdan" target="_blank">
          Jordan Scales
        </a>
        , with icon inspiration from{" "}
        <a href="https://win98icons.alexmeub.com/" target="_blank">
          Alex Meub's Windows 98 Icons
        </a>
        . Assistant animation preservation and extraction work by{" "}
        <a href="https://github.com/pi0" target="_blank">
          Pooya Parsa
        </a>{" "}
        and contributors helped keep these characters available. GGUF models
        are available from creators such as{" "}
        <a href="https://www.unsloth.ai" target="_blank">
          Unsloth
        </a>
        {" "}and{" "}
        <a href="https://huggingface.co/thebloke" target="_blank">
          TheBloke
        </a>
        .
      </p>
      <p>
        Special thanks to illustrator{" "}
        <a href="https://www.kevanatteberry.com/" target="_blank">
          Kevan Atteberry
        </a>
        , who created more than 15 potential characters for Microsoft's Office
        Assistants.
      </p>
      <p>
        Clippy and all visual assets related to Office Assistants are owned by Microsoft.
        This app is not affiliated with Microsoft.
      </p>
    </div>
  );
};
