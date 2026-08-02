// NightBound — site interactivity

document.addEventListener('DOMContentLoaded', () => {

  // Live countdown to the trailer release date
  const trailerDate = new Date('2026-09-30T00:00:00');
  const countdownEl = document.getElementById('countdownValue');

  function updateCountdown(){
    const now = new Date();
    const diff = trailerDate - now;

    if (!countdownEl) return;

    if (diff <= 0){
      countdownEl.textContent = 'Available now';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    countdownEl.textContent = `Sept 30, 2026 (${days}d left)`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000 * 60 * 60); // refresh hourly is enough

  // Trailer button — not released yet, so it points people to the Discord instead
  const trailerBtn = document.getElementById('trailerBtn');
  if (trailerBtn){
    trailerBtn.addEventListener('click', () => {
      trailerBtn.querySelector('small').textContent = 'Not released yet — join Discord for updates';
      setTimeout(() => {
        window.open('https://discord.gg/BuTqPA72gG', '_blank', 'noopener');
      }, 900);
    });
  }

  // Smooth scroll for in-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
