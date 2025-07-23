// generateblack&red.js
import fs from 'fs/promises';
import path from 'path';

async function generateHTML() {
  const baseDir = 'C:/Users/HP/Desktop/sell';
  const folders = await fs.readdir(baseDir);

  // กำหนดจำนวนภาพสูงสุดต่อแบรนด์ (เช่น 4)
  const MAX_IMAGES = 4;

  let html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:image" content="https://i.postimg.cc/7LnGvNCg/592769be-e377-4c69-8f0f-f872ef9aa58d.jpg" />
  <meta property="og:title" content="รับของขวัญสุดพิเศษ" />
  <title>ของขวัญสำหรับคุณ | Black & Red Theme</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      background: #0a0a0a;
      color: #fff;
      font-family: 'Prompt', sans-serif;
      min-height: 100vh;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px 30px 20px;
    }
    h1 {
      text-align: center;
      font-size: 2.9rem;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 38px;
      color: #e11d48;
      text-shadow: 0 2px 18px #e11d4888;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
      gap: 32px;
    }
    .brand-card {
      background: linear-gradient(120deg, #181818 80%, #1a0008 100%);
      border: 2.5px solid #e11d48;
      border-radius: 18px;
      box-shadow: 0 0 32px #e11d4844, 0 4px 40px #000b;
      padding: 26px 18px 18px 18px;
      text-align: center;
      transition: box-shadow 0.3s, transform 0.2s;
      position: relative;
      overflow: hidden;
      min-height: 330px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
    .brand-card:hover {
      box-shadow: 0 0 80px #e11d48cc, 0 4px 40px #000c;
      transform: translateY(-6px) scale(1.035);
      z-index: 2;
    }
    .carousel {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
      width: 100%;
      min-height: 120px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 6px;
    }
    .carousel img, .carousel .img-placeholder {
      border-radius: 10px;
      height: 110px;
      width: 130px;
      object-fit: cover;
      border: 2px solid #e11d48;
      background: #222;
      box-shadow: 0 2px 18px #e11d4840;
      transition: transform 0.2s, box-shadow 0.2s;
      display: inline-block;
      scroll-snap-align: start;
      flex-shrink: 0;
    }
    .carousel img:hover {
      transform: scale(1.08) rotate(-2deg);
      box-shadow: 0 0 30px #e11d48bb;
      border-color: #fff;
    }
    .carousel .img-placeholder {
      opacity: 0.15;
      border-style: dashed;
      background: #1a0008;
    }
    .signup-btn {
      background: linear-gradient(90deg, #e11d48 60%, #b2002d 100%);
      color: #fff;
      padding: 13px 38px;
      margin-top: 18px;
      border-radius: 10px;
      font-weight: 700;
      display: inline-block;
      font-size: 1.18rem;
      letter-spacing: 1px;
      border: none;
      box-shadow: 0 2px 16px #e11d4888;
      cursor: pointer;
      text-decoration: none;
      position: relative;
      animation: pulse-glow 1.5s infinite alternate;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.15s;
    }
    .signup-btn:hover {
      background: linear-gradient(90deg, #a80023 60%, #e11d48 100%);
      color: #fff;
      box-shadow: 0 6px 32px #e11d48cc, 0 0 16px #fff5;
      transform: scale(1.09) rotate(-1deg);
      animation: bounce 0.5s;
    }
    @keyframes pulse-glow {
      from { box-shadow: 0 2px 16px #e11d4888, 0 0 0 #fff0; }
      to   { box-shadow: 0 6px 28px #e11d48cc, 0 0 18px #fff3; }
    }
    @keyframes bounce {
      0%   { transform: scale(1.09) translateY(0); }
      40%  { transform: scale(1.13) translateY(-7px); }
      100% { transform: scale(1.09) translateY(0); }
    }
    .brand-name {
      font-size: 1.4rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 7px;
      letter-spacing: 1px;
      text-shadow: 0 1px 8px #e11d4822;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>ของขวัญสำหรับคุณ</h1>
    <div class="grid">
`;

  for (const folder of folders) {
    const folderPath = path.join(baseDir, folder);
    const stats = await fs.stat(folderPath);
    if (!stats.isDirectory()) continue;

    let images = (await fs.readdir(folderPath)).filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    // จำกัดจำนวนภาพ และเติม placeholder ถ้าภาพไม่ครบ
    if (images.length < MAX_IMAGES) {
      images = images.concat(Array(MAX_IMAGES - images.length).fill(null));
    } else if (images.length > MAX_IMAGES) {
      images = images.slice(0, MAX_IMAGES);
    }

    // check for a signup.txt file in the folder
    let signupLink = `#`;
    try {
      const linkFile = await fs.readFile(path.join(folderPath, 'signup.txt'), 'utf-8');
      signupLink = linkFile.trim();
    } catch {}

    html += `<div class="brand-card">
      <div class="brand-name">${folder}</div>
      <div class="carousel">
        ${images.map(img => img ? `<img src="${folder}/${img}" alt="${folder}">` : `<span class='img-placeholder'></span>`).join('')}
      </div>
      <a href="${signupLink}" class="signup-btn" target="_blank">สมัครกับ ${folder}</a>
    </div>`;
  }

  html += `</div>
  </div>
</body>
</html>`;

  await fs.writeFile('blackred_grid.html', html);
  console.log('✅ สร้าง blackred_grid.html สำเร็จ');
}

generateHTML().catch(console.error);
