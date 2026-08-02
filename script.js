// NightBound — site interactivity

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Live countdown to the trailer date ---------- */
  const trailerDate = new Date('2026-09-30T00:00:00');
  const countdownEl = document.getElementById('countdownValue');

  function updateCountdown(){
    if (!countdownEl) return;
    const diff = trailerDate - new Date();

    if (diff <= 0){
      countdownEl.textContent = 'Available now';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    countdownEl.textContent = `Sept 30, 2026 (${days}d left)`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000 * 60 * 60);

  /* ---------- Trailer popup modal ---------- */
  const trailerBtn = document.getElementById('trailerBtn');
  const modal = document.getElementById('trailerModal');
  const modalClose = document.getElementById('modalClose');

  function openModal(){
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (trailerBtn) trailerBtn.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal){
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Forest parallax on mouse move ---------- */
  const forest = document.getElementById('forestLayer');
  if (forest && window.matchMedia('(hover: hover)').matches){
    const layers = forest.querySelectorAll('.layer');
    forest.addEventListener('mousemove', (e) => {
      const rect = forest.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      layers.forEach(layer => {
        const depth = parseFloat(layer.dataset.depth || 0.3);
        const moveX = px * depth * 26;
        const moveY = py * depth * 12;
        layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
    forest.addEventListener('mouseleave', () => {
      layers.forEach(layer => { layer.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------- Music player ---------- */
  const audio = document.getElementById('nightboundAudio');
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const backBtn = document.getElementById('backBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  const seekBar = document.getElementById('seekBar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationTimeEl = document.getElementById('durationTime');
  const playerVisual = document.querySelector('.player-visual');

  function formatTime(seconds){
    if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  if (audio && playBtn){
    audio.addEventListener('loadedmetadata', () => {
      seekBar.max = audio.duration;
      durationTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      if (!seekBar.matches(':active')) seekBar.value = audio.currentTime;
      currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      playIcon.style.display = '';
      pauseIcon.style.display = 'none';
      playerVisual.classList.remove('playing');
    });

    playBtn.addEventListener('click', () => {
      if (audio.paused){
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = '';
        playerVisual.classList.add('playing');
      } else {
        audio.pause();
        playIcon.style.display = '';
        pauseIcon.style.display = 'none';
        playerVisual.classList.remove('playing');
      }
    });

    backBtn.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    });

    forwardBtn.addEventListener('click', () => {
      audio.currentTime = Math.min(audio.duration || audio.currentTime + 10, audio.currentTime + 10);
    });

    seekBar.addEventListener('input', () => {
      audio.currentTime = seekBar.value;
    });
  }

  /* ---------- Falling leaves ---------- */
  const leafLayer = document.getElementById('leafLayer');
  if (leafLayer){
    function spawnLeaf(){
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      const startX = Math.random() * 100;
      const duration = 8 + Math.random() * 6;
      const drift = (Math.random() * 80 - 40) + 'px';
      leaf.style.left = startX + '%';
      leaf.style.setProperty('--drift', drift);
      leaf.style.animationDuration = duration + 's';
      leaf.style.opacity = (0.4 + Math.random() * 0.4).toFixed(2);
      leafLayer.appendChild(leaf);
      setTimeout(() => leaf.remove(), duration * 1000 + 200);
    }
    setInterval(spawnLeaf, 1400);
    // seed a few on load so it doesn't start empty
    for (let i = 0; i < 4; i++) setTimeout(spawnLeaf, i * 400);
  }

});
