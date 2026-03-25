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