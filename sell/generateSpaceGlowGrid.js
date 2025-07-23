// generateSpaceGlowGrid.js
// ธีม Space Nebula Cyberpunk (space_glow_grid.html)
import { promises as fs } from 'fs';
import path from 'path';

const exts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.ogg'];
const baseDir = path.resolve('.');

async function getBrandFolders() {
  const entries = await fs.readdir(baseDir, { withFileTypes: true });
  return entries.filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => e.name);
}

async function getMedia(folder) {
  const files = await fs.readdir(path.join(baseDir, folder));
  return files.filter(f => exts.includes(path.extname(f).toLowerCase())).slice(0, 5);
}

async function getSignupLink(folder) {
  try {
    const link = await fs.readFile(path.join(baseDir, folder, 'signup.txt'), 'utf8');
    return link.trim();
  } catch {
    return '#';
  }
}

async function generateSpaceGlowGrid() {
  const folders = await getBrandFolders();
  let html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Space Nebula Signup</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;900&family=Fira+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    body {
      background: linear-gradient(135deg, #0a0026 0%, #2e1a47 40%, #2e6cff 80%, #7f53ff 100%);
      min-height: 100vh;
      color: #b9aaff;
      font-family: 'Fira Mono', 'Orbitron', monospace;
      overflow-x: hidden;
    }
    .space-title {
      font-family: 'Orbitron', 'Fira Mono', monospace;
      font-size: 2.7rem;
      text-align: center;
      margin: 2.5rem 0 2rem 0;
      color: #fff;
      letter-spacing: 2px;
      text-shadow: 0 0 8px #7f53ff, 0 0 32px #2e6cff, 0 0 2px #fff;
      filter: brightness(1.2);
      position: relative;
      z-index: 2;
      animation: space-neon-flicker 2.2s infinite alternate;
    }
    @keyframes space-neon-flicker {
      0%, 100% { text-shadow: 0 0 8px #7f53ff, 0 0 32px #2e6cff, 0 0 2px #fff; }
      45% { text-shadow: 0 0 16px #2e6cff, 0 0 48px #7f53ff, 0 0 4px #fff; }
      60% { text-shadow: 0 0 6px #b9aaff, 0 0 12px #2e6cff, 0 0 1px #fff; }
    }
    .space-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
      gap: 2.2rem;
      padding: 2rem 0;
    }
    .space-card {
      background: linear-gradient(135deg, rgba(127,83,255,0.13) 0%, rgba(46,108,255,0.09) 100%);
      border: 2.5px solid #7f53ff;
      border-radius: 18px;
      box-shadow: 0 0 32px 4px #2e6cffcc, 0 0 0 #fff;
      padding: 1.6rem 1.1rem 1.1rem 1.1rem;
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: transform 0.22s, box-shadow 0.22s, filter 0.22s;
      backdrop-filter: blur(2.5px);
    }
    .space-card:hover {
      transform: scale(1.035) rotate(-0.5deg);
      box-shadow: 0 0 56px 12px #7f53ffee, 0 0 8px #fff;
      filter: brightness(1.13) contrast(1.1);
      border-color: #b9aaff;
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
      box-shadow: 0 0 18px #7f53ff99;
      border: 1.5px solid #7f53ff;
      background: #0a0026;
      scroll-snap-align: start;
      transition: transform 0.22s, box-shadow 0.22s;
      flex-shrink: 0;
      display: block;
    }
    .carousel img:hover, .carousel video:hover {
      transform: scale(1.07) rotate(-1deg);
      box-shadow: 0 0 32px #2e6cffcc, 0 0 8px #fff;
    }
    .space-btn {
      background: linear-gradient(90deg, #2e6cff 0%, #7f53ff 100%);
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 7px 32px;
      font-size: 1.12rem;
      font-family: 'Orbitron', 'Fira Mono', monospace;
      font-weight: 700;
      letter-spacing: 1.5px;
      margin-top: 1.2rem;
      margin-bottom: 0.2rem;
      box-shadow: 0 0 18px #2e6cffcc;
      cursor: pointer;
      transition: background 0.18s, color 0.18s, box-shadow 0.18s;
      position: relative;
      z-index: 2;
    }
    .space-btn:hover {
      background: linear-gradient(90deg, #7f53ff 0%, #2e6cff 100%);
      color: #fffbe0;
      box-shadow: 0 0 32px #7f53ffee, 0 0 8px #fff;
      filter: brightness(1.12);
    }
    .space-card .brand-name {
      font-family: 'Orbitron', 'Fira Mono', monospace;
      font-size: 1.18rem;
      color: #7f53ff;
      margin-bottom: 0.7rem;
      letter-spacing: 1.3px;
      text-shadow: 0 0 4px #2e6cffcc;
      font-weight: 600;
    }
    /* Space nebula cyberpunk grid glow background */
    .space-cyber-bg {
      pointer-events: none;
      position: fixed;
      left: 0; top: 0; width: 100vw; height: 100vh;
      z-index: 0;
      opacity: 0.18;
      background: repeating-linear-gradient(120deg, #7f53ff 0 2px, transparent 2px 40px), repeating-linear-gradient(-60deg, #2e6cff 0 2px, transparent 2px 40px);
      mix-blend-mode: lighten;
      animation: space-cyber-bg-move 12s linear infinite;
    }
    @keyframes space-cyber-bg-move {
      0% { background-position: 0 0, 0 0; }
      100% { background-position: 120px 60px, -120px -60px; }
    }
  </style>
</head>
<body>
  <div class="space-cyber-bg"></div>
  <h1 class="space-title">SPACE NEBULA SIGNUP</h1>
  <div class="space-grid">
${(await Promise.all(folders.map(async (folder) => {
  const items = await getMedia(folder);
  const signupLink = await getSignupLink(folder);
  return `<div class=\"space-card\">
    <div class=\"brand-name\">${folder}</div>
    <div class=\"carousel\">
      ${items.map(item => {
        if (!item) return `<span class='img-placeholder'></span>`;
        if (/\\.(mp4|webm|ogg)$/i.test(item)) {
          return `<video src=\"${folder}/${item}\" muted loop autoplay playsinline style=\"width:100%;height:160px;min-width:230px;border-radius:12px;background:#0a0026;border:1.5px solid #7f53ff;object-fit:cover;\"></video>`;
        }
        return `<img src=\"${folder}/${item}\" alt=\"${folder}\" style=\"width:100%;height:160px;min-width:230px;border-radius:12px;background:#0a0026;border:1.5px solid #7f53ff;object-fit:cover;\" onerror=\\\"this.style.opacity=0.13;this.style.borderStyle='dashed';\\\">`;
      }).join('')}
    </div>
    <a href=\"${signupLink}\" class=\"space-btn\" target=\"_blank\">สมัครกับ ${folder}</a>
  </div>`;
}))).join('\n')}
</div>
<script>
// Space nebula cyberpunk rain effect
const canvas = document.createElement('canvas');
canvas.id = 'space-cyber-canvas';
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
const nebula = ['#7f53ff','#2e6cff','#b9aaff','#fff'];
const chars = '✦✧★☄︎ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(46,108,255,0.012)';
  ctx.fillRect(0, 0, width, height);
  ctx.font = fontSize + 'px Orbitron, Fira Mono, monospace';
  for (let i = 0; i < columns; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.save();
    ctx.shadowColor = nebula[i % nebula.length];
    ctx.shadowBlur = 16;
    ctx.fillStyle = nebula[i % nebula.length];
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
// Space button click sound
const clickSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae7b7.mp3');
setTimeout(() => {
  document.querySelectorAll('.space-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    });
  });
}, 100);
</script>
</body>
</html>`;
  await fs.writeFile('space_glow_grid.html', html);
  console.log('✅ สร้าง space_glow_grid.html สำเร็จ');
}
generateSpaceGlowGrid();
