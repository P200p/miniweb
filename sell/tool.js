javascript:(function(){
  // 🦈 Panel DevTool ฉบับ Hacker
  const panel = document.createElement('div');
  panel.style.cssText = `
    position:fixed; top:20px; right:20px; z-index:999999;
    background:#000; color:#00ff00; padding:8px; border-radius:8px;
    font-family:monospace; font-size:14px; border:2px solid #ff0000;
    box-shadow:0 0 10px #ff0000aa;
    width:140px; height:500px; overflow:hidden;
  `;

  // 🧱 Sections สำหรับแต่ละโหมด
  function createSection(){
    const sec = document.createElement('div');
    sec.style.cssText = 'overflow:auto; height:calc(100% - 34px); margin-bottom:6px;';
    return sec;
  }
  const postmanSection = createSection();
  const toolsSection   = createSection();
  panel.appendChild(postmanSection);
  panel.appendChild(toolsSection);

  let currentMode = 'postman';
  const sections = { postman: postmanSection, tools: toolsSection };
  const collapsed = { postman: false, tools: false };

  function updateSections(){
    Object.keys(sections).forEach(mode => {
      const sec = sections[mode];
      sec.style.display = (mode === currentMode && !collapsed[mode]) ? 'block' : 'none';
    });
    panel.style.height = collapsed[currentMode] ? '34px' : '500px';
  }

  function switchMode(){
    currentMode = currentMode==='postman'?'tools':'postman';
    updateSections();
  }

  function toggleSection(){
    collapsed[currentMode] = !collapsed[currentMode];
    updateSections();
  }

  // 🎛️ Control Bar
  const controlBar = document.createElement('div');
  controlBar.style.cssText = 'display:flex; justify-content:flex-end; gap:4px; margin-bottom:6px;';

  [['↕','พับเก็บ',toggleSection],
   ['🔁','สลับโหมด',switchMode],
   ['❌','ปิดหน้าต่าง',()=>panel.remove()]]
  .forEach(([txt,ttl,fn])=>{
    const btn = document.createElement('button');
    btn.textContent = txt;
    btn.title = ttl;
    btn.style.cssText = `
      padding:2px 6px; background:#111; color:#0f0;
      border:none; border-radius:4px; cursor:pointer;
      font-family:monospace;margin: 0 8px; // บน-ล่าง 0, ซ้าย-ขวา 15px
    `;
    btn.onclick = fn;
    controlBar.appendChild(btn);
  });
  panel.appendChild(controlBar);

  // 🧪 POSTMAN ส่วนกรอก URL / Header / Body
  const urlInput = document.createElement('input');
  urlInput.placeholder = 'URL';
  urlInput.style.cssText = `width:100%; margin-bottom:4px; padding:4px; background:#111; color:#0f0; border:none; border-radius:4px; font-family:monospace;`;

  const methodSelect = document.createElement('select');
  ['GET','POST','PUT','DELETE'].forEach(m => {
    const o = document.createElement('option'); o.value = m; o.textContent = m;
    methodSelect.appendChild(o);
  });
  methodSelect.style.cssText = urlInput.style.cssText;

  const headersInput = document.createElement('textarea');
  headersInput.placeholder = 'Headers (JSON)';
  headersInput.style.cssText = `width:100%; height:50px; margin-bottom:4px; padding:4px; background:#111; color:#0f0; border:none; border-radius:4px; font-family:monospace;`;

  const bodyInput = document.createElement('textarea');
  bodyInput.placeholder = 'Body';
  bodyInput.style.cssText = headersInput.style.cssText;

  const sendBtn = document.createElement('button');
  sendBtn.textContent = '🚀 ส่งคำขอ';
  sendBtn.style.cssText = `width:100%; margin-bottom:4px; padding:6px; background:#111; color:#0f0; border:none; border-radius:6px; cursor:pointer; font-family:monospace;`;

  let lastResponse = '';
  sendBtn.onclick = () => {
    let headers = {};
    try { headers = JSON.parse(headersInput.value) }
    catch { alert('รูปแบบ Header ไม่ถูกต้อง'); return; }
    fetch(urlInput.value, {
      method: methodSelect.value,
      headers: headers,
      body: methodSelect.value !== 'GET' ? bodyInput.value : null
    })
    .then(r => r.text())
    .then(txt => { lastResponse = txt; alert('ผลลัพธ์:\n'+txt) })
    .catch(e => alert('เกิดข้อผิดพลาด: '+e));
  };

  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = '💾 ดาวน์โหลด';
  downloadBtn.style.cssText = sendBtn.style.cssText;
  downloadBtn.onclick = () => {
    if(!lastResponse){ alert('ไม่มีผลลัพธ์'); return; }
    const blob = new Blob([lastResponse], {type:'text/plain'});
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u; a.download = 'response.txt'; a.click();
    URL.revokeObjectURL(u);
    alert('ดาวน์โหลดเรียบร้อย');
  };

  postmanSection.append(urlInput, methodSelect, headersInput, bodyInput, sendBtn, downloadBtn);

  // 🧰 ฟังก์ชัน Debug ขั้นสูง
  function addTool(label, fn){
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = sendBtn.style.cssText;
    btn.onclick = fn;
    toolsSection.appendChild(btn);
  }

  addTool('🎯 คลิกสุ่มทุกปุ่ม', () => {
    document.querySelectorAll('button,a,[role=button]')
      .forEach(el => { try{ el.click(); } catch{} });
    alert('คลิกครบทุกปุ่มแล้ว');
  });

  addTool('📋 สแกนฟอร์ม', () => {
    const fs = document.querySelectorAll('form');
    const sum = [...fs].map((f,i)=>`${i}: ${f.action} (${f.querySelectorAll('input,textarea,select').length})`).join('\n');
    console.log(sum);
    alert('ดูฟอร์มใน console');
  });
  
addTool('🖥️ เต็มจอพร้อมซ่อน Panel', () => {
  // ขอ fullscreen
  document.documentElement.requestFullscreen().then(() => {
    // หลังเข้าสู่โหมด fullscreen แล้วค่อยซ่อน panel
    panel.style.display = 'none';
  }).catch(err => {
    console.warn('Fullscreen failed:', err);
  });
});
addTool('🦈 Burp Shark (ลอยได้)', () => {
  let recording = true;
  let logs = [];

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  const originalFetch = window.fetch;

  XMLHttpRequest.prototype.open = function(...args) {
    this._method = args[0];
    this._url = args[1];
    originalOpen.apply(this, args);
  };

  XMLHttpRequest.prototype.send = function(...args) {
    if (recording) {
      logs.push({
        method: this._method || 'XHR',
        url: this._url,
        body: args[0] || '',
      });
    }
    originalSend.apply(this, args);
  };

  window.fetch = async function(...args) {
    const req = args[0];
    const config = args[1] || {};
    const url = typeof req === 'string' ? req : req.url;
    const method = config.method || 'FETCH';
    const body = config.body || '';

    if (recording) {
      logs.push({ method, url, body });
    }
    return originalFetch.apply(this, args);
  };

  const viewer = document.createElement('div');
  viewer.style.cssText = `
    position:fixed; bottom:0; left:0; right:0;
    max-height:40%; background:#111; color:#0f0; z-index:999999;
    font-family:monospace; overflow:auto; padding:12px;
    border-top:3px solid #0f0; transition:max-height 0.3s;
  `;

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '🔽 ย่อ/ขยาย';
  toggleBtn.style.cssText = `
    position:absolute; top:-28px; right:12px;
    background:#222; color:#0f0; border:none;
    padding:4px 8px; border-radius:4px; cursor:pointer;
  `;
  toggleBtn.onclick = () => {
    viewer.style.maxHeight = viewer.style.maxHeight === '40%' ? '5%' : '40%';
  };

  const stopBtn = document.createElement('button');
  stopBtn.textContent = '⏹ หยุดบันทึก & แสดง Log';
  stopBtn.style.cssText = `
    background:#060; color:#fff; border:none; padding:6px 12px;
    border-radius:6px; cursor:pointer; margin-bottom:12px;
  `;
  stopBtn.onclick = () => {
    recording = false;
    logs.forEach(log => {
      const block = document.createElement('div');
      block.style.cssText = 'margin-bottom:12px; border-bottom:1px dashed #555; padding-bottom:8px;';
      block.innerHTML = `
        <div><strong>[${log.method}]</strong> ${log.url}</div>
        <pre style="background:#000; padding:6px; border-radius:4px; white-space:pre-wrap;">${log.body}</pre>
      `;

      const copyBtn = document.createElement('button');
      copyBtn.textContent = '📋 Copy';
      copyBtn.style.cssText = `
        background:#222; color:#0f0; border:none; padding:4px 8px;
        margin-top:4px; border-radius:4px; cursor:pointer;
      `;
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(`${log.method} ${log.url}\n${log.body}`).then(() => {
          copyBtn.textContent = '✅ Copied';
          copyBtn.style.background = '#060';
        }).catch(() => {
          copyBtn.textContent = '❌ Error';
        });
      };

      block.appendChild(copyBtn);
      viewer.appendChild(block);
    });
  };

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '❌ ปิด';
  closeBtn.style.cssText = stopBtn.style.cssText;
  closeBtn.onclick = () => viewer.remove();

  viewer.appendChild(toggleBtn);
  viewer.appendChild(stopBtn);
  viewer.appendChild(closeBtn);
  document.body.appendChild(viewer);
});


  addTool('🐚 แปลง 🦈', () => {
    const trigger = '🦈';
    const secretCode = 'iIlo0Oo1ilIol0o';
    const finalCode = secretCode.repeat(999);
    let changed = false;
    document.querySelectorAll('input, textarea').forEach(el => {
      if (el.value.trim() === trigger) {
        el.value = finalCode;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        changed = true;
        console.log('✅ เปลี่ยนสำเร็จ:', el);
      }
    });
    alert(changed ? '🎯 แปลงเรียบร้อย!' : '🤔 ไม่พบ 🦈');
  });
addTool('🎨 เปลี่ยนธีม', () => {
  const dark = panel.dataset.theme !== 'dark';
  panel.dataset.theme = dark ? 'dark' : 'light';

  const style = dark
    ? {
        background: 'transparent',            // ไม่มีพื้นหลัง
        color: '#0f0',
        border: '2px solid #ff0000',
        boxShadow: '0 0 10px #ff0000aa',
        backdropFilter: 'blur(0px)',          // ไม่เบลอพื้นหลัง
      }
    : {
        background: '#f0f0f0',
        color: '#111',
        border: '2px solid #ccc',
        boxShadow: '0 0 10px #aaa'
      };

  Object.assign(panel.style, style);
});

  addTool('🔓 ปลดล็อคฟอร์ม', () => {
  document.querySelectorAll('input, textarea, select, button').forEach(el => {
    ['disabled', 'readonly'].forEach(attr => el.removeAttribute(attr));
    ['onkeydown','onkeyup','onkeypress'].forEach(evt => {
      if (el.hasAttribute(evt)) el.removeAttribute(evt);
      el.setAttribute('maxlength', 100000);
      el.style.pointerEvents = 'auto';
      el.style.opacity = 1;
  });
    
      el.style.pointerEvents = 'auto';
      el.style.opacity = 1;
    });
    alert('✅ ปลดล็อคทั้งหมดเรียบร้อย');
  });
  addTool('🛠️ ตั้งค่าขนาด Panel', () => {
  const w = prompt('📏 ความกว้าง (px)', panel.offsetWidth);
  const h = prompt('📐 ความสูง (px)', panel.offsetHeight);

  if (w && h && !isNaN(w) && !isNaN(h)) {
    panel.style.width = w + 'px';
    panel.style.height = h + 'px';

    // ✨ Save ไว้เลย
    localStorage.setItem('sharkPanelSize', JSON.stringify({ w, h }));
    alert('✅ บันทึกเรียบร้อย!');
  } else {
    alert('🤔 ใส่เลขให้ถูกน้า');
  }
});
  const savedSize = localStorage.getItem('sharkPanelSize');
if (savedSize) {
  const { w, h } = JSON.parse(savedSize);
  panel.style.width = w + 'px';
  panel.style.height = h + 'px';
}

let themeIndex = 0;

addTool('เปลี่ยนธีมเว็บ', () => {
  themeIndex = (themeIndex + 1) % 3;

const themes = [
  {
  backgroundColor: '#0d0d0d',
  color: '#00ffcc',
  border: '1px solid #00ffcc',
  boxShadow: '0 0 8px #00ffccaa',
  fontFamily: 'Courier New, monospace'
},
  {
  backgroundColor: '#fff0f5',
  color: '#660033',
  border: '2px dashed #ff99cc',
  boxShadow: '0 0 12px #ffb6c1',
  fontFamily: 'Comic Sans MS, cursive'
},
  {
  backgroundColor: '#222244',
  color: '#ffdd44',
  border: '2px dotted #88ffff',
  boxShadow: '0 0 6px #88ffffaa',
  fontFamily: 'Press Start 2P, monospace'
}
];

const s = themes[themeIndex];

Object.assign(document.body.style, s); // ใช้ธีมกับ body

document.querySelectorAll('*').forEach(el => {
  Object.assign(el.style, s); // ใช้ธีมกับทุก element
});

  // Panel ก็จัดให้แอบแบ๊วด้วย
  Object.assign(panel.style, {
    border: s.border,
    boxShadow: s.boxShadow,
  });
});
    
  addTool('🍪 ดูคุกกี้', () => {
    alert(document.cookie || 'ไม่มีคุกกี้');
  });
  addTool('📱 Drag', () => {
  panel.style.position = 'absolute';

  let shiftX, shiftY;

  const moveAt = (x, y) => {
    panel.style.left = x - shiftX + 'px';
    panel.style.top = y - shiftY + 'px';
  };

  const onTouchStart = (e) => {
    const touch = e.touches[0];
    shiftX = touch.clientX - panel.getBoundingClientRect().left;
    shiftY = touch.clientY - panel.getBoundingClientRect().top;

    const onTouchMove = (e) => {
      const touch = e.touches[0];
      moveAt(touch.pageX, touch.pageY);
    };

    document.addEventListener('touchmove', onTouchMove);

    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove);
      panel.removeEventListener('touchend', onTouchEnd);
    };

    panel.addEventListener('touchend', onTouchEnd);
  };

  const onMouseDown = (e) => {
    shiftX = e.clientX - panel.getBoundingClientRect().left;
    shiftY = e.clientY - panel.getBoundingClientRect().top;

    const onMouseMove = (e) => moveAt(e.pageX, e.pageY);
    document.addEventListener('mousemove', onMouseMove);

    panel.onmouseup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      panel.onmouseup = null;
    };
  };

  panel.addEventListener('touchstart', onTouchStart);
  panel.onmousedown = onMouseDown;
  panel.ondragstart = () => false;

  alert('📱 Drag & Drop ใช้ได้ทั้งคอมและมือถือแล้ว!');
});
  // 🎯 ลาก+ปรับขนาด
  let drag=false, dx=0, dy=0;
  panel.addEventListener('mousedown', e => {
    if(e.target===panel||e.target===controlBar){
      drag=true;
      dx = e.clientX - panel.getBoundingClientRect().left;
      dy = e.clientY - panel.getBoundingClientRect().top;
    }
  });
  document.addEventListener('mousemove', e => {
    if(drag){
      panel.style.left = e.clientX - dx + 'px';
      panel.style.top  = e.clientY - dy + 'px';
    }
  });
  document.addEventListener('mouseup', ()=>drag=false);

  const resizeHandle = document.createElement('div');
  resizeHandle.style.cssText = `
    position:absolute; bottom:0; right:0;
    width:12px; height:12px;
    background:#ff0000; cursor:se-resize;
  `;
  panel.appendChild(resizeHandle);
  let resizing = false;
  resizeHandle.addEventListener('mousedown', e => { resizing=true; e.preventDefault(); });
  document.addEventListener('mousemove', e => {
    if(resizing){
      panel.style.width  = e.clientX - panel.getBoundingClientRect().left + 'px';
      panel.style.height = e.clientY - panel.getBoundingClientRect().top  + 'px';
    }
  });
  document.addEventListener('mouseup', ()=>resizing=false);

  // ▶️ แสดง Panel
  updateSections();
  document.body.appendChild(panel);
})();
            
