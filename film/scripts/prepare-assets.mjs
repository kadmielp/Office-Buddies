// Copies the sprite sheets the film uses from the app's own assets.
import fs from "node:fs";
const root = new URL("../../assets/agents/", import.meta.url);
fs.mkdirSync(new URL("../public/agents/", import.meta.url), { recursive: true });
for (const a of ["Clippy", "Merlin", "Bonzi", "Genie", "Peedy", "Rover", "Rocky", "F1", "Links", "Genius"]) {
  fs.copyFileSync(new URL(`${a}/map.png`, root), new URL(`../public/agents/${a}.png`, import.meta.url));
}
console.log("sprite sheets copied");
