import { DayItinerary, LootItem, ChecklistItem, CardPromotion } from '../types/travel';

export function generateSingleFileHtml(
  itinerary: DayItinerary[],
  lootItems: LootItem[],
  checklist: ChecklistItem[],
  cards: CardPromotion[],
  exchangeRate: number
): string {
  const serializedItinerary = JSON.stringify(itinerary);
  const serializedLoot = JSON.stringify(lootItems);
  const serializedChecklist = JSON.stringify(checklist);
  const serializedCards = JSON.stringify(cards);

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>2026 首爾秋日獨旅手冊 (10/29 - 11/03) - 離線單檔手冊</title>
  <meta name="description" content="2026 首爾 6 天 5 夜自由行隨身離線手冊，包含每日時間軸、15kg 行李配重與戰利品記帳試算、雙向即時匯率換算。">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #FAF7F2;
      --card-bg: #FFFFFF;
      --border: #E8E2D9;
      --text-main: #231F1E;
      --text-muted: #6E655F;
      --ginkgo: #D97706;
      --maple: #B91C1C;
      --pine: #1E3A2F;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif;
      line-height: 1.6;
      padding-bottom: 80px;
    }
    header {
      background: #FFFFFF;
      border-bottom: 1px solid var(--border);
      padding: 16px 20px;
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .header-content {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-family: 'Noto Serif TC', serif;
      font-weight: 700;
      font-size: 1.15rem;
      color: #231F1E;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 9999px;
      background: #FEF3C7;
      color: #92400E;
      font-weight: 600;
    }
    nav.tab-bar {
      max-width: 1000px;
      margin: 12px auto;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 4px 16px;
      scrollbar-width: none;
    }
    nav.tab-bar::-webkit-scrollbar { display: none; }
    .nav-btn {
      white-space: nowrap;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: #FFFFFF;
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .nav-btn.active {
      background: #231F1E;
      color: #FFFFFF;
      border-color: #231F1E;
    }
    main {
      max-width: 1000px;
      margin: 0 auto;
      padding: 16px;
    }
    .tab-pane { display: none; }
    .tab-pane.active { display: block; }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .day-selector {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      margin-bottom: 16px;
      padding-bottom: 4px;
    }
    .day-chip {
      padding: 8px 14px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: #FFFFFF;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }
    .day-chip.active {
      background: #D97706;
      color: #FFFFFF;
      border-color: #D97706;
    }
    .timeline-item {
      padding: 14px;
      border-left: 3px solid #D97706;
      background: #FAF7F2;
      border-radius: 0 10px 10px 0;
      margin-bottom: 12px;
    }
    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .timeline-time {
      font-size: 13px;
      font-weight: 700;
      color: #D97706;
      font-family: monospace;
    }
    .timeline-title {
      font-weight: 700;
      font-size: 15px;
      color: #231F1E;
    }
    .input-box {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 15px;
      margin-top: 6px;
      background: #FFFFFF;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    @media (max-width: 640px) {
      .grid-2 { grid-template-columns: 1fr; }
    }
    .progress-bar-bg {
      height: 10px;
      background: #E8E2D9;
      border-radius: 9999px;
      overflow: hidden;
      margin: 8px 0;
    }
    .progress-bar-fill {
      height: 100%;
      background: #D97706;
      transition: width 0.3s;
    }
    .check-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #F0EAE1;
    }
    .check-item input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <header>
    <div class="header-content">
      <div class="brand-title">
        <span>🍂 2026 首爾秋日獨旅手冊</span>
        <span class="badge">10/29 - 11/03</span>
      </div>
      <div style="font-size: 12px; color: var(--text-muted);">離線單檔版</div>
    </div>
  </header>

  <nav class="tab-bar">
    <button class="nav-btn active" onclick="switchTab('itinerary')">📅 每日行程時間軸</button>
    <button class="nav-btn" onclick="switchTab('luggage')">⚖️ 15kg 行李配重與戰利品</button>
    <button class="nav-btn" onclick="switchTab('exchange')">💱 雙向匯率與刷卡攻略</button>
    <button class="nav-btn" onclick="switchTab('checklist')">✅ 打包與同款朝聖</button>
  </nav>

  <main>
    <!-- TAB 1: ITINERARY -->
    <div id="tab-itinerary" class="tab-pane active">
      <div class="day-selector" id="day-buttons"></div>
      <div id="day-content"></div>
    </div>

    <!-- TAB 2: LUGGAGE & LOOT -->
    <div id="tab-luggage" class="tab-pane">
      <div class="card">
        <h3 style="font-family:'Noto Serif TC', serif; margin-bottom: 8px;">20 吋託運箱配重（上限 15kg）</h3>
        <p style="font-size: 13px; color: var(--text-muted);">液體超過 100ml（如 SW19 香水、BANILA CO 卸妝膏）必須託運！</p>
        <div class="progress-bar-bg">
          <div id="checked-progress" class="progress-bar-fill" style="width: 0%;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
          <span id="checked-weight-text">0 / 15,000g</span>
          <span id="checked-remaining-text">剩餘 15,000g</span>
        </div>
      </div>

      <div class="card">
        <h3 style="font-family:'Noto Serif TC', serif; margin-bottom: 12px;">戰利品清單與物流分流</h3>
        <div id="loot-list"></div>
      </div>
    </div>

    <!-- TAB 3: EXCHANGE -->
    <div id="tab-exchange" class="tab-pane">
      <div class="card">
        <h3 style="font-family:'Noto Serif TC', serif; margin-bottom: 8px;">雙向即時匯率換算器</h3>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">目前參考基準：1 TWD ≈ <span id="rate-display">42.5</span> KRW</p>
        <div class="grid-2">
          <div>
            <label style="font-size: 13px; font-weight:600;">韓元 (KRW ₩)</label>
            <input type="number" id="krw-input" class="input-box" placeholder="例如: 30000" oninput="calcFromKrw(this.value)">
          </div>
          <div>
            <label style="font-size: 13px; font-weight:600;">新台幣 (TWD NT$)</label>
            <input type="number" id="twd-input" class="input-box" placeholder="例如: 1000" oninput="calcFromTwd(this.value)">
          </div>
        </div>
        <div style="margin-top: 12px; font-size: 12px; background: #FEF3C7; color: #92400E; padding: 10px; border-radius: 8px;">
          💡 <strong>退稅門檻提醒</strong>：單筆滿 30,000 韓元即可於明洞、聖水洞與樂天超市出示護照退稅，約可退 6%~8%！
        </div>
      </div>

      <div class="card">
        <h3 style="font-family:'Noto Serif TC', serif; margin-bottom: 12px;">主力信用卡與行動支付策略</h3>
        <div id="cards-list"></div>
      </div>
    </div>

    <!-- TAB 4: CHECKLIST -->
    <div id="tab-checklist" class="tab-pane">
      <div class="card">
        <h3 style="font-family:'Noto Serif TC', serif; margin-bottom: 12px;">打包備忘與朝聖打卡</h3>
        <div id="checklist-container"></div>
      </div>
    </div>
  </main>

  <script>
    const ITINERARY_DATA = ${serializedItinerary};
    const LOOT_DATA = ${serializedLoot};
    const CHECKLIST_DATA = ${serializedChecklist};
    const CARDS_DATA = ${serializedCards};
    let EXCHANGE_RATE = ${exchangeRate};
    let currentDayIndex = 0;

    function switchTab(tabId) {
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
      document.getElementById('tab-' + tabId).classList.add('active');
      event.target.classList.add('active');
    }

    function renderDayButtons() {
      const container = document.getElementById('day-buttons');
      container.innerHTML = '';
      ITINERARY_DATA.forEach((day, index) => {
        const btn = document.createElement('button');
        btn.className = 'day-chip ' + (index === currentDayIndex ? 'active' : '');
        btn.innerText = 'Day ' + day.dayNumber + ' (' + day.date.split(' ')[0].substring(5) + ')';
        btn.onclick = () => {
          currentDayIndex = index;
          renderDayButtons();
          renderDayContent();
        };
        container.appendChild(btn);
      });
    }

    function renderDayContent() {
      const container = document.getElementById('day-content');
      const day = ITINERARY_DATA[currentDayIndex];
      container.innerHTML = \`
        <div class="card" style="border-left: 4px solid #D97706;">
          <h2 style="font-family:'Noto Serif TC',serif; font-size:18px; margin-bottom:4px;">\${day.date} · \${day.theme}</h2>
          <p style="font-size:13px; color:var(--text-muted); margin-bottom:4px;">📍 <strong>當晚住宿：</strong>\${day.stayLocation}</p>
          <p style="font-size:13px; color:var(--text-muted); margin-bottom:4px;">🧳 <strong>行李策略：</strong>\${day.luggageStatus}</p>
          <p style="font-size:12px; color:#B45309; background:#FEF3C7; padding:6px 10px; border-radius:6px; margin-top:6px;">🌤 \${day.weatherTips}</p>
        </div>
        <div>
          \${day.items.map(item => \`
            <div class="timeline-item">
              <div class="timeline-header">
                <span class="timeline-time">\${item.time}</span>
                <span style="font-size:12px; color:var(--text-muted);">\${item.location}</span>
              </div>
              <div class="timeline-title">\${item.title}</div>
              \${item.koreanTitle ? \`<div style="font-size:12px; color:#92400E; margin-bottom:4px;">\${item.koreanTitle}</div>\` : ''}
              <div style="font-size:13px; margin:4px 0;">\${item.description.replace(/\\n/g, '<br>')}</div>
              \${item.photoTip ? \`<div style="font-size:12px; color:#1E3A2F; background:#EBF5F0; padding:6px 8px; border-radius:6px; margin-top:6px;">📸 <strong>取景指南：</strong>\${item.photoTip}</div>\` : ''}
              \${item.shoppingOrTaxTip ? \`<div style="font-size:12px; color:#92400E; background:#FEF3C7; padding:6px 8px; border-radius:6px; margin-top:6px;">💳 <strong>購物/退稅：</strong>\${item.shoppingOrTaxTip}</div>\` : ''}
            </div>
          \`).join('')}
        </div>
      \`;
    }

    function renderLoot() {
      const container = document.getElementById('loot-list');
      let checkedWeight = 0;
      container.innerHTML = LOOT_DATA.map(item => {
        if (item.allocation === 'checked_15kg') {
          checkedWeight += item.weightGrams;
        }
        const allocLabel = item.allocation === 'checked_15kg' ? '20吋託運 (15kg)' : (item.allocation === 'carryon_10kg' ? '隨身擴充袋 (10kg)' : '超商寄集運倉');
        return \`
          <div style="padding:10px 0; border-bottom:1px solid #F0EAE1; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:600; font-size:14px;">\${item.name}</div>
              <div style="font-size:12px; color:var(--text-muted);">\${item.brandOrStore} · \${item.weightGrams}g · \${item.priceKrw.toLocaleString()}₩</div>
            </div>
            <span style="font-size:11px; padding:4px 8px; border-radius:6px; background:#F5EFE6; font-weight:600;">\${allocLabel}</span>
          </div>
        \`;
      }).join('');

      const percent = Math.min(100, Math.round((checkedWeight / 15000) * 100));
      document.getElementById('checked-progress').style.width = percent + '%';
      document.getElementById('checked-weight-text').innerText = checkedWeight.toLocaleString() + ' / 15,000g (' + percent + '%)';
      document.getElementById('checked-remaining-text').innerText = '剩餘 ' + (15000 - checkedWeight).toLocaleString() + 'g';
    }

    function calcFromKrw(val) {
      const num = parseFloat(val);
      if (!isNaN(num) && num > 0) {
        document.getElementById('twd-input').value = Math.round(num / EXCHANGE_RATE);
      } else {
        document.getElementById('twd-input').value = '';
      }
    }

    function calcFromTwd(val) {
      const num = parseFloat(val);
      if (!isNaN(num) && num > 0) {
        document.getElementById('krw-input').value = Math.round(num * EXCHANGE_RATE);
      } else {
        document.getElementById('krw-input').value = '';
      }
    }

    function renderCards() {
      const container = document.getElementById('cards-list');
      container.innerHTML = CARDS_DATA.map(c => \`
        <div style="padding:12px; border:1px solid var(--border); border-radius:10px; margin-bottom:8px; background:#FAF7F2;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <strong style="font-size:14px;">\${c.name}</strong>
            <span style="font-size:11px; font-weight:700; color:#B45309;">\${c.rewardRate}</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">\${c.highlights}</div>
          <div style="font-size:11px; color:#1E3A2F;">🎯 適用：\${c.suitableFor}</div>
        </div>
      \`).join('');
    }

    function renderChecklist() {
      const container = document.getElementById('checklist-container');
      container.innerHTML = CHECKLIST_DATA.map(item => \`
        <div class="check-item">
          <input type="checkbox" \${item.completed ? 'checked' : ''} onchange="this.nextElementSibling.style.textDecoration = this.checked ? 'line-through' : 'none'">
          <div style="\${item.completed ? 'text-decoration:line-through; color:#9CA3AF;' : ''}">
            <div style="font-size:14px; font-weight:600;">\${item.title}</div>
            \${item.subtitle ? \`<div style="font-size:12px; color:var(--text-muted);">\${item.subtitle}</div>\` : ''}
          </div>
        </div>
      \`).join('');
    }

    renderDayButtons();
    renderDayContent();
    renderLoot();
    renderCards();
    renderChecklist();
  </script>
</body>
</html>`;
}
