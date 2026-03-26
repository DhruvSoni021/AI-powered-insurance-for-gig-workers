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

        panel.querySelectorAll('[data-count]').forEach(el => {
          animateCount(el, parseInt(el.dataset.count));
        });

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

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const val = Math.round(target * eased);
      el.textContent = target > 999 ? val.toLocaleString('en-IN') : val;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function runVisibleCounters(root = document) {
    root.querySelectorAll('[data-count]').forEach(el => {
      animateCount(el, parseInt(el.dataset.count));
    });
  }
  runVisibleCounters();

  // ─── GAUGE ANIMATION ─────────────────────────
  const gaugeFill = document.querySelector('.gauge-fill');
  if (gaugeFill) {
    gaugeFill.style.strokeDashoffset = '251.2';
    setTimeout(() => {
      gaugeFill.style.strokeDashoffset = '145';
    }, 300);
  }

  // ─── HERO STATS COUNTERS ─────────────────────
  document.querySelectorAll('.hstat-val[data-count]').forEach(el => {
    animateCount(el, parseInt(el.dataset.count));
  });

  // ─────────────────────────────────────────────
  // KYC SYSTEM (NEW)
  // ─────────────────────────────────────────────

  const aadhaarInput = document.getElementById('aadhaarInput');
  const panInput = document.getElementById('panInput');
  const dlInput = document.getElementById('dlInput');
  const gstInput = document.getElementById('gstInput');

  const aadhaarStatus = document.getElementById('aadhaarStatus');
  const otpInput = document.getElementById('aadhaarOtp');
  const otpStatus = document.getElementById('otpStatus');

  // Load saved KYC
  if (localStorage.getItem('kycData')) {
    const data = JSON.parse(localStorage.getItem('kycData'));

    if (aadhaarInput) aadhaarInput.value = data.aadhaar || '';
    if (panInput) panInput.value = data.pan || '';
    if (dlInput) dlInput.value = data.dl || '';
    if (gstInput) gstInput.value = data.gst || '';

    if (data.aadhaarVerified && aadhaarStatus) {
      aadhaarStatus.textContent = 'Verified';
      aadhaarStatus.classList.add('verified');
    }
  }

  // Aadhaar Verify
  window.verifyAadhaar = function () {
    const aadhaar = aadhaarInput?.value.trim();

    if (!aadhaar || aadhaar.length !== 12 || isNaN(aadhaar)) {
      showToast('Enter valid 12 digit Aadhaar', 'error');
      return;
    }

    aadhaarStatus.textContent = 'OTP Sent';
    aadhaarStatus.className = 'kyc-status pending-kyc';
    showToast('OTP sent to Aadhaar linked mobile', 'success');
  };

  // OTP Verify
  window.verifyOtp = function () {
    const otp = otpInput?.value.trim();

    if (!otp || otp.length !== 6) {
      showToast('Invalid OTP', 'error');
      return;
    }

    aadhaarStatus.textContent = 'Verified';
    aadhaarStatus.className = 'kyc-status verified';

    otpStatus.textContent = 'Verified';
    otpStatus.className = 'kyc-status verified';

    showToast('Aadhaar verified successfully', 'success');
  };

  // Save KYC
  window.saveKYC = function () {
    const data = {
      aadhaar: aadhaarInput?.value.trim(),
      pan: panInput?.value.trim(),
      dl: dlInput?.value.trim(),
      gst: gstInput?.value.trim(),
      aadhaarVerified: aadhaarStatus?.textContent === 'Verified'
    };

    localStorage.setItem('kycData', JSON.stringify(data));
    showToast('KYC saved successfully', 'success');
  };

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
      document.getElementById('displayName').textContent  = newName;
      document.getElementById('infoName').textContent      = newName;
      document.querySelector('.hero-name').textContent     = newName;

      const initials = newName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
      document.getElementById('avatarEl').textContent = initials;
    }

    basicInfoView.classList.remove('hidden');
    basicInfoForm.classList.add('hidden');
    showToast('Profile updated successfully', 'success');
  });

  // ─── SHARE PROFILE ───────────────────────────
  document.getElementById('shareProfileBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Profile link copied', 'success');
  });

  // ─── STAGGERED CARD REVEAL ───────────────────
  const pcards = document.querySelectorAll('.pcard, .doc-card, .claim-card-item, .cs-card');
  pcards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(12px)';
    card.style.transition = `opacity 0.3s ease ${i * 0.07}s, transform 0.3s ease ${i * 0.07}s`;

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 80 + i * 70);
  });

  // ─── TOAST ───────────────────────────────────
  function showToast(message, type = 'success') {
    document.querySelector('.gs-toast')?.remove();

    const toast = document.createElement('div');
    toast.className = 'gs-toast';
    toast.textContent = message;

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      background: 'rgba(20,184,166,0.15)',
      border: '1px solid rgba(20,184,166,0.35)',
      color: '#2dd4bf',
      padding: '0.7rem 1.2rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '600',
      zIndex: '9999'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2500);
  }

  console.log('GigShield Profile initialized ✓');
});