javascript: (function () {
  // สร้าง panel
  const panel = document.createElement('div');
panel.style.cssText = `
  position:fixed; top:250px; right:20px; z-index:999999;
  background:rgba(0,0,0,0.15); /* โปร่งใส */
  color:#39ff14; /* เขียวนีออน */
  padding:8px; border-radius:10px;
  font-family:monospace; font-size:15px;
  border:2px solid #ff0000; /* ขอบแดง */
  box-shadow:0 0 18px 2px #ff0000cc;
  width:106px; height:320px; overflow:auto;
  transition:height 0.2s;
  backdrop-filter: blur(2px);
  display:flex; flex-direction:column; gap:7px;
  align-items:stretch; flex-wrap:wrap;
`;
  panel.textContent = 'Monitor';
  function addTool(label, fn){
      const btn = document.createElement('button');
      btn.textContent = label;
  btn.style.cssText = `
    padding:6px; background:rgba(0,0,0,0); color:#0f0;
    border:1px solid #ff0000; border-radius:6px; cursor:pointer;
    font-family:monospace;
    display:block; width:100%; margin-bottom:0;
  `;
      btn.onclick = fn;
      panel.appendChild(btn);
    }
  // ปุ่มพับ (minimize)
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '↕';
  toggleBtn.title = 'พับ/ขยาย';
  toggleBtn.style.cssText = `
  position:absolute; top:6px; right:65px;
  background:rgba(0,0,0,0); color:#39ff14;
  border:1px solid #ff0000; border-radius:5px;
  font-size:18px; cursor:pointer; width:28px; height:28px;
  box-shadow:0 0 4px #ff0000cc;
`;
  let minimized = false;
  toggleBtn.onclick = () => {
      if (panel) {
          minimized = !minimized;
          panel.style.height = minimized ? '38px' : '320px';
      }
  };

  // ปุ่มปิด
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.title = 'ปิดแผง';
  closeBtn.style.cssText = `
  position:absolute; top:6px; right:6px;
  background:rgba(0,0,0,0); color:#ff0000;
  border:1px solid #ff0000; border-radius:5px;
  font-size:18px; cursor:pointer; width:28px; height:28px;
  box-shadow:0 0 4px #ff0000cc;
`;
  closeBtn.onclick = () => {
      if (panel) {
          panel.remove();
      }
  };

  // เพิ่มปุ่มลงใน panel
  if (panel) {
      panel.appendChild(toggleBtn);
      panel.appendChild(closeBtn);
  }

  // ฟังก์ชันลาก (PC+Mobile)
  let dragging = false, offsetX = 0, offsetY = 0;
  if (panel) {
      panel.addEventListener('mousedown', function (e) {
          if (e.target === panel || e.target === toggleBtn || e.target === closeBtn) {
              dragging = true;
              offsetX = e.clientX - panel.getBoundingClientRect().left;
              offsetY = e.clientY - panel.getBoundingClientRect().top;
              document.body.style.userSelect = 'none';
          }
      });
  }
  document.addEventListener('mousemove', function (e) {
      if (dragging) {
          if (panel) {
              panel.style.left = (e.clientX - offsetX) + 'px';
              panel.style.top = (e.clientY - offsetY) + 'px';
          }
      }
  });
  document.addEventListener('mouseup', function () {
      dragging = false;
      document.body.style.userSelect = '';
  });
  // Touch (Mobile)
  if (panel) {
      panel.addEventListener('touchstart', function (e) {
          const t = e.touches[0];
          dragging = true;
          offsetX = t.clientX - panel.getBoundingClientRect().left;
          offsetY = t.clientY - panel.getBoundingClientRect().top;
      });
  }
  document.addEventListener('touchmove', function (e) {
      if (dragging) {
          const t = e.touches[0];
          if (panel) {
              panel.style.left = (t.clientX - offsetX) + 'px';
              panel.style.top = (t.clientY - offsetY) + 'px';
          }
      }
  });
  document.addEventListener('touchend', function () {
      dragging = false;
  });
  addTool('tool', () => {
      const script = document.createElement('script');
      script.src = "https://giftforyoutruemoneywalletfake.netlify.app/sell/tool.js";
      document.body.appendChild(script);
  });
  // ตัวอย่างสำหรับ miniburp และ sharksniff (ให้แทนที่ URL จริงหลัง deploy)
  addTool('miniburp', () => {
      const script = document.createElement('script');
      script.src = "https://yourdomain/miniburp.js";
      document.body.appendChild(script);
  });
  addTool('sharksniff', () => {
      const script = document.createElement('script');
      script.src = "https://yourdomain/sharksniff.js";
      document.body.appendChild(script);
  });

  addTool(' ปลด🔓 ', () => {
      if (document) {
          document.querySelectorAll('input, textarea, select, button').forEach(el => {
              ['disabled', 'readonly'].forEach(attr => el.removeAttribute(attr));
              ['onkeydown', 'onkeyup', 'onkeypress'].forEach(evt => {
                  if (el.hasAttribute(evt)) el.removeAttribute(evt);
                  el.setAttribute('maxlength', 100000);

              });
          });
          alert('✅ ปลดล็อคทั้งหมดเรียบร้อย');
      }
  });

  if (panel) {
      document.body.appendChild(panel);
  }
})();