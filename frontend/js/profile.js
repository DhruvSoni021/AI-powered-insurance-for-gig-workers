/* ============================================
   GIGSHIELD – profile.js
   Profile page interactions & animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── TAB SWITCHING ───────────────────────────
  const tabs   = document.querySelectorAll('.ptab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(`tab-${target}`);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger count animations when switching to a tab
        panel.querySelectorAll('[data-count]').forEach(el => {
          animateCount(el, parseInt(el.dataset.count));
        });
        // Re-trigger premium amount if visible
        panel.querySelectorAll('.pb-amount[data-count]').forEach(el => {
          animateCount(el, parseInt(el.dataset.count));
        });
      }
    });
  });

  // ─── ANIMATED COUNTERS ───────────────────────
  function animateCount(el, target) {
    const duration = 900;
    const startTime = performance.now();
    const isRupee = el.previousSibling && el.previousSibling.textContent === '₹';

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const val = Math.round(target * eased);
      el.textContent = isRupee || target > 999
        ? val.toLocaleString('en-IN')
        : val;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Run counters on visible elements
  function runVisibleCounters(root = document) {
    root.querySelectorAll('[data-count]').forEach(el => {
      animateCount(el, parseInt(el.dataset.count));
    });
  }
  runVisibleCounters();

  // ─── GAUGE ANIMATION ─────────────────────────
  // Risk score: 42/100. Arc total length = 251.2
  // offset = 251.2 * (1 - 42/100) = 251.2 * 0.58 = 145.7
  const gaugeFill = document.querySelector('.gauge-fill');
  if (gaugeFill) {
    // Start fully hidden, animate in
    gaugeFill.style.strokeDashoffset = '251.2';
    setTimeout(() => {
      gaugeFill.style.strokeDashoffset = '145';
    }, 300);
  }

  // ─── HERO STATS COUNTERS ─────────────────────
  document.querySelectorAll('.hstat-val[data-count]').forEach(el => {
    animateCount(el, parseInt(el.dataset.count));
  });

  // ─── EDIT BASIC INFO TOGGLE ──────────────────
  const editBasicBtn  = document.getElementById('editBasicBtn');
  const basicInfoView = document.getElementById('basicInfoView');
  const basicInfoForm = document.getElementById('basicInfoForm');
  const saveBasicBtn  = document.getElementById('saveBasicBtn');
  const cancelBasicBtn = document.getElementById('cancelBasicBtn');

  editBasicBtn?.addEventListener('click', () => {
    basicInfoView.classList.add('hidden');
    basicInfoForm.classList.remove('hidden');
  });

  cancelBasicBtn?.addEventListener('click', () => {
    basicInfoView.classList.remove('hidden');
    basicInfoForm.classList.add('hidden');
  });

  saveBasicBtn?.addEventListener('click', () => {
    const newName = document.getElementById('editName')?.value.trim();
    if (newName) {
      // Update display name everywhere
      document.getElementById('displayName').textContent  = newName;
      document.getElementById('infoName').textContent      = newName;
      document.querySelector('.hero-name').textContent     = newName;
      // Update avatar initials
      const initials = newName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
      document.getElementById('avatarEl').textContent = initials;
    }
    basicInfoView.classList.remove('hidden');
    basicInfoForm.classList.add('hidden');
    showToast('Profile updated successfully', 'success');
  });

  // ─── EDIT PROFILE MODAL ───────────────────────
  const editProfileBtn = document.getElementById('editProfileBtn');
  const editModal      = document.getElementById('editModal');
  const closeModal     = document.getElementById('closeModal');
  const cancelModal    = document.getElementById('cancelModal');
  const saveModalBtn   = document.getElementById('saveModalBtn');

  editProfileBtn?.addEventListener('click', () => {
    editModal.classList.remove('hidden');
  });

  const closeEditModal = () => editModal.classList.add('hidden');
  closeModal?.addEventListener('click', closeEditModal);
  cancelModal?.addEventListener('click', closeEditModal);

  editModal?.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
  });

  saveModalBtn?.addEventListener('click', () => {
    const newName = document.getElementById('modalNameInput')?.value.trim();
    if (newName) {
      document.getElementById('displayName').textContent = newName;
      document.querySelector('.hero-name').textContent   = newName;
      const initials = newName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
      document.getElementById('avatarEl').textContent = initials;
    }
    closeEditModal();
    showToast('Profile saved', 'success');
  });

  // ─── SHARE PROFILE ───────────────────────────
  document.getElementById('shareProfileBtn')?.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Profile link copied to clipboard', 'success');
      });
    } else {
      showToast('Profile link copied', 'success');
    }
  });

  // ─── TOGGLE SWITCHES ─────────────────────────
  document.querySelectorAll('.toggle-switch').forEach(sw => {
    sw.addEventListener('click', () => {
      sw.classList.toggle('active');
      const isOn = sw.classList.contains('active');
      showToast(
        sw.id === 'twoFaToggle'
          ? `2FA ${isOn ? 'enabled' : 'disabled'}`
          : `Login alerts ${isOn ? 'enabled' : 'disabled'}`,
        isOn ? 'success' : 'success'
      );
    });
  });

  // ─── SESSION REVOKE ──────────────────────────
  document.querySelectorAll('.session-item .btn-outline')?.forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.session-item');
      item.style.transition = 'opacity 0.3s, transform 0.3s';
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
      setTimeout(() => item.remove(), 320);
      showToast('Session revoked', 'success');
    });
  });

  // ─── ADD CONDITION ────────────────────────────
  document.getElementById('addCondBtn')?.addEventListener('click', () => {
    const name = prompt('Enter condition name:');
    if (name && name.trim()) {
      const tag = document.createElement('span');
      tag.className = 'cond-tag';
      tag.textContent = name.trim();
      const addBtn = document.getElementById('addCondBtn');
      addBtn.parentNode.insertBefore(tag, addBtn);
      showToast(`"${name.trim()}" added`, 'success');
    }
  });

  // ─── UPLOAD DOC ───────────────────────────────
  document.getElementById('uploadDocBtn')?.addEventListener('click', () => {
    showToast('Document upload coming soon', 'success');
  });

  // ─── CONTACT EDIT TOGGLE ─────────────────────
  window.toggleEditContact = function () {
    showToast('Contact editing panel coming soon', 'success');
  };

  // ─── STAGGERED CARD REVEAL ───────────────────
  const pcards = document.querySelectorAll('.pcard, .doc-card, .claim-card-item, .cs-card');
  pcards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(12px)';
    card.style.transition = `opacity 0.3s ease ${i * 0.07}s, transform 0.3s ease ${i * 0.07}s`;
    setTimeout(() => {
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
    }, 80 + i * 70);
  });

  // ─── HERO STATS ENTRANCE ─────────────────────
  const hstats = document.querySelectorAll('.hstat');
  hstats.forEach((s, i) => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(8px)';
    setTimeout(() => {
      s.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      s.style.opacity = '1';
      s.style.transform = 'translateY(0)';
    }, 200 + i * 80);
  });

  // ─── TOAST ───────────────────────────────────
  function showToast(message, type = 'success') {
    document.querySelector('.gs-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'gs-toast';
    toast.innerHTML = `<span style="font-size:1rem">${type === 'success' ? '✓' : '✕'}</span> <span>${message}</span>`;
    Object.assign(toast.style, {
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      background: type === 'success' ? 'rgba(20,184,166,0.15)' : 'rgba(239,68,68,0.15)',
      border: `1px solid ${type === 'success' ? 'rgba(20,184,166,0.35)' : 'rgba(239,68,68,0.35)'}`,
      color: type === 'success' ? '#2dd4bf' : '#f87171',
      padding: '0.7rem 1.2rem', borderRadius: '8px',
      fontSize: '0.875rem', fontWeight: '600',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      zIndex: '9999', backdropFilter: 'blur(12px)',
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      transform: 'translateY(10px)', opacity: '0',
      transition: 'opacity 0.2s ease, transform 0.2s ease',
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  // ─── SIDEBAR TOGGLE (mobile) ─────────────────
  const menuToggle = document.getElementById('menuToggle');
  const sidebar    = document.getElementById('sidebar');
  menuToggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 900 && sidebar && menuToggle &&
        !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  console.log('GigShield Profile initialized ✓');
});