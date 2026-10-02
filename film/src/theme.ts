// One place to change the whole film: palette, type, grid and scene timings.
// 120 BPM @ 30 fps => 1 beat = 15 frames, 1 bar = 60 frames.
export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const BEAT = 15;

export const C = {
  teal: "#008080", // white text only (4.77:1)
  violet: "#8A2BE2", // white text only (5.97:1)
  ink: "#101820", // white / yellow text (>= 15:1)
  paper: "#FFFFC0", // ink text (>= 17:1)
  cream: "#F4F1E8", // ink text (>= 16:1)
  white: "#FFFFFF",
};

export const FONT = "'Segoe UI', Tahoma, Arial, sans-serif";
export const DISPLAY = "'Segoe UI Black', 'Arial Black', Impact, sans-serif";

export const SAFE = 96; // safe margin in px

// start frame, length (all multiples of 15), narration offset in seconds
export const SCENES = {
  s1: { from: 0, len: 180 },
  s2: { from: 180, len: 240 },
  s3: { from: 420, len: 120 },
  s4: { from: 540, len: 240 },
  s5: { from: 780, len: 240 },
  s6: { from: 1020, len: 360 },
  s7: { from: 1380, len: 240 },
  s8: { from: 1620, len: 240 },
};
export const TOTAL = 1860;
export const TRANSITION = 15;

// Word onsets inside the flash block (measured with silencedetect), in frames
// relative to the scene start (voice block starts at 14.0 s).
export const FLASH = [
  { word: "Local", at: 8, bg: C.violet, fg: C.white },
  { word: "Private", at: 26, bg: C.ink, fg: C.paper },
  { word: "Nostalgic", at: 44, bg: C.paper, fg: C.ink },
  { word: "Yours.", at: 82, bg: C.teal, fg: C.white },
];
