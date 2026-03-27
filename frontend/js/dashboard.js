/* ============================================
   GIGSHIELD DASHBOARD – script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── SIDEBAR TOGGLE (mobile) ─────────────────
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (
        window.innerWidth <= 900 &&
        !sidebar.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        sidebar.classList.remove('open');
      }
    });
  }

  // ─── ACTIVE NAV ITEM HIGHLIGHT ───────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item, .topbar-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href && href !== '#' && currentPath.includes(href.replace('.html', ''))) {
      link.classList.add('active');
    }
  });

  // ─── STAGGERED CARD ANIMATIONS ───────────────
  const cards = document.querySelectorAll('.card, .status-card');
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.06}s`;
  });

  // ─── ADMIN: FILTER APPLICATIONS ──────────────
  window.filterApplications = function () {
    const searchVal = document.getElementById('customerSearch')?.value.toLowerCase() || '';
    const occVal    = document.getElementById('occupationFilter')?.value || 'All Occupations';
    const planVal   = document.getElementById('planFilter')?.value || 'All Plans';

    const rows = document.querySelectorAll('#applicationsTable tbody tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (!cells.length) return;

      const name = cells[0]?.textContent.toLowerCase() || '';
      const occ  = cells[1]?.textContent || '';
      const plan = cells[3]?.textContent || '';

      const matchName = !searchVal || name.includes(searchVal);
      const matchOcc  = occVal === 'All Occupations' || occ.includes(occVal);
      const matchPlan = planVal === 'All Plans' || plan.includes(planVal);

      row.style.display = (matchName && matchOcc && matchPlan) ? '' : 'none';
    });
  };

  // ─── CLAIMS: APPROVE/REJECT ACTIONS ──────────
  document.querySelectorAll('.btn-approve').forEach(btn => {
    btn.addEventListener('click', function () {
      const row = this.closest('tr');
      const statusCell = row?.querySelector('.status-pill');
      if (statusCell) {
        statusCell.className = 'status-pill approved';
        statusCell.textContent = 'Approved';
      }
      showToast('Claim approved successfully', 'success');
    });
  });

  document.querySelectorAll('.btn-reject').forEach(btn => {
    btn.addEventListener('click', function () {
      const row = this.closest('tr');
      const statusCell = row?.querySelector('.status-pill');
      if (statusCell) {
        statusCell.className = 'status-pill rejected';
        statusCell.textContent = 'Rejected';
      }
      showToast('Claim rejected', 'error');
    });
  });

  // ─── CLAIMS PAGE: COUNT STATUS CARDS ─────────
  function updateStatusCounts() {
    const claimsTable = document.getElementById('claimsTable');
    if (!claimsTable) return;

    let pending = 0, review = 0, approved = 0, rejected = 0;
    claimsTable.querySelectorAll('tbody .status-pill').forEach(pill => {
      if (pill.classList.contains('pending'))  pending++;
      if (pill.classList.contains('review'))   review++;
      if (pill.classList.contains('approved')) approved++;
      if (pill.classList.contains('rejected')) rejected++;
    });

    const setCount = (id, val) => {
      const el = document.getElementById(id);
      if (el) animateCount(el, val);
    };
    setCount('pendingCount',  pending);
    setCount('reviewCount',   review);
    setCount('approvedCount', approved);
    setCount('rejectedCount', rejected);
  }

  // ─── ANIMATED COUNTER ────────────────────────
  function animateCount(el, target) {
    const start = 0;
    const duration = 600;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  updateStatusCounts();

  // ─── TOAST NOTIFICATION ──────────────────────
  function showToast(message, type = 'success') {
    // Remove any existing toast
    document.querySelector('.gs-toast')?.remove();

    const toast = document.createElement('div');
    toast.className = 'gs-toast';
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
      <span>${message}</span>
    `;

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      background: type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
      border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
      color: type === 'success' ? '#22c55e' : '#ef4444',
      padding: '0.75rem 1.2rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      zIndex: '9999',
      backdropFilter: 'blur(10px)',
      animation: 'toastIn 0.25s ease',
      fontFamily: "'DM Sans', sans-serif",
    });

    // Inject keyframes if not already present
    if (!document.getElementById('toast-style')) {
      const style = document.createElement('style');
      style.id = 'toast-style';
      style.textContent = `
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ─── PAY NOW BUTTON ───────────────────────────
  document.querySelector('.btn-pay')?.addEventListener('click', function () {
    showToast('Redirecting to payment gateway…', 'success');
  });

  // ─── SUBMIT CLAIM BUTTONS ─────────────────────
  document.querySelectorAll('.btn-primary').forEach(btn => {
    if (btn.textContent.trim().includes('Submit') || btn.textContent.trim().includes('New Claim')) {
      btn.addEventListener('click', () => {
        showToast('Opening claim submission form…', 'success');
      });
    }
  });

  // ─── LOGOUT BUTTON ───────────────────────────
  document.querySelector('.logout-btn')?.addEventListener('click', () => {
    showToast('Logging out…', 'success');
    setTimeout(() => {
      localStorage.removeItem("user");   // logout data clear
      window.location.href = 'homepage.html';  // correct page
    }, 1500);
  });

  // ─── FILTER TOGGLE (claims page) ─────────────
  document.getElementById('filterToggle')?.addEventListener('click', function () {
    showToast('Filter panel coming soon', 'success');
  });

  // ─── TABLE ROW HOVER GLOW ────────────────────
  document.querySelectorAll('.data-table tbody tr, .mini-table tbody tr').forEach(row => {
    row.style.transition = 'background 0.15s';
  });

  console.log('GigShield Dashboard initialized ✓');
});








/* ═══════════════════════════════════════════════════
   GIGSHIELD — AI RISK INTELLIGENCE (ADD-ON SCRIPT)
   Append this block to the END of your existing
   dashboard.js file, INSIDE the DOMContentLoaded
   listener (before the closing }); ).
   Also add this to your dashboard.html <head>:
   <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
════════════════════════════════════════════════════ */

  // ── Guard: only run if Chart.js loaded + section exists ──
  if (typeof Chart === 'undefined' || !document.querySelector('.ai-risk-section')) return;

  Chart.defaults.color = '#8899aa';
  Chart.defaults.font.family = "'DM Sans', sans-serif";

  const _tooltip = {
    backgroundColor: '#192231',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    titleFont: { size: 11, weight: '600' },
    bodyFont: { size: 10 },
    padding: 8,
    cornerRadius: 6,
  };

  // ── 1. RISK SCORE RING ──────────────────────────
  const BASE_SCORE = 54;

  function animateRiskRing(targetScore, duration) {
    duration = duration || 1400;
    const arc = document.getElementById('riskArc');
    const scoreText = document.getElementById('riskScoreText');
    if (!arc || !scoreText) return;

    const circumference = 402;
    const startOffset = parseFloat(arc.getAttribute('stroke-dashoffset')) || circumference;
    const endOffset = circumference - (targetScore / 100) * circumference;
    const startNum = parseInt(scoreText.textContent) || 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      arc.setAttribute('stroke-dashoffset', startOffset - (startOffset - endOffset) * eased);
      scoreText.textContent = Math.round(startNum + (targetScore - startNum) * eased);
      if (progress < 1) requestAnimationFrame(step);
      else _updateRiskBadge(targetScore);
    }
    requestAnimationFrame(step);
  }

  function _updateRiskBadge(score) {
    const badge = document.getElementById('riskBadgeLabel');
    if (!badge) return;
    badge.className = 'risk-badge';
    if      (score < 35) { badge.classList.add('low');      badge.textContent = 'Low'; }
    else if (score < 60) { badge.classList.add('medium');   badge.textContent = 'Moderate'; }
    else if (score < 80) { badge.classList.add('high');     badge.textContent = 'High'; }
    else                 { badge.classList.add('critical'); badge.textContent = 'Critical'; }
  }

  // Animate ring on load
  setTimeout(function() {
    animateRiskRing(BASE_SCORE);
    document.querySelectorAll('.rsb-bar').forEach(function(bar) {
      var w = bar.style.width;
      bar.style.width = '0';
      setTimeout(function() { bar.style.width = w; }, 200);
    });
  }, 300);

  // ── 2. FORECAST CHART ───────────────────────────
  var forecastCtx = document.getElementById('forecastChart');
  if (forecastCtx) {
    new Chart(forecastCtx, {
      type: 'line',
      data: {
        labels: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        datasets: [
          {
            label: 'Predicted Risk',
            data: [54, 58, 72, 81, 79, 65, 60],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.08)',
            borderWidth: 2.5,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#f59e0b',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Baseline',
            data: [54, 54, 54, 54, 54, 54, 54],
            borderColor: 'rgba(255,255,255,0.12)',
            borderDash: [5, 4],
            borderWidth: 1.5,
            fill: false,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false }, tooltip: _tooltip },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10 } } },
          y: { min: 30, max: 100, grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false }, ticks: { font: { size: 10 }, stepSize: 20 } },
        },
      },
    });
  }

  // ── 3. TRIGGER SIMULATIONS ──────────────────────
  var _simData = {
    'heavy-rain':   { premium: '+₹18',  coverage: 'No Change',    label: '🌧️ Heavy Rain Scenario' },
    'thunderstorm': { premium: '+₹42',  coverage: '⚠ Review',     label: '⛈️ Thunderstorm Scenario' },
    'flood':        { premium: '+₹95',  coverage: '🔴 Suspended',  label: '🌊 Flood Scenario' },
    'curfew':       { premium: '+₹8',   coverage: 'No Change',    label: '🚫 Curfew Scenario' },
    'earthquake':   { premium: '+₹88',  coverage: '🔴 Suspended',  label: '🌍 Earthquake Scenario' },
    'cyclone':      { premium: '+₹110', coverage: '🔴 Suspended',  label: '🌀 Cyclone Scenario' },
  };

  document.querySelectorAll('.sim-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var event  = this.dataset.event;
      var score  = parseInt(this.dataset.score);
      var data   = _simData[event];
      var simStatus  = document.getElementById('simStatus');
      var resultBox  = document.getElementById('simResultBox');

      document.querySelectorAll('.sim-btn').forEach(function(b) { b.classList.remove('active-sim'); });
      this.classList.add('active-sim');
      if (simStatus) { simStatus.textContent = 'Running…'; simStatus.className = 'sim-status-dot running'; }

      setTimeout(function() {
        animateRiskRing(score);
        document.getElementById('simEventName').textContent = data.label;
        document.getElementById('simNewScore').textContent  = score + '/100';
        document.getElementById('simPremium').textContent   = data.premium;
        document.getElementById('simCoverage').textContent  = data.coverage;
        if (resultBox) resultBox.style.display = 'block';
        if (simStatus) { simStatus.textContent = 'Done'; simStatus.className = 'sim-status-dot'; }
      }, 800);
    });
  });

  document.getElementById('simResetBtn')?.addEventListener('click', function() {
    var resultBox = document.getElementById('simResultBox');
    var simStatus = document.getElementById('simStatus');
    if (resultBox) resultBox.style.display = 'none';
    if (simStatus) { simStatus.textContent = 'Ready'; simStatus.className = 'sim-status-dot'; }
    document.querySelectorAll('.sim-btn').forEach(function(b) { b.classList.remove('active-sim'); });
    animateRiskRing(BASE_SCORE);
  });

  // ── 4. CLAIMS ANALYTICS CHART ──────────────────
  var claimsCtx = document.getElementById('claimsChart');
  var _claimsChart = null;
  var _claimsData = {
    labels:   ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    approved: [3, 2, 4, 5, 3, 6, 4, 5],
    pending:  [1, 2, 1, 3, 2, 2, 3, 2],
    review:   [0, 1, 1, 1, 2, 1, 1, 2],
  };

  function _buildClaimsChart(type) {
    if (_claimsChart) _claimsChart.destroy();
    var isBar = type === 'bar';
    _claimsChart = new Chart(claimsCtx, {
      type: isBar ? 'bar' : 'line',
      data: {
        labels: _claimsData.labels,
        datasets: [
          { label: 'Approved',     data: _claimsData.approved, backgroundColor: isBar ? 'rgba(34,197,94,0.75)'  : 'rgba(34,197,94,0.06)',  borderColor: '#22c55e', borderWidth: isBar ? 0 : 2, borderRadius: isBar ? 4 : 0, tension: 0.4, fill: !isBar, pointRadius: isBar ? 0 : 3 },
          { label: 'Pending',      data: _claimsData.pending,  backgroundColor: isBar ? 'rgba(245,158,11,0.75)' : 'rgba(245,158,11,0.06)', borderColor: '#f59e0b', borderWidth: isBar ? 0 : 2, borderRadius: isBar ? 4 : 0, tension: 0.4, fill: !isBar, pointRadius: isBar ? 0 : 3 },
          { label: 'Under Review', data: _claimsData.review,   backgroundColor: isBar ? 'rgba(56,189,248,0.75)' : 'rgba(56,189,248,0.06)',  borderColor: '#38bdf8', borderWidth: isBar ? 0 : 2, borderRadius: isBar ? 4 : 0, tension: 0.4, fill: !isBar, pointRadius: isBar ? 0 : 3 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 500 },
        plugins: { legend: { display: false }, tooltip: _tooltip },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10 } } },
          y: { min: 0, max: 8, grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false }, ticks: { font: { size: 10 }, stepSize: 2 } },
        },
      },
    });
  }

  if (claimsCtx) {
    _buildClaimsChart('bar');
    document.getElementById('toggleBar')?.addEventListener('click', function() {
      document.querySelectorAll('.ctoggle').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      _buildClaimsChart('bar');
    });
    document.getElementById('toggleLine')?.addEventListener('click', function() {
      document.querySelectorAll('.ctoggle').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      _buildClaimsChart('line');
    });
  }

  // ── 5. COVERAGE DONUT ───────────────────────────
  var donutCtx = document.getElementById('coverageDonut');
  if (donutCtx) {
    new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [150000, 350000],
          backgroundColor: ['#14b8a6', 'rgba(255,255,255,0.06)'],
          borderColor: ['#14b8a6', 'rgba(255,255,255,0.04)'],
          borderWidth: 1,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: Object.assign({}, _tooltip, {
            callbacks: {
              label: function(ctx) {
                var labels = ['Used', 'Remaining'];
                var val = '₹' + (ctx.raw / 100000).toFixed(1) + 'L';
                return ' ' + labels[ctx.dataIndex] + ': ' + val;
              },
            },
          }),
        },
      },
    });
  }

  // ── 6. RISK TREND CHART ─────────────────────────
  var riskTrendCtx = document.getElementById('riskTrendChart');
  if (riskTrendCtx) {
    new Chart(riskTrendCtx, {
      type: 'line',
      data: {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: 'Risk Score',
            data: [44, 48, 42, 50, 56, 54],
            borderColor: '#a78bfa',
            backgroundColor: 'rgba(167,139,250,0.07)',
            borderWidth: 2.5,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#a78bfa',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Average',
            data: [52, 52, 52, 52, 52, 52],
            borderColor: 'rgba(255,255,255,0.12)',
            borderWidth: 1.5,
            borderDash: [4, 4],
            fill: false,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false }, tooltip: _tooltip },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10 } } },
          y: { min: 20, max: 80, grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false }, ticks: { font: { size: 10 }, stepSize: 20 } },
        },
      },
    });
  }