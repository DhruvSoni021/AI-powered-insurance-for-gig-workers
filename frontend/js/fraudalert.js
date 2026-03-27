/* ─────────────────────────────────────────
   fraud.js – Fraud Alerts Component Logic
───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  const slider = document.getElementById("riskSlider");
const riskFill = document.getElementById("riskFill");
const riskNumber = document.getElementById("riskNumber");

function updateRisk() {
  let value = parseInt(slider.value);

  // number update
  riskNumber.textContent = value;

  // bar move
  riskFill.style.width = value + "%";

  // 🔥 color change
  if (value < 30) {
    riskFill.style.background = "#34d399"; // green
  } 
  else if (value < 70) {
    riskFill.style.background = "#facc15"; // yellow
  } 
  else {
    riskFill.style.background = "#ef4444"; // red
  }
}

// slider move
slider.addEventListener("input", updateRisk);

// initial load
updateRisk();

  /* ── 2. Ripple helper ── */
  function addRipple(btn, e) {
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    Object.assign(ripple.style, {
      width:  size + 'px',
      height: size + 'px',
      left:   (e.clientX - rect.left - size / 2) + 'px',
      top:    (e.clientY - rect.top  - size / 2) + 'px',
    });
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => addRipple(btn, e));
  });

  /* ── 3. Mark as Legitimate ── */
  const markLegitBtn = document.getElementById('markLegitBtn');
  const alertBox     = document.getElementById('alertBox');
  const alertTitle   = document.getElementById('alertTitle');
  const alertIcon    = document.getElementById('alertIcon');

  markLegitBtn?.addEventListener('click', () => {
    if (!alertBox) return;
    alertBox.style.background   = 'rgba(52,211,153,0.07)';
    alertBox.style.borderColor  = 'rgba(52,211,153,0.35)';
    if (alertTitle) alertTitle.textContent = '✓ Marked as Legitimate';
    if (alertIcon) {
      alertIcon.className = 'fa-solid fa-circle-check alert-icon';
      alertIcon.style.color = '#34d399';
    }
    markLegitBtn.disabled = true;
    markLegitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Done';
    markLegitBtn.style.color = '#34d399';

    /* Update first table row status */
    const firstChip = document.querySelector('.la-table tbody tr:first-child .status-chip');
    if (firstChip) {
      firstChip.textContent = 'Legitimate';
      firstChip.className   = 'status-chip resolved';
    }
    const firstBadge = document.querySelector('.la-table tbody tr:first-child .status-badge');
    if (firstBadge) {
      firstBadge.textContent = 'Resolved';
      firstBadge.className   = 'status-badge resolved-badge';
    }
  });

  /* ── 4. Report Issue ── */
  const reportBtn = document.getElementById('reportBtn');
  reportBtn?.addEventListener('click', () => {
    const orig = reportBtn.innerHTML;
    reportBtn.innerHTML            = '<i class="fa-solid fa-spinner fa-spin"></i> Reporting…';
    reportBtn.disabled             = true;

    setTimeout(() => {
      reportBtn.innerHTML          = '<i class="fa-solid fa-check"></i> Reported';
      reportBtn.style.background   = 'rgba(52,211,153,0.12)';
      reportBtn.style.borderColor  = 'rgba(52,211,153,0.3)';
      reportBtn.style.color        = '#34d399';

      setTimeout(() => {
        reportBtn.innerHTML          = orig;
        reportBtn.style.background   = '';
        reportBtn.style.borderColor  = '';
        reportBtn.style.color        = '';
        reportBtn.disabled           = false;
      }, 2000);
    }, 1400);
  });

  /* ── 5. Contact Support ── */
  const supportBtn = document.getElementById('supportBtn');
  supportBtn?.addEventListener('click', () => {
    const orig = supportBtn.innerHTML;
    supportBtn.innerHTML = '<i class="fa-solid fa-headset"></i> Connecting…';
    setTimeout(() => { supportBtn.innerHTML = orig; }, 2000);
  });

  /* ── 6. Table row selection ── */
  document.querySelectorAll('.la-table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('.la-table tbody tr').forEach(r => r.classList.remove('row-selected'));
      row.classList.add('row-selected');
    });
  });

});