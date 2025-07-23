// generateMatrix.js
import fs from 'fs/promises';
import path from 'path';

async function generateHTML() {
  const baseDir = 'C:/Users/HP/Desktop/sell';
  const folders = await fs.readdir(baseDir);
  const MAX_IMAGES = 5;

  let html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ของขวัญสำหรับคุณ</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <meta property="og:image" content="https://i.postimg.cc/7LnGvNCg/592769be-e377-4c69-8f0f-f872ef9aa58d.jpg" />
  <meta property="og:title" content="ของขวัญสำหรับคุณ" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="ของขวัญสำหรับคุณ" />
  <meta name="twitter:image" content="https://i.postimg.cc/7LnGvNCg/592769be-e377-4c69-8f0f-f872ef9aa58d.jpg" />
  <style>
      /* --- Matrix theme CSS from user sample --- */
      body {
        font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
        background: #0f181a;
        color: #00ff41;
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;
      }
      .carousel {
        display: flex;
        overflow-x: auto;
        scroll-behavior: smooth;
        gap: 15px;
        padding: 15px;
        scroll-snap-type: x mandatory;
      }
      .carousel img, .carousel video {
        width: 100%;
        height: 150px;
        min-width: 220px;
        object-fit: cover;
        border-radius: 10px;
        scroll-snap-align: start;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        background: #111;
        border: 1.5px solid #00ff41;
        flex-shrink: 0;
        display: block;
      }
      .carousel img:hover, .carousel video:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      }
      .carousel .img-placeholder {
        opacity: 0.13;
        border-style: dashed;
      }
      .grid-item {
        background: rgba(0, 0, 0, 0.85);
        border: 2px solid #00ff41;
        padding: 15px;
        text-align: center;
        border-radius: 10px;
        box-shadow: 0 0 20px #00ff4166;
        transition: transform 0.2s, box-shadow 0.2s, filter 0.2s, border-color 0.2s;
        position: relative;
        overflow: hidden;
      }
      .grid-item::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 10px;
        border: 2px solid #00ff41;
        box-shadow: 0 0 32px 4px #00ff41cc;
        opacity: 0.17;
        pointer-events: none;
        z-index: 1;
        animation: cyber-border 2.2s linear infinite;
      }
      @keyframes cyber-border {
        0% { box-shadow: 0 0 32px 4px #00ff41cc; }
        50% { box-shadow: 0 0 48px 8px #00ff4199; }
        100% { box-shadow: 0 0 32px 4px #00ff41cc; }
      }
      .grid-item:hover {
        filter: brightness(1.2) contrast(1.2) drop-shadow(0 0 10px #00ff41cc);
        box-shadow: 0 0 40px #00ff41cc;
        transform: scale(1.03) skew(-1deg, 1deg);
      }
      .matrix-title {
        font-size: 2.5rem;
        font-weight: 700;
        text-align: center;
        margin: 32px 0 32px 0;
        text-shadow: 0 0 16px #00ff41cc;
        letter-spacing: 2px;
        filter: brightness(1.2);
      }
      /* Glitch effect for hacker style */
      .glitch {
        position: relative;
        color: #00ff41;
        text-shadow:
          0 0 2px #00ff41,
          0 0 10px #00ff41,
          2px 2px 0 #0f181a,
          -2px -2px 0 #0f181a;
        animation: glitch 1.5s infinite linear alternate-reverse;
      }
      .glitch::before, .glitch::after {
        content: attr(data-text);
        position: absolute;
        left: 0; top: 0;
        width: 100%;
        overflow: hidden;
        color: #00ff41;
        z-index: 1;
      }
      .glitch::before {
        text-shadow: -2px 0 red;
        animation: glitchTop 1.5s infinite linear alternate-reverse;
      }
      .glitch::after {
        text-shadow: 2px 0 blue;
        animation: glitchBot 1.2s infinite linear alternate-reverse;
      }
      @keyframes glitch {
        0% { text-shadow: 0 0 2px #00ff41, 0 0 10px #00ff41; }
        20% { text-shadow: 2px 2px 0 #0f181a, -2px -2px 0 #0f181a; }
        40% { text-shadow: -2px -2px 0 #0f181a, 2px 2px 0 #0f181a; }
        60% { text-shadow: 0 0 2px #00ff41, 0 0 10px #00ff41; }
        100% { text-shadow: 1px 1px 0 #0f181a, -1px -1px 0 #0f181a; }
      }
      @keyframes glitchTop {
        0% { clip-path: inset(0 0 60% 0); left: 2px; }
        50% { clip-path: inset(0 0 30% 0); left: -2px; }
        100% { clip-path: inset(0 0 60% 0); left: 2px; }
      }
      @keyframes glitchBot {
        0% { clip-path: inset(60% 0 0 0); left: -2px; }
        50% { clip-path: inset(30% 0 0 0); left: 2px; }
        100% { clip-path: inset(60% 0 0 0); left: -2px; }
      }
      /* Hacker Button: Glass, Glow, Typewriter Hover */
      .hacker-btn {
        background: rgba(0,0,0,0.2);
        border: 2px solid #00ff41;
        color: #00ff41;
        border-radius: 999px;
        padding: 4px 24px;
        font-size: 1rem;
        font-family: 'Fira Mono', 'Consolas', monospace;
        font-weight: 700;
        letter-spacing: 1px;
        min-height: 32px;
        transition: background 0.2s, color 0.2s, box-shadow 0.2s, filter 0.2s;
        box-shadow: 0 0 8px #00ff4144;
        position: relative;
        overflow: hidden;
        margin-top: 12px;
        display: inline-block;
      }
      .hacker-btn:hover {
        background: #00ff41;
        color: #0f181a;
        box-shadow: 0 0 24px #00ff41bb, 0 0 4px #fff;
        border-color: #00ff41;
        filter: brightness(1.2) contrast(1.2) drop-shadow(0 0 8px #00ff41cc);
      }
      .hacker-btn::after {
        content: '';
        display: block;
        position: absolute;
        left: 0; top: 0; width: 100%; height: 100%;
        border-radius: 999px;
        pointer-events: none;
        box-shadow: 0 0 16px 4px #00ff41cc inset;
        opacity: 0.12;
        transition: opacity 0.2s;
      }
      .hacker-btn:hover::after {
        opacity: 0.2;
        animation: hacker-btn-glow 0.4s infinite alternate;
      }
      @keyframes hacker-btn-glow {
        0% { box-shadow: 0 0 16px 4px #00ff41cc inset; }
        100% { box-shadow: 0 0 32px 8px #00ff41cc inset; }
      }
  
    body {
      font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
      background: #0f181a;
      color: #00ff41;
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .grid-item {
      background: rgba(0,0,0,0.85);
      border: 1px solid #00ff41;
      padding: 15px;
      text-align: center;
      border-radius: 10px;
      box-shadow: 0 0 20px #00ff4166;
      transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
    }
    .grid-item:hover {
      filter: brightness(1.2) contrast(1.2) drop-shadow(0 0 10px #00ff41cc);
      box-shadow: 0 0 40px #00ff41cc;
      transform: scale(1.03) skew(-1deg, 1deg);
    }
    .carousel {
      display: flex;
      overflow-x: auto;
      scroll-behavior: smooth;
      gap: 15px;
      padding: 15px;
      scroll-snap-type: x mandatory;
    }
    .carousel img, .carousel video, .carousel .img-placeholder {
  width: 100%;
  height: 150px;
  min-width: 220px;
  object-fit: cover;
  border-radius: 10px;
  scroll-snap-align: start;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: #111;
  border: 1.5px solid #00ff41;
  flex-shrink: 0;
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}

    .carousel img:hover, .carousel video:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }
    .carousel .img-placeholder {
      opacity: 0.13;
      border-style: dashed;
    }
    .matrix-title {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin: 32px 0 32px 0;
      text-shadow: 0 0 16px #00ff41cc;
      letter-spacing: 2px;
      filter: brightness(1.2);
    }
    .hacker-btn {
      background: #111;
      color: #00ff41;
      border: 1.5px solid #00ff41;
      border-radius: 8px;
      padding: 12px 38px;
      font-size: 1.08rem;
      font-family: inherit;
      font-weight: 700;
      margin-top: 12px;
      letter-spacing: 1px;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      box-shadow: 0 2px 12px #00ff4133;
      text-decoration: none;
      display: inline-block;
    }
    .hacker-btn:hover {
      background: #00ff41;
      color: #0f181a;
      box-shadow: 0 0 32px #00ff41cc;
      transform: scale(1.06);
    }
  </style>
</head>
<body>
  <canvas id="matrix-canvas" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;"></canvas>
  <div class="container mx-auto relative z-10">
    <h1 class="matrix-title">ของขวัญสำหรับคุณ</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
`;

  for (const folder of folders) {
    const folderPath = path.join(baseDir, folder);
    const stats = await fs.stat(folderPath);
    if (!stats.isDirectory()) continue;
    let files = await fs.readdir(folderPath);
    let images = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    let videos = files.filter(file => /\.(mp4|webm|ogg)$/i.test(file));
    let items = images.concat(videos);
    if (items.length < MAX_IMAGES) {
      items = items.concat(Array(MAX_IMAGES - items.length).fill(null));
    } else if (items.length > MAX_IMAGES) {
      items = items.slice(0, MAX_IMAGES);
    }
    let signupLink = '#';
    try {
      const linkFile = await fs.readFile(path.join(folderPath, 'signup.txt'), 'utf-8');
      signupLink = linkFile.trim();
    } catch {}
    html += `<div class="grid-item">
      <div class="carousel">
        ${items.map(item => {
  if (!item) return `<span class='img-placeholder'></span>`;
  if (/\.(mp4|webm|ogg)$/i.test(item)) {
    return `<video src="${folder}/${item}" muted loop autoplay playsinline style="width:100%;height:150px;min-width:220px;border-radius:10px;background:#111;border:1.5px solid #00ff41;object-fit:cover;"></video>`;
  }
  return `<img src="${folder}/${item}" alt="${folder}" style="width:100%;height:150px;min-width:220px;border-radius:10px;background:#111;border:1.5px solid #00ff41;object-fit:cover;" onerror=\"this.style.opacity=0.13;this.style.borderStyle='dashed';\">`;
}).join('')}

      </div>
      <a href="${signupLink}" class="hacker-btn mt-4 inline-block" target="_blank">สมัครกับ ${folder}</a>
    </div>`;
  }

  html += `</div>
  </div>
<script>
// Matrix rain effect
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const fontSize = 18;
const columns = Math.floor(width / fontSize);
const drops = Array.from({length: columns}, () => Math.random() * height / fontSize);
const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function draw() {
  ctx.fillStyle = 'rgba(15,24,26,0.15)';
  ctx.fillRect(0, 0, width, height);
  ctx.font = fontSize + 'px Fira Mono, monospace';
  ctx.fillStyle = '#00ff41';
  for (let i = 0; i < columns; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (Math.random() > 0.975 || drops[i] * fontSize > height) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(draw, 45);
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});
// Hacker typewriter/randomizer effect for main title
window.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('main-title');
  if (!el) return;
  const original = el.innerText;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let frame = 0;
  let reveal = 0;
  function scramble() {
    let out = '';
    for (let i = 0; i < original.length; i++) {
      if (i < reveal) {
        out += original[i];
      } else if (original[i] === ' ') {
        out += ' ';
      } else {
        out += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    el.innerText = out;
    if (reveal < original.length) {
      if (frame % 2 === 0) reveal++;
      frame++;
      setTimeout(scramble, 40);
    } else {
      el.innerText = original;
    }
  }
  scramble();
});
// Typewriter glow on .hacker-btn hover
setTimeout(() => {
  document.querySelectorAll('.hacker-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.textShadow = '0 0 8px #00ff41, 0 0 16px #00ff41, 0 0 2px #fff';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.textShadow = '';
    });
  });
}, 100);
// Play click sound on hacker-btn click
const clickSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae7b7.mp3');
setTimeout(() => {
  document.querySelectorAll('.hacker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    });
  });
}, 100);
</script>
</body>
</html>`;

  await fs.writeFile('matrix_grid.html', html);
  console.log('✅ สร้าง matrix_grid.html สำเร็จ');
}

generateHTML().catch(console.error);
