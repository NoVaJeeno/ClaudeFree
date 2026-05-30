/**
 * AURA Retail Advisory Widget v1.0
 * JP Aring Advisory — https://jp-aring-advisory.de
 * 
 * Einbindung:
 * <script src="aura-retail-widget.js"></script>
 * <script>AuraRetail.init({ apiKey: 'IHR_API_KEY' });</script>
 */

(function(window) {
  'use strict';

  const AuraRetail = {
    
    config: {
      apiKey: '',
      apiUrl: 'https://api.jp-aring-advisory.de/api/v1/analyze',
      // Lokaler Fallback (wenn Tunnel aktiv):
      // apiUrl: 'http://100.79.19.27:49480/api/v1/analyze',
      primaryColor: '#1a3a5c',
      accentColor: '#c8a45a',
      position: 'bottom-right',
      title: '360° Retail Analyse',
      subtitle: 'KI-gestützte Beratung',
      placeholder: 'Stellen Sie Ihre Retail-Frage... z.B. "Wie optimiere ich meine Flächenproduktivität?"',
      welcomeMessage: 'Willkommen bei JP Aring Advisory. Ich bin Ihr KI-Analyst für Retail-Excellence. Stellen Sie mir Ihre Frage — ich erstelle eine vollständige, umsetzbare Analyse für Sie.'
    },

    _open: false,
    _loading: false,
    _history: [],

    init: function(options) {
      Object.assign(this.config, options || {});
      this._injectStyles();
      this._buildWidget();
      this._bindEvents();
      console.log('[AuraRetail] Widget initialisiert');
    },

    _injectStyles: function() {
      const style = document.createElement('style');
      style.id = 'aura-retail-styles';
      style.textContent = `
        :root {
          --ar-primary: ${this.config.primaryColor};
          --ar-accent: ${this.config.accentColor};
          --ar-bg: #0d1f35;
          --ar-surface: #162840;
          --ar-border: rgba(200,164,90,0.25);
          --ar-text: #e8ecf0;
          --ar-text-muted: #8899aa;
          --ar-radius: 12px;
          --ar-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,164,90,0.15);
        }
        #ar-bubble {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--ar-primary), #243f5e);
          border: 2px solid var(--ar-accent);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 0 0 rgba(200,164,90,0.4);
          transition: transform 0.2s, box-shadow 0.3s;
          animation: ar-pulse 2.5s infinite;
        }
        #ar-bubble:hover { transform: scale(1.08); }
        @keyframes ar-pulse {
          0%,100% { box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 0 0 rgba(200,164,90,0.4); }
          50% { box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 0 10px rgba(200,164,90,0); }
        }
        #ar-bubble svg { width: 28px; height: 28px; color: var(--ar-accent); }
        #ar-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--ar-accent);
          color: var(--ar-primary);
          font-size: 9px;
          font-weight: 800;
          padding: 2px 5px;
          border-radius: 10px;
          letter-spacing: 0.3px;
          font-family: -apple-system, sans-serif;
        }
        #ar-panel {
          position: fixed;
          bottom: 100px;
          right: 28px;
          width: 420px;
          max-height: 620px;
          background: var(--ar-surface);
          border: 1px solid var(--ar-border);
          border-radius: var(--ar-radius);
          box-shadow: var(--ar-shadow);
          display: none;
          flex-direction: column;
          z-index: 9998;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow: hidden;
          animation: ar-fadeIn 0.25s ease;
        }
        @keyframes ar-fadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        #ar-panel.open { display: flex; }
        #ar-header {
          background: linear-gradient(135deg, var(--ar-primary) 0%, #1e3f62 100%);
          padding: 16px 18px;
          border-bottom: 1px solid var(--ar-border);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        #ar-header-icon {
          width: 40px;
          height: 40px;
          background: rgba(200,164,90,0.15);
          border: 1px solid var(--ar-accent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        #ar-header-icon svg { width: 22px; height: 22px; color: var(--ar-accent); }
        #ar-header-text { flex: 1; }
        #ar-header-title {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          letter-spacing: 0.2px;
        }
        #ar-header-sub {
          font-size: 11px;
          color: var(--ar-accent);
          margin: 2px 0 0;
          font-weight: 500;
        }
        #ar-close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--ar-text-muted);
          font-size: 20px;
          line-height: 1;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.15s;
        }
        #ar-close:hover { color: #fff; }
        #ar-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-height: 200px;
          max-height: 400px;
          scrollbar-width: thin;
          scrollbar-color: rgba(200,164,90,0.3) transparent;
        }
        #ar-messages::-webkit-scrollbar { width: 4px; }
        #ar-messages::-webkit-scrollbar-thumb { background: rgba(200,164,90,0.3); border-radius: 2px; }
        .ar-msg {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          animation: ar-msgIn 0.2s ease;
        }
        @keyframes ar-msgIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        .ar-msg.user { flex-direction: row-reverse; }
        .ar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 14px;
        }
        .ar-avatar.bot {
          background: rgba(200,164,90,0.12);
          border: 1px solid rgba(200,164,90,0.3);
          color: var(--ar-accent);
        }
        .ar-avatar.user {
          background: rgba(26,58,92,0.8);
          border: 1px solid rgba(100,140,180,0.3);
          color: #aac;
        }
        .ar-bubble-msg {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.65;
        }
        .ar-bubble-msg.bot {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--ar-text);
        }
        .ar-bubble-msg.user {
          background: linear-gradient(135deg, var(--ar-primary), #1e3f62);
          border: 1px solid rgba(200,164,90,0.2);
          color: #dde6f0;
        }
        .ar-bubble-msg h3 {
          font-size: 13px;
          font-weight: 700;
          color: var(--ar-accent);
          margin: 12px 0 5px;
        }
        .ar-bubble-msg h3:first-child { margin-top: 0; }
        .ar-bubble-msg p { margin: 0 0 8px; }
        .ar-bubble-msg p:last-child { margin: 0; }
        .ar-bubble-msg ul, .ar-bubble-msg ol {
          margin: 6px 0;
          padding-left: 18px;
        }
        .ar-bubble-msg li { margin: 3px 0; }
        .ar-bubble-msg strong { color: #c8d8e8; font-weight: 600; }
        .ar-typing {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 8px 0;
        }
        .ar-typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ar-accent);
          opacity: 0.5;
          animation: ar-dot 1.2s infinite;
        }
        .ar-typing span:nth-child(2) { animation-delay: 0.2s; }
        .ar-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ar-dot { 0%,80%,100% { transform:scale(1); opacity:0.4; } 40% { transform:scale(1.3); opacity:1; } }
        #ar-input-area {
          padding: 12px 16px;
          border-top: 1px solid var(--ar-border);
          background: rgba(0,0,0,0.2);
        }
        #ar-examples {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }
        .ar-ex-btn {
          font-size: 10px;
          padding: 4px 10px;
          background: rgba(200,164,90,0.08);
          border: 1px solid rgba(200,164,90,0.25);
          border-radius: 20px;
          color: var(--ar-accent);
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
        }
        .ar-ex-btn:hover { background: rgba(200,164,90,0.18); }
        #ar-input-row {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }
        #ar-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(200,164,90,0.2);
          border-radius: 8px;
          padding: 9px 12px;
          color: var(--ar-text);
          font-size: 13px;
          font-family: inherit;
          resize: none;
          min-height: 42px;
          max-height: 120px;
          outline: none;
          transition: border-color 0.2s;
          line-height: 1.5;
        }
        #ar-input:focus { border-color: rgba(200,164,90,0.55); }
        #ar-input::placeholder { color: var(--ar-text-muted); font-size: 12px; }
        #ar-send {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, var(--ar-accent), #a8843a);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s, transform 0.1s;
        }
        #ar-send:hover { opacity: 0.9; }
        #ar-send:active { transform: scale(0.96); }
        #ar-send:disabled { opacity: 0.4; cursor: not-allowed; }
        #ar-send svg { width: 18px; height: 18px; color: #1a3a5c; }
        #ar-footer {
          text-align: center;
          font-size: 10px;
          color: var(--ar-text-muted);
          padding: 6px 0 4px;
          letter-spacing: 0.3px;
        }
        @media (max-width: 480px) {
          #ar-panel { width: calc(100vw - 20px); right: 10px; bottom: 90px; }
        }
      `;
      document.head.appendChild(style);
    },

    _buildWidget: function() {
      // Bubble Button
      const bubble = document.createElement('div');
      bubble.id = 'ar-bubble';
      bubble.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
        <div id="ar-badge">KI</div>
      `;
      document.body.appendChild(bubble);

      // Panel
      const panel = document.createElement('div');
      panel.id = 'ar-panel';
      panel.innerHTML = `
        <div id="ar-header">
          <div id="ar-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div id="ar-header-text">
            <p id="ar-header-title">${this.config.title}</p>
            <p id="ar-header-sub">${this.config.subtitle}</p>
          </div>
          <button id="ar-close">✕</button>
        </div>
        <div id="ar-messages"></div>
        <div id="ar-input-area">
          <div id="ar-examples">
            <button class="ar-ex-btn" data-q="Wie verbessere ich meine Flächenproduktivität?">📊 Flächenproduktivität</button>
            <button class="ar-ex-btn" data-q="Analysiere typische Effizienz-Killer im Filialmanagement">🔍 Effizienz-Killer</button>
            <button class="ar-ex-btn" data-q="Wie reduziere ich Shrinkage unter 1% im Einzelhandel?">🛡️ Shrinkage</button>
            <button class="ar-ex-btn" data-q="Erstelle einen KPI-Plan für ein Retail-Team">📈 KPI-Plan</button>
          </div>
          <div id="ar-input-row">
            <textarea id="ar-input" rows="1" placeholder="${this.config.placeholder}"></textarea>
            <button id="ar-send">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <div id="ar-footer">Powered by AURA · JP Aring Advisory · Retail KI-Analyst</div>
        </div>
      `;
      document.body.appendChild(panel);

      // Willkommensnachricht
      this._addMsg('bot', this.config.welcomeMessage);
    },

    _bindEvents: function() {
      const self = this;
      document.getElementById('ar-bubble').addEventListener('click', () => self.toggle());
      document.getElementById('ar-close').addEventListener('click', () => self.close());
      document.getElementById('ar-send').addEventListener('click', () => self._send());
      
      const input = document.getElementById('ar-input');
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          self._send();
        }
      });
      input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
      });

      // Beispiel-Buttons
      document.querySelectorAll('.ar-ex-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const q = this.getAttribute('data-q');
          document.getElementById('ar-input').value = q;
          self._send();
        });
      });
    },

    toggle: function() {
      this._open ? this.close() : this.open();
    },

    open: function() {
      this._open = true;
      document.getElementById('ar-panel').classList.add('open');
      document.getElementById('ar-bubble').style.animation = 'none';
      setTimeout(() => document.getElementById('ar-input').focus(), 100);
    },

    close: function() {
      this._open = false;
      document.getElementById('ar-panel').classList.remove('open');
      document.getElementById('ar-bubble').style.animation = '';
    },

    _addMsg: function(role, text) {
      const msgs = document.getElementById('ar-messages');
      const div = document.createElement('div');
      div.className = `ar-msg ${role}`;

      const avatar = document.createElement('div');
      avatar.className = `ar-avatar ${role}`;
      avatar.textContent = role === 'bot' ? '◈' : '👤';

      const bubble = document.createElement('div');
      bubble.className = `ar-bubble-msg ${role}`;

      if (role === 'bot') {
        // Einfaches Markdown
        let html = text
          .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          .replace(/##\s*(.+)/g, '<h3>$1</h3>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
          .replace(/^[-•]\s(.+)$/gm, '<li>$1</li>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br>');
        bubble.innerHTML = `<p>${html}</p>`;
      } else {
        bubble.textContent = text;
      }

      div.appendChild(avatar);
      div.appendChild(bubble);
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return div;
    },

    _showTyping: function() {
      const msgs = document.getElementById('ar-messages');
      const div = document.createElement('div');
      div.id = 'ar-typing-indicator';
      div.className = 'ar-msg bot';
      div.innerHTML = `
        <div class="ar-avatar bot">◈</div>
        <div class="ar-bubble-msg bot">
          <div class="ar-typing">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    },

    _hideTyping: function() {
      const t = document.getElementById('ar-typing-indicator');
      if (t) t.remove();
    },

    _send: async function() {
      if (this._loading) return;
      const input = document.getElementById('ar-input');
      const question = input.value.trim();
      if (!question) return;

      this._addMsg('user', question);
      input.value = '';
      input.style.height = 'auto';
      this._showTyping();

      const sendBtn = document.getElementById('ar-send');
      sendBtn.disabled = true;
      this._loading = true;

      try {
        const res = await fetch(AuraRetail.config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': AuraRetail.config.apiKey
          },
          body: JSON.stringify({ question })
        });

        const data = await res.json();
        this._hideTyping();

        if (data.success && data.analysis) {
          this._addMsg('bot', data.analysis);
        } else if (data.error) {
          this._addMsg('bot', `⚠️ ${data.error}`);
        } else {
          this._addMsg('bot', 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
        }
      } catch (err) {
        this._hideTyping();
        this._addMsg('bot', '⚠️ Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung.');
        console.error('[AuraRetail]', err);
      } finally {
        this._loading = false;
        sendBtn.disabled = false;
        document.getElementById('ar-messages').scrollTop = 99999;
      }
    }
  };

  window.AuraRetail = AuraRetail;

})(window);
