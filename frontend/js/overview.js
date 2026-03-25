/* =========================================
   script.js — Claims Chart & Interactions
   ========================================= */

// ---- Claims Overview Chart ----
(function initChart() {
  const ctx = document.getElementById('claimsChart');
  if (!ctx) return;

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const barData   = [1, 2, 2, 4, 5, 2];
  const lineData  = [1, 2, 2, 3, 5, 3];

  // Gradient fill for bars
  const canvasCtx = ctx.getContext('2d');
  const barGradient = canvasCtx.createLinearGradient(0, 0, 0, 160);
  barGradient.addColorStop(0, 'rgba(0, 162, 255, 0.7)');
  barGradient.addColorStop(1, 'rgba(0, 80, 160, 0.1)');

  const lineGradient = canvasCtx.createLinearGradient(0, 0, 0, 160);
  lineGradient.addColorStop(0, 'rgba(0, 230, 118, 0.3)');
  lineGradient.addColorStop(1, 'rgba(0, 230, 118, 0.0)');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Claims Filed',
          data: barData,
          backgroundColor: barGradient,
          borderColor: 'rgba(0, 162, 255, 0.85)',
          borderWidth: 1.5,
          borderRadius: 5,
          borderSkipped: false,
          barPercentage: 0.55,
        },
        {
          type: 'line',
          label: 'Claim Trend',
          data: lineData,
          borderColor: '#00e676',
          borderWidth: 2.5,
          pointBackgroundColor: '#00e676',
          pointBorderColor: '#060d1f',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.4,
          fill: true,
          backgroundColor: lineGradient,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 900,
        easing: 'easeInOutQuart',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10, 25, 55, 0.92)',
          borderColor: 'rgba(0, 162, 255, 0.4)',
          borderWidth: 1,
          titleColor: '#00a2ff',
          bodyColor: '#e8f0fe',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => `  ${ctx.dataset.label}: ${ctx.parsed.y}`
          }
        },
        annotation: {
          annotations: {
            claimSubmittedLine: {
              type: 'line',
              xMin: 4, xMax: 4,
              borderColor: 'rgba(255, 152, 0, 0.6)',
              borderWidth: 1.5,
              borderDash: [5, 4],
              label: {
                display: true,
                content: 'Claim Submitted',
                position: 'start',
                backgroundColor: 'rgba(255, 152, 0, 0.15)',
                color: '#ffb347',
                font: { size: 10, family: "'Exo 2', sans-serif" },
                padding: { x: 6, y: 3 },
                borderRadius: 4,
              }
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: {
            color: '#7a8bb5',
            font: { family: "'Exo 2', sans-serif", size: 11 }
          },
          border: { display: false }
        },
        y: {
          min: 0,
          max: 6,
          grid: { color: 'rgba(255,255,255,0.06)', drawBorder: false },
          ticks: {
            color: '#7a8bb5',
            stepSize: 1,
            font: { family: "'Exo 2', sans-serif", size: 11 }
          },
          border: { display: false }
        }
      }
    }
  });
})();


// ---- Button Interactions ----
function handleAction(type) {
  const messages = {
    submit: '📄 Submit Claim flow initiated!',
    view:   '👁️ Opening Policy details...',
    pay:    '💳 Redirecting to Payment...',
  };
  showToast(messages[type] || 'Action triggered');
}

function showToast(message) {
  // Remove existing toast if any
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: linear-gradient(135deg, #0b1630, #0d2050);
    border: 1px solid rgba(0, 162, 255, 0.4);
    color: #e8f0fe;
    padding: 12px 22px;
    border-radius: 10px;
    font-family: 'Exo 2', sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 162, 255, 0.2);
    z-index: 9999;
    animation: toastIn 0.3s ease, toastOut 0.4s 2s ease forwards;
  `;

  // Inject animation keyframes once
  if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
      @keyframes toastIn  { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
      @keyframes toastOut { from { opacity:1; } to { opacity:0; transform: translateY(8px); } }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}