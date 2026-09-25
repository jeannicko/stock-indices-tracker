const indices = [
  {
    symbol: 'CAC40',
    name: 'CAC 40',
    description: 'Principal indice de la Bourse de Paris.',
    value: 7523.45,
    change: 125.3,
    history: [7280, 7315, 7360, 7420, 7405, 7450, 7515, 7523]
  },
  {
    symbol: 'DAX',
    name: 'DAX 40',
    description: 'Indice phare de la Bourse de Francfort.',
    value: 18234.75,
    change: -245.8,
    history: [18620, 18540, 18490, 18410, 18380, 18320, 18280, 18234]
  },
  {
    symbol: 'FTSE',
    name: 'FTSE 100',
    description: 'Indice de la Bourse de Londres.',
    value: 7845.2,
    change: 98.5,
    history: [7680, 7698, 7725, 7760, 7790, 7825, 7834, 7845]
  },
  {
    symbol: 'SPX',
    name: 'S&P 500',
    description: 'Indice des 500 grandes entreprises américaines.',
    value: 5891.24,
    change: 142.75,
    history: [5680, 5705, 5740, 5775, 5810, 5838, 5866, 5891]
  },
  {
    symbol: 'IXIC',
    name: 'NASDAQ 100',
    description: 'Indice des entreprises technologiques américaines.',
    value: 19842.15,
    change: 385.6,
    history: [19080, 19220, 19330, 19520, 19635, 19710, 19790, 19842]
  },
  {
    symbol: 'N225',
    name: 'Nikkei 225',
    description: 'Indice principal de la Bourse de Tokyo.',
    value: 33152.48,
    change: -212.35,
    history: [33460, 33420, 33390, 33340, 33280, 33215, 33190, 33152]
  }
];

const indexGrid = document.getElementById('indexGrid');
const detailPanel = document.getElementById('detailPanel');
const refreshButton = document.getElementById('refreshButton');

function formatNumber(value) {
  return Number(value).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getChangeClass(change) {
  return change >= 0 ? 'positive' : 'negative';
}

function renderGrid() {
  indexGrid.innerHTML = indices
    .map((index) => {
      const isPositive = index.change >= 0;
      const changeText = `${isPositive ? '+' : '-'}${formatNumber(Math.abs(index.change))}`;
      const percent = ((index.change / (index.value - index.change)) * 100).toFixed(2);
      return `
        <article class="index-card" data-symbol="${index.symbol}" tabindex="0">
          <div class="index-card-header">
            <h2>${index.name}</h2>
            <span class="symbol-badge">${index.symbol}</span>
          </div>

          <div class="index-price">${formatNumber(index.value)}</div>

          <div class="index-change ${getChangeClass(index.change)}">
            ${isPositive ? '▲' : '▼'} ${changeText} (${isPositive ? '+' : '-'}${percent}%)
          </div>

          <div class="index-desc">${index.description}</div>
        </article>
      `;
    })
    .join('');

  document.querySelectorAll('.index-card').forEach((card) => {
    card.addEventListener('click', () => {
      const { symbol } = card.dataset;
      const selected = indices.find((item) => item.symbol === symbol);
      renderDetail(selected);
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const { symbol } = card.dataset;
        const selected = indices.find((item) => item.symbol === symbol);
        renderDetail(selected);
      }
    });
  });
}

function renderSparkline(history, accent) {
  const width = 300;
  const height = 150;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;

  const points = history
    .map((value, index) => {
      const x = (index / (history.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 12) - 6;
      return `${x},${y}`;
    })
    .join(' ');

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Courbe historique">
      <defs>
        <linearGradient id="fillGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.38"></stop>
          <stop offset="100%" stop-color="${accent}" stop-opacity="0.02"></stop>
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="${accent}"
        stroke-width="3"
        points="${points}"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></polyline>
      <polyline
        fill="url(#fillGradient)"
        stroke="none"
        points="0,${height} ${points} ${width},${height}"
      ></polyline>
    </svg>
  `;
}

function renderDetail(index) {
  const isPositive = index.change >= 0;
  const changeClass = getChangeClass(index.change);
  const accent = isPositive ? '#22c55e' : '#ef4444';

  detailPanel.classList.remove('hidden');
  detailPanel.innerHTML = `
    <div class="detail-header">
      <div>
        <p class="eyebrow">Détail</p>
        <h3>${index.name}</h3>
      </div>
      <button class="back-btn" type="button">Fermer</button>
    </div>

    <div class="detail-price">${formatNumber(index.value)}</div>
    <div class="detail-change ${changeClass}">
      ${isPositive ? '▲' : '▼'} ${isPositive ? '+' : '-'}${formatNumber(Math.abs(index.change))}
      (${isPositive ? '+' : '-'}${((Math.abs(index.change) / (index.value - index.change)) * 100).toFixed(2)}%)
    </div>

    <p class="detail-desc">${index.description}</p>

    <div class="metrics">
      <div class="metric">
        <span class="metric-label">Ouverture</span>
        <span class="metric-value">${formatNumber(index.value - index.change / 2)}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Max</span>
        <span class="metric-value">${formatNumber(Math.max(...index.history))}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Min</span>
        <span class="metric-value">${formatNumber(Math.min(...index.history))}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Précédent</span>
        <span class="metric-value">${formatNumber(index.value - index.change)}</span>
      </div>
    </div>

    <div class="chart-wrap">
      ${renderSparkline(index.history, accent)}
    </div>
    <p class="chart-label">Évolution sur 8 périodes</p>
  `;

  detailPanel.querySelector('.back-btn').addEventListener('click', () => {
    detailPanel.classList.add('hidden');
  });
}

function refreshIndices() {
  indices.forEach((index) => {
    const drift = (Math.random() - 0.5) * 40;
    index.value = Number((index.value + drift).toFixed(2));
    index.change = Number((index.change + drift * 0.8).toFixed(2));
    index.history = [...index.history.slice(1), Number((index.value + drift * 0.5).toFixed(2))];
  });

  renderGrid();
}

refreshButton.addEventListener('click', refreshIndices);
renderGrid();
