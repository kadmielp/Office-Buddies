export const SettingsAbout: React.FC = () => {
  return (
    <div>
      <h1>About</h1>
      <p>
        Clippy is a love letter and homage to the late, great Clippy, the
        assistant from Microsoft Office 1997. The character was designed by
        illustrator Kevan Atteberry, who created more than 15 potential
        characters for Microsoft's Office Assistants. It is <i>not</i>{" "}
        affiliated, approved, or supported by Microsoft. Consider it software
        art.
      </p>
      <h3>Acknowledgments</h3>
      <p>
        This app was made by{" "}
        <a href="https://github.com/felixrieseberg" target="_blank">
          Felix Rieseberg
        </a>{" "}
        using{" "}
        <a href="https://electronjs.org/" target="_blank">
          Electron
        </a>{" "}
        and{" "}
        <a href="https://node-llama-cpp.withcat.ai/" target="_blank">
          node-llama-cpp
        </a>
        , embedded using{" "}
        <a href="https://github.com/electron/llm" target="_blank">
          @electron/llm
        </a>
        . The whimsical retro design was made possible by{" "}
        <a href="https://github.com/jdan" target="_blank">
          Jordan Scales
        </a>
        .
      </p>
      <p>
        Clippy and all visual assets related to Clippy are owned by Microsoft.
        This app is not affiliated with Microsoft.
      </p>
    </div>
  );
};
