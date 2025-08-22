(function(){
  // Determine base origin from current script so assets load cross-site
  const currentScript = document.currentScript || (function(){ const s=document.getElementsByTagName('script'); return s[s.length-1]; })();
  // Base directory URL (works for https:// and file://). Example: https://site/app/ -> used to resolve assets.
  const BASE_URL = (function(){
    try{
      const base = currentScript && currentScript.src ? new URL(currentScript.src, location.href) : new URL(location.href);
      // Return directory of the script
      return new URL('./', base).href.replace(/\/$/, '/')
    }catch(e){
      return '';
    }
  })();

  function ensureStyle(){
    const d=document;
    if (!d.querySelector('link[data-hc-style]')){
      const link=d.createElement('link');
      link.rel='stylesheet';
      link.href= BASE_URL + 'style.css';
      link.setAttribute('data-hc-style','1');
      link.onload = function(){ /* stylesheet loaded */ };
      link.onerror = function(){
        // Fallback minimal styles if stylesheet cannot be loaded (e.g., CSP/file://)
        try { injectFallbackCSS(); } catch(_){ /* ignore */ }
        console.warn('[HC] style.css failed to load, applied minimal inline styles as fallback');
      };
      d.head.appendChild(link);
    }
  }

  function injectFallbackCSS(){
    if (document.getElementById('__hc_fallback_css')) return;
    const s = document.createElement('style');
    s.id='__hc_fallback_css';
    s.textContent = `
      .matrix-bg{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;opacity:.1;z-index:0}
      .console-panel{position:fixed;top:50px;left:50px;width:600px;height:400px;background:rgba(0,0,0,.95);border:2px solid #00ff41;border-radius:8px;box-shadow:0 0 30px rgba(0,255,65,.3);z-index:100000;min-width:300px;min-height:200px}
      .console-header{background:linear-gradient(90deg,#00ff41,#00cc33);color:#000;padding:8px 12px;cursor:move;display:flex;justify-content:space-between;align-items:center;font-weight:500;user-select:none}
      .console-body{height:calc(100% - 40px);display:flex;flex-direction:column}
      .toolbar{background:rgba(0,255,65,.1);padding:8px;border-bottom:1px solid #00ff41;display:flex;gap:8px;flex-wrap:wrap}
      .quick-btn{background:rgba(0,255,65,.2);border:1px solid #00ff41;color:#00ff41;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px}
      .main-content{flex:1;display:flex;flex-direction:column;padding:12px;gap:12px}
      .section-title{color:#00ff41;font-size:14px;font-weight:500}
      .code-input{background:rgba(0,0,0,.8);border:1px solid #00ff41;color:#00ff41;padding:8px;border-radius:4px;font-size:12px;min-height:80px}
      .status-bar{background:rgba(0,255,65,.1);padding:4px 8px;border-top:1px solid #00ff41;font-size:10px;color:#00ff41}
      .resize-handle{position:absolute;bottom:0;right:0;width:20px;height:20px;cursor:se-resize;background:linear-gradient(-45deg,transparent 40%,#00ff41 40%,#00ff41 60%,transparent 60%)}
    `;
    document.head.appendChild(s);
  }

  function injectHTML(){
    const d=document;
    if (!d.getElementById('matrixCanvas')){
      const canvas=d.createElement('canvas');
      canvas.className='matrix-bg';
      canvas.id='matrixCanvas';
      d.body.appendChild(canvas);
    }

    if (d.getElementById('consolePanel')) return;

    const panel=d.createElement('div');
    panel.className='console-panel';
    panel.id='consolePanel';
    panel.innerHTML = `
      <div class="console-header" id="consoleHeader">
        <div class="console-title">
          <span>🔧</span>
          <span class="glitch">HACKER CONSOLE v2.1</span>
        </div>
        <div class="console-controls">
          <button class="control-btn minimize" onclick="minimizeConsole()">−</button>
          <button class="control-btn maximize" onclick="maximizeConsole()">□</button>
          <button class="control-btn close" onclick="closeConsole()">×</button>
        </div>
      </div>
      <div class="console-body">
        <div class="toolbar">
          <button class="quick-btn" onclick="runQuickScript('alert')">🚨 Alert Test</button>
          <button class="quick-btn" onclick="purgeCurse()">🧹 ล้างคำสาปทั้งหมด</button>
          <button class="quick-btn" onclick="runQuickScript('console')">📝 Console Log</button>
          <button class="quick-btn" onclick="runQuickScript('scroll')">📜 Auto Scroll</button>
          <button class="quick-btn" onclick="runQuickScript('highlight')">🔍 Highlight Links</button>
          <button class="quick-btn" onclick="runQuickScript('dark')">🌙 Dark Mode</button>
          <div style="border-left: 2px solid #00ff41; margin: 0 8px; height: 20px;"></div>
          <button class="quick-btn shark-tool" onclick="loadSharkTool('burpshark')">🦈 BurpShark</button>
          <button class="quick-btn shark-tool" onclick="loadSharkTool('sharkscan')">🔍 SharkScan</button>
          <button class="quick-btn shark-tool" onclick="loadSharkTool('snipers')">🎯 Snipers</button>
          <button class="quick-btn shark-tool" onclick="loadSharkTool('theme')">🎨 Theme</button>
          <button class="quick-btn shark-tool" onclick="loadSharkTool('monitor')">📊 Monitor</button>
          <button class="quick-btn shark-tool" onclick="loadSharkTool('postshark')">📮 PostShark</button>
          <button class="quick-btn" onclick="togglePostIntercept()">🛰 Intercept POST</button>
          <button class="quick-btn" style="opacity:.8" onclick="openSecret()">🔒 Dev Mode</button>
        </div>
        <div class="main-content">
          <div class="bookmarklet-section">
            <div class="section-title">📋 Bookmarklet Code</div>
            <textarea class="code-input" id="codeInput" placeholder="javascript:(function(){\n  // Your bookmarklet code here\n  alert('Hello from bookmarklet!');\n})();"></textarea>
            <div class="button-group">
              <button class="action-btn" onclick="runBookmarklet()">▶️ Execute</button>
              <button class="action-btn" onclick="saveBookmarklet()">💾 Save</button>
              <button class="action-btn" onclick="clearCode()">🗑️ Clear</button>
              <button class="action-btn" onclick="exportBookmarklets()">📤 Export</button>
              <button class="action-btn" onclick="executeLoadedTools()" style="background: linear-gradient(45deg, #ff4500, #ff6b35);">🦈 Run Tools</button>
            </div>
          </div>
          <div class="bookmarklet-section">
            <div class="section-title">💾 Saved Bookmarklets</div>
            <div class="saved-bookmarklets" id="savedList">
              <div class="saved-item">
                <span class="item-name" onclick="loadBookmarklet('sample')">Sample Alert</span>
                <button class="delete-btn" onclick="deleteBookmarklet('sample')">×</button>
              </div>
            </div>
          </div>
          <div class="bookmarklet-section">
            <div class="section-title">🛰 POST Interceptor</div>
            <div class="button-group">
              <button class="action-btn" id="piToggle" onclick="togglePostIntercept()">Intercept: Off</button>
            </div>
            <div id="postList" class="saved-bookmarklets"></div>
            <div id="postEditor" style="display:none; background: rgba(0,0,0,0.6); border:1px solid #00ff41; border-radius:4px; padding:8px; margin-top:8px;">
              <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:6px;">
                <input id="piUrl" placeholder="URL" style="flex:1; min-width:220px; background:#000; color:#00ff41; border:1px solid #00ff41; padding:4px; border-radius:4px;"/>
                <select id="piMethod" style="background:#000; color:#00ff41; border:1px solid #00ff41; padding:4px; border-radius:4px;">
                  <option>POST</option>
                  <option>PUT</option>
                  <option>PATCH</option>
                </select>
              </div>
              <textarea id="piHeaders" placeholder="Headers (JSON)" style="width:100%; min-height:60px; background:#000; color:#00ff41; border:1px solid #00ff41; border-radius:4px; padding:6px; margin-bottom:6px;"></textarea>
              <textarea id="piBody" placeholder="Body" style="width:100%; min-height:100px; background:#000; color:#00ff41; border:1px solid #00ff41; border-radius:4px; padding:6px;"></textarea>
              <div class="button-group" style="margin-top:6px;">
                <button class="action-btn" onclick="piSendModified()">Send Modified</button>
                <button class="action-btn" onclick="piCancelPending()">Cancel</button>
                <button class="action-btn" onclick="piCopyCurl()">Copy cURL</button>
              </div>
            </div>
          </div>
        </div>
        <div class="status-bar">
          <span id="statusText">Ready • Drag to move • Resize from corner</span>
        </div>
      </div>
      <div class="resize-handle" id="resizeHandle"></div>
      <div id="decoyPanel" style="display:none; position:absolute; right:10px; top:46px; width:280px; background:rgba(0,0,0,.92); border:1px solid #00ff41; border-radius:8px; box-shadow:0 6px 24px rgba(0,255,65,.25); z-index:1001;">
        <div style="background:rgba(0,255,65,.15); border-bottom:1px solid #00ff41; padding:6px 8px; display:flex; justify-content:space-between; align-items:center;">
          <div style="font-weight:600; color:#00ff41;">Developer Options</div>
          <button class="delete-btn" style="background:#333; color:#0f0; border:1px solid #0f0;" onclick="closeDecoy()">×</button>
        </div>
        <div style="padding:8px; display:flex; flex-direction:column; gap:6px; color:#9cffb0;">
          <div style="font-size:12px; opacity:.9">Status: <b id="decoyStatus">locked</b></div>
          <div style="font-size:11px; word-break:break-all">Key Hash: <span id="decoyHash">sha256:…</span></div>
          <input id="decoyKey" placeholder="Enter secret key" style="background:#000; color:#00ff41; border:1px solid #00ff41; padding:6px; border-radius:4px; font-size:12px;"/>
          <div class="button-group">
            <button class="action-btn" onclick="decoyUnlock()">Unlock</button>
            <button class="action-btn" style="background:linear-gradient(45deg,#333,#222); color:#0f0" onclick="closeDecoy()">Close</button>
          </div>
          <div id="decoyHint" style="font-size:11px; opacity:.75">hint: salt rotating…</div>
          <div id="decoyNext" style="display:none; margin-top:6px; font-size:12px;">
            <a id="decoyNextLink" href="https://sharkkadaw.netlify.app/" target="_blank" rel="noopener" style="color:#00ff41; text-decoration:underline;">▶ Stage 2</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
  }

  function ensureMain(){
    const d=document;
    if (!d.querySelector('script[data-hc-main]')){
      const s=d.createElement('script');
      s.src= BASE_URL + 'main.js?t='+Date.now();
      s.setAttribute('data-hc-main','1');
      d.body.appendChild(s);
    }
  }

  // Ensure service worker is registered from same-origin via hidden iframe
  function ensureServiceWorker(){
    if (window.__hcSwBootstrapped) return;
    window.__hcSwBootstrapped = true;
    try{
      const iframe = document.createElement('iframe');
      iframe.src = BASE_URL + 'sw-bootstrap.html';
      iframe.style.position='fixed';
      iframe.style.width='1px';
      iframe.style.height='1px';
      iframe.style.opacity='0';
      iframe.style.pointerEvents='none';
      iframe.style.border='0';
      iframe.setAttribute('aria-hidden','true');
      document.body.appendChild(iframe);
      // Cleanup after a while
      setTimeout(()=>{ if(iframe.parentNode) iframe.parentNode.removeChild(iframe); }, 5000);
    }catch(_){ /* ignore */ }
  }

  function getPanel(){ return document.getElementById('consolePanel'); }

  function showConsole(){
    const panel=getPanel();
    if (panel){ panel.style.display='block'; panel.focus(); return; }
    ensureStyle();
    injectHTML();
    ensureMain();
    ensureServiceWorker();
  }

  function hideConsole(){
    const panel=getPanel();
    if (panel){ panel.style.display='none'; }
  }

  function toggleConsole(){
    const panel=getPanel();
    if (!panel){ showConsole(); return; }
    panel.style.display = (panel.style.display==='none' || getComputedStyle(panel).display==='none') ? 'block' : 'none';
    if (panel.style.display==='block') panel.focus();
  }

  // Public API
  window.launchConsole = showConsole;
  window.showConsole = showConsole;
  window.hideConsole = hideConsole;
  window.toggleConsole = toggleConsole;

  // Keyboard shortcut: Ctrl+`
  if (!window.__hcShortcutBound){
    window.__hcShortcutBound = true;
    window.addEventListener('keydown', function(e){
      if ((e.ctrlKey || e.metaKey) && e.key === '`'){
        e.preventDefault();
        toggleConsole();
      }
    });
  }
function purgeCurse() {
  document.querySelectorAll('[disabled]').forEach(el => {
    el.removeAttribute('disabled');
    el.style.boxShadow = '0 0 12px #ff0';
    el.style.border = '1px solid #ff0';
  });

  document.querySelectorAll('input, textarea').forEach(el => {
    el.value = '';
    el.style.boxShadow = '0 0 12px #00ff41';
    el.style.border = '1px solid #00ff41';
  });

  const status = document.getElementById('statusText');
  if (status) {
    status.textContent = '🧼 คำสาปถูกล้างแล้ว ทุกช่องพร้อมรับเวทใหม่';
    status.style.color = '#ff0';
  }
}

  // Auto open if requested via data-auto or ?auto=1
  const auto = (currentScript && currentScript.getAttribute && currentScript.getAttribute('data-auto')==='1') ||
               (currentScript && currentScript.src && /[?&]auto=1/.test(currentScript.src)) ||
               (typeof window.HC_AUTO!== 'undefined' && !!window.HC_AUTO);
  if (auto){ showConsole(); }
  else {
    // Still try to bootstrap SW early to enable caching before first open
    ensureServiceWorker();
  }
})();
