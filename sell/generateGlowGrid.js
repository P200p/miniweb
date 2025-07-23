// generateGlowGrid.js
// สร้าง HTML สไตล์ใหม่: Matrix Neon Glow Cyberpunk Card Grid
// ไม่เขียนทับไฟล์เดิม! ผลลัพธ์เป็น glow_gift_grid.html

import { promises as fs } from "fs";
import path from "path";

const exts = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".mp4",
  ".webm",
  ".ogg",
];
const baseDir = path.resolve(".");

async function getBrandFolders() {
  const entries = await fs.readdir(baseDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);
}

async function getMedia(folder) {
  const files = await fs.readdir(path.join(baseDir, folder));
  return files
    .filter((f) => exts.includes(path.extname(f).toLowerCase()))
    .slice(0, 5);
}

async function getSignupLink(folder) {
  try {
    const link = await fs.readFile(
      path.join(baseDir, folder, "signup.txt"),
      "utf8"
    );
    return link.trim();
  } catch {
    return "#";
  }
}

async function generateGlowGrid() {
  const folders = await getBrandFolders();
  let html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neon Matrix Glow Signup</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;900&family=Fira+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    body {
      background: linear-gradient(135deg, #0f181a 60%, #1a0036 100%);
      min-height: 100vh;
      color: #cfffde;
      font-family: 'Fira Mono', 'Orbitron', monospace;
      overflow-x: hidden;
    }
    .neon-title {
      font-family: 'Orbitron', 'Fira Mono', monospace;
      font-size: 2.7rem;
      text-align: center;
      margin: 2.5rem 0 2rem 0;
      color: #fff;
      letter-spacing: 2px;
      text-shadow: 0 0 8px #00ffe7, 0 0 32px #00ffe7, 0 0 2px #fff;
      filter: brightness(1.3);
      position: relative;
      z-index: 2;
      animation: neon-flicker 2.2s infinite alternate;
    }
    @keyframes neon-flicker {
      0%, 100% { text-shadow: 0 0 8px #00ffe7, 0 0 32px #00ffe7, 0 0 2px #fff; }
      45% { text-shadow: 0 0 16px #00ffe7, 0 0 48px #00ffe7, 0 0 4px #fff; }
      60% { text-shadow: 0 0 6px #00ffe7, 0 0 12px #00ffe7, 0 0 1px #fff; }
    }
    .glow-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
      gap: 2.2rem;
      padding: 2rem 0;
    }
    .glow-card {
      background: linear-gradient(135deg, rgba(0,255,65,0.13) 0%, rgba(0,255,255,0.09) 100%);
      border: 2.5px solid #00ffe7;
      border-radius: 18px;
      box-shadow: 0 0 32px 4px #00ffe7cc, 0 0 0 #fff;
      padding: 1.6rem 1.1rem 1.1rem 1.1rem;
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: transform 0.22s, box-shadow 0.22s, filter 0.22s;
    }
    .glow-card:hover {
      transform: scale(1.035) rotate(-0.5deg);
      box-shadow: 0 0 56px 12px #00ffe7ee, 0 0 8px #fff;
      filter: brightness(1.13) contrast(1.1);
      border-color: #7efff7;
    }
    .carousel {
      display: flex;
      overflow-x: auto;
      gap: 14px;
      padding: 10px 0 10px 0;
      scroll-snap-type: x mandatory;
      scrollbar-width: thin;
    }
    .carousel img, .carousel video {
      width: 100%;
      height: 160px;
      min-width: 230px;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 0 18px #00ffe799;
      border: 1.5px solid #00ffe7;
      background: #181f22;
      scroll-snap-align: start;
      transition: transform 0.22s, box-shadow 0.22s;
      flex-shrink: 0;
      display: block;
    }
    .carousel img:hover, .carousel video:hover {
      transform: scale(1.07) rotate(-1deg);
      box-shadow: 0 0 32px #00ffe7cc, 0 0 8px #fff;
    }
    .glow-btn {
      background: linear-gradient(90deg, #00ffe7 0%, #00ff41 100%);
      color: #0f181a;
      border: none;
      border-radius: 999px;
      padding: 7px 32px;
      font-size: 1.12rem;
      font-family: 'Orbitron', 'Fira Mono', monospace;
      font-weight: 700;
      letter-spacing: 1.5px;
      margin-top: 1.2rem;
      margin-bottom: 0.2rem;
      box-shadow: 0 0 18px #00ffe7cc;
      cursor: pointer;
      transition: background 0.18s, color 0.18s, box-shadow 0.18s;
      position: relative;
      z-index: 2;
    }
    .glow-btn:hover {
      background: linear-gradient(90deg, #00ff41 0%, #00ffe7 100%);
      color: #fff;
      box-shadow: 0 0 32px #00ffe7ee, 0 0 8px #fff;
      filter: brightness(1.12);
    }
    .glow-card .brand-name {
      font-family: 'Orbitron', 'Fira Mono', monospace;
      font-size: 1.18rem;
      color: #00ffe7;
      margin-bottom: 0.7rem;
      letter-spacing: 1.3px;
      text-shadow: 0 0 4px #00ffe7cc;
      font-weight: 600;
    }
    /* Cyberpunk grid glow background */
    .cyber-bg {
      pointer-events: none;
      position: fixed;
      left: 0; top: 0; width: 100vw; height: 100vh;
      z-index: 0;
      opacity: 0.25;
      background: repeating-linear-gradient(120deg, #00ffe7 0 2px, transparent 2px 40px), repeating-linear-gradient(-60deg, #00ff41 0 2px, transparent 2px 40px);
      mix-blend-mode: lighten;
      animation: cyber-bg-move 12s linear infinite;
    }
    @keyframes cyber-bg-move {
      0% { background-position: 0 0, 0 0; }
      100% { background-position: 120px 60px, -120px -60px; }
    }
  </style>
</head>
<body>
  <div class="cyber-bg"></div>
  <h1 class="neon-title">NEON MATRIX SIGNUP</h1>
  <div class="glow-grid">
${(
  await Promise.all(
    folders.map(async (folder) => {
      const items = await getMedia(folder);
      const signupLink = await getSignupLink(folder);
      return `<div class="glow-card">
    <div class="brand-name">${folder}</div>
    <div class="carousel">
      ${items
        .map((item) => {
          if (!item) return `<span class='img-placeholder'></span>`;
          if (/\.(mp4|webm|ogg)$/i.test(item)) {
            return `<video src="${folder}/${item}" muted loop autoplay playsinline style="width:100%;height:160px;min-width:230px;border-radius:12px;background:#181f22;border:1.5px solid #00ffe7;object-fit:cover;"></video>`;
          }
          return `<img src="${folder}/${item}" alt="${folder}" style="width:100%;height:160px;min-width:230px;border-radius:12px;background:#181f22;border:1.5px solid #00ffe7;object-fit:cover;" onerror=\"this.style.opacity=0.13;this.style.borderStyle='dashed';\">`;
        })
        .join("")}
    </div>
    <a href="${signupLink}" class="glow-btn" target="_blank">สมัครกับ ${folder}</a>
  </div>`;
    })
  )
).join("\n")}
</div>
<script>
// Cyberpunk rain effect (neon matrix)
const canvas = document.createElement('canvas');
canvas.id = 'cyber-canvas';
canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1;pointer-events:none;mix-blend-mode:screen;';
document.body.appendChild(canvas);
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
const fontSize = 21;
const columns = Math.floor(width / fontSize);
const drops = Array.from({length: columns}, () => Math.random() * height / fontSize);
const chars = '✦✧⧫◇◆✪✶✷✸✹✺✻✼✽✾✿❀❁❂❃❄❅❆❇❈❉❊❋ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function draw() {
  ctx.fillStyle = 'rgba(26,0,54,0.08)';
  ctx.fillRect(0, 0, width, height);
  ctx.font = fontSize + 'px Orbitron, Fira Mono, monospace';
  ctx.fillStyle = '#00ffe7';
  for (let i = 0; i < columns; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.save();
    ctx.shadowColor = '#00ffe7';
    ctx.shadowBlur = 16;
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    ctx.restore();
    if (Math.random() > 0.965 || drops[i] * fontSize > height) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(draw, 44);
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});
// Neon button click sound
const clickSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae7b7.mp3');
setTimeout(() => {
  document.querySelectorAll('.glow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    });
  });
}, 100);
</script>
</body>
</html>`;
  await fs.writeFile("glow_gift_grid.html", html);
  console.log("✅ สร้าง glow_gift_grid.html สำเร็จ");
}
generateGlowGrid();
