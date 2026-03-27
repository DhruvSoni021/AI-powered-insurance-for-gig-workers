/* ─────────────────────────────────────────
   policy.js – My Policy Component Logic
───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Animate Coverage Bars via IntersectionObserver ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.cov-bar').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  const card = document.getElementById('policy-card');
  if (card) observer.observe(card);

  /* ── 2. Ripple on Buttons ── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
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
    });
  });

  /* ── 3. Download Policy Button ── */
  const downloadBtn = document.getElementById('downloadBtn');
  downloadBtn?.addEventListener('click', () => {
    const orig = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing…';
    downloadBtn.disabled  = true;
    setTimeout(() => {
      downloadBtn.innerHTML = '<i class="fa-solid fa-check"></i> Downloaded!';
      downloadBtn.style.color        = '#34d399';
      downloadBtn.style.borderColor  = 'rgba(52,211,153,0.4)';
      setTimeout(() => {
        downloadBtn.innerHTML         = orig;
        downloadBtn.style.color       = '';
        downloadBtn.style.borderColor = '';
        downloadBtn.disabled          = false;
      }, 1800);
    }, 1800);
  });

  /* ── 4. AI Insight Chevron Toggle ── */
  const aiInsight = document.getElementById('aiInsight');
  const aiChevron = document.getElementById('aiChevron');
  aiInsight?.addEventListener('click', () => {
    const expanded = aiInsight.classList.toggle('expanded');
    if (aiChevron) aiChevron.style.transform = expanded ? 'rotate(90deg)' : '';
  });

  /* ── 5. Add-on Tag Toggle ── */
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const active = tag.classList.toggle('tag-active');
      tag.style.background = active
        ? 'rgba(167,139,250,0.25)'
        : 'rgba(167,139,250,0.1)';
    });
  });

});