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

  // เก็บข้อมูล XHR
  const origXhrOpen = XMLHttpRequest.prototype.open;
  const origXhrSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this._method = method;
    this._url = url;
    origXhrOpen.apply(this, [method, url, ...rest]);
  };
  XMLHttpRequest.prototype.send = function(body) {
    const xhr = this;
    const start = Date.now();
    const onLoad = () => {
      if (recording) {
        logs.push({
          type: 'XHR',
          method: xhr._method,
          url: xhr._url,
          status: xhr.status,
          duration: Date.now() - start,
          requestHeaders: xhr._requestHeaders || {},
          requestBody: body || '',
          responseHeaders: parseHeaders(xhr.getAllResponseHeaders()),
          responseBody: xhr.responseText
        });
      }
      xhr.removeEventListener('load', onLoad);
    };
    xhr.addEventListener('load', onLoad);
    origXhrSend.apply(this, [body]);
  };

  // เก็บข้อมูล fetch
  const origFetch = window.fetch;
  window.fetch = async function(input, init = {}) {
    const start = Date.now();
    const url = typeof input === 'string' ? input : input.url;
    const method = init.method || (typeof input !== 'string' && input.method) || 'GET';
    const requestHeaders = init.headers || {};
    let requestBody = init.body || '';
    try {
      const resp = await origFetch.apply(this, [input, init]);
      const cloned = resp.clone();
      const text = await cloned.text();
      if (recording) {
        logs.push({
          type: 'FETCH',
          method,
          url,
          status: resp.status,
          duration: Date.now() - start,
          requestHeaders,
          requestBody,
          responseHeaders: parseHeadersArray([...resp.headers]),
          responseBody: text
        });
      }
      return resp;
    } catch (err) {
      console.warn('Fetch error:', err);
      throw err;
    }
  };

  // แปลง header string เป็น object
  function parseHeaders(raw) {
    return raw.trim().split(/[\r\n]+/).reduce((acc, line) => {
      const [k,v] = line.split(': ');
      acc[k] = v;
      return acc;
    }, {});
  }
  function parseHeadersArray(arr) {
    const acc = {};
    arr.forEach(([k,v]) => acc[k] = v);
    return acc;
  }

  // สร้าง UI
  const viewer = document.createElement('div');
  Object.assign(viewer.style, {
    position: 'fixed', bottom: '0', left: '0', right: '0',
    maxHeight: '50%', background: '#111', color: '#0f0',
    zIndex: 999999, fontFamily: 'monospace', padding: '8px',
    overflow: 'hidden', display: 'flex', flexDirection: 'column'
  });

  // แถบเครื่องมือบน
  const toolbar = document.createElement('div');
  toolbar.style.cssText = 'display:flex; gap:8px; margin-bottom:6px;';
  const btnPause = createBtn('⏸️ Pause', () => {
    recording = !recording;
    btnPause.textContent = recording ? '⏸️ Pause' : '▶️ Resume';
  });
  const btnClear = createBtn('🗑️ Clear', () => {
    logs = [];
    renderList([]);
  });
  const btnExport = createBtn('📤 Export HAR', () => {
    const har = {
      log: {
        version: '1.2',
        creator: { name: 'Burp Shark', version: '1.0' },
        entries: logs.map(l => ({
          startedDateTime: (new Date()).toISOString(),
          time: l.duration,
          request: {
            method: l.method,
            url: l.url,
            headers: objToHeadersArray(l.requestHeaders),
            postData: { text: l.requestBody }
          },
          response: {
            status: l.status,
            headers: objToHeadersArray(l.responseHeaders),
            content: { text: l.responseBody }
          }
        }))
      }
    };
    const blob = new Blob([JSON.stringify(har, null,2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'burp-shark.har'; a.click();
    URL.revokeObjectURL(url);
  });
  const searchInput = document.createElement('input');
  searchInput.placeholder = '🔍 ค้นหา URL หรือ Method';
  Object.assign(searchInput.style, { flex: '1', padding:'4px', background:'#222', color:'#0f0', border:'1px solid #0f0', borderRadius:'4px' });
  searchInput.oninput = () => {
    const term = searchInput.value.toLowerCase();
    renderList(logs.filter(l => l.url.toLowerCase().includes(term) || l.method.includes(term)));
  };

  toolbar.append(btnPause, btnClear, btnExport, searchInput);
  viewer.appendChild(toolbar);
  // … (อยู่ภายในฟังก์ชันของ Burp Shark)
  
  // 📂 โหลด HAR และแสดงผล
  addTool('📂 Load HAR', () => {
    const harText = prompt('วาง JSON HAR ที่นี่');
    if (!harText) return;
    let har;
    try {
      har = JSON.parse(harText);
    } catch (e) {
      return alert('รูปแบบ HAR ไม่ถูกต้อง');
    }
    const entries = (har.log && har.log.entries) || [];
    // แปลง entries กลับมาเป็นรูปแบบ logs เดิม
    logs = entries.map(e => ({
      type: 'HAR',
      method: e.request.method,
      url: e.request.url,
      status: e.response.status,
      duration: e.time,
      requestHeaders: (e.request.headers || []).reduce((o, h) => (o[h.name]=h.value, o), {}),
      requestBody: (e.request.postData && e.request.postData.text) || '',
      responseHeaders: (e.response.headers || []).reduce((o, h) => (o[h.name]=h.value, o), {}),
      responseBody: (e.response.content && e.response.content.text) || ''
    }));
    renderList(logs);
    alert(`โหลด HAR สำเร็จ: ${logs.length} รายการ`);
  });

  // แสดง viewer
  document.body.appendChild(viewer);
                             
  // พื้นที่รายการ log
  const listDiv = document.createElement('div');
  Object.assign(listDiv.style, { flex:'1', overflow:'auto', borderTop:'1px solid #0f0', paddingTop:'6px' });
  viewer.appendChild(listDiv);

  function renderList(arr) {
    listDiv.innerHTML = '';
    arr.forEach((l,i) => {
      const row = document.createElement('div');
      row.style.cssText = 'margin-bottom:8px; cursor:pointer;';
      row.innerHTML = `
        <div><strong>[${l.type}] ${l.method}</strong> ${l.url} <em>(${l.status}, ${l.duration}ms)</em></div>
      `;
      row.onclick = () => showDetails(l);
      listDiv.appendChild(row);
    });
  }

  // แสดงรายละเอียดตอนคลิก
  function showDetails(l) {
    const detail = document.createElement('div');
    Object.assign(detail.style, {
      position:'fixed', top:'10%', left:'10%', right:'10%', bottom:'10%',
      background:'#000', color:'#0f0', padding:'12px', overflow:'auto',
      border:'2px solid #0f0', zIndex:1000000
    });
    detail.innerHTML = `
      <h3>${l.method} ${l.url}</h3>
      <h4>Request Headers:</h4><pre>${JSON.stringify(l.requestHeaders,null,2)}</pre>
      <h4>Request Body:</h4><pre>${l.requestBody}</pre>
      <h4>Response Headers:</h4><pre>${JSON.stringify(l.responseHeaders,null,2)}</pre>
      <h4>Response Body:</h4><pre>${l.responseBody}</pre>
      <button id="closeDetail">❌ ปิด</button>
    `;
    detail.querySelector('#closeDetail').onclick = () => detail.remove();
    document.body.appendChild(detail);
  }

  // ฟังก์ชันช่วยเหลือ
  function createBtn(txt, fn) {
    const b = document.createElement('button');
    b.textContent = txt;
    Object.assign(b.style, {
      background:'#222', color:'#0f0', border:'1px solid #0f0',
      padding:'4px 8px', borderRadius:'4px', cursor:'pointer'
    });
    b.onclick = fn;
    return b;
  }
  function objToHeadersArray(obj) {
    return Object.entries(obj).map(([k,v])=>({ name:k, value:v }));
  }

  // แสดง viewer
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
            
