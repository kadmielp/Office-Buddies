// Theme tabs
const stage = {
  win98: ["img/win98-chat.png", "img/win98-balloon.png"],
  winxp: ["img/xp-chat.png", "img/xp-balloon.png"],
  win11: ["img/chat-win11.png", "img/balloon-question.png"],
};
const chat = document.getElementById("theme-chat");
const balloon = document.getElementById("theme-balloon");
document.querySelectorAll(".tabs button").forEach((b) => {
  b.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
    const [c, bl] = stage[b.dataset.theme];
    chat.src = c;
    balloon.src = bl;
  });
});

// Clippy tips
const tips = [
  "It looks like you're visiting a website about AI assistants. Would you like help?",
  "Tip: Office Buddies can run models entirely on your machine.",
  "It looks like you're running Claude Code. Want me to tell you when it needs you?",
  "Tip: select text and press Win+F2 to define it.",
  "I'm free and open source. No paperclip subscription required.",
];
const tip = document.getElementById("tip");
let i = 0;
const next = () => {
  i = (i + 1) % tips.length;
  tip.style.opacity = 0;
  setTimeout(() => { tip.textContent = tips[i]; tip.style.opacity = 1; }, 300);
};
document.getElementById("clippy").addEventListener("click", next);
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(next, 9000);

// Taskbar clock
const clock = document.getElementById("clock");
const tick = () => { clock.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); };
tick(); setInterval(tick, 30000);
