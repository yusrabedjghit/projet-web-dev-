(() => {
  const cvs = document.getElementById('stars');
  if (!cvs) return;
  const ctx = cvs.getContext('2d', { alpha: true });

  let W = 0, H = 0;
  const DPR = Math.max(1, window.devicePixelRatio || 1);

  // Réglages (ajuste à ton goût)
  const DENSITY = 0.00045; // + => plus d'étoiles
  const SPEED   = 1;    // vitesse de dérive
  const TWINKLE = 2;    // scintillement
  const STAR_PROB_SPARKLE = 0.35; // part d'étoiles "à croix"

  let stars = [];

  function resize() {
    // plein écran
    W = window.innerWidth;
    H = window.innerHeight;

    // adapte le canvas aux pixels réels (net sur écrans Retina)
    cvs.style.width  = '100vw';
    cvs.style.height = '100vh';
    cvs.width  = Math.floor(W * DPR);
    cvs.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // (re)génère les étoiles selon la surface
    const count = Math.floor(W * H * DENSITY);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,                // taille
      a: Math.random() * Math.PI * 2,              // phase scintillement
      v: (Math.random() * 0.6 + 0.4) * SPEED,      // vitesse individuelle
      o: Math.random() * 0.6 + 0.4,                // opacité base
      s: Math.random() < STAR_PROB_SPARKLE         // true => croix
    }));
  }

  function drawGlowDot(s, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = 'rgba(255,255,255,0.9)';
    ctx.shadowBlur  = 10;
    ctx.fillStyle   = '#fff';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSparkle(s, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;

    // halo central
    ctx.shadowColor = 'rgba(255,255,255,0.95)';
    ctx.shadowBlur  = 14;
    ctx.fillStyle   = '#fff';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // branches
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.lineWidth   = Math.max(0.6, s.r * 0.5);

    // horizontale
    ctx.beginPath(); ctx.moveTo(s.x - s.r * 4, s.y); ctx.lineTo(s.x + s.r * 4, s.y); ctx.stroke();
    // verticale
    ctx.beginPath(); ctx.moveTo(s.x, s.y - s.r * 4); ctx.lineTo(s.x, s.y + s.r * 4); ctx.stroke();

    // diagonales légères
    ctx.globalAlpha = alpha * 0.6;
    ctx.lineWidth   = Math.max(0.4, s.r * 0.35);
    ctx.beginPath(); ctx.moveTo(s.x - s.r * 3, s.y - s.r * 3); ctx.lineTo(s.x + s.r * 3, s.y + s.r * 3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s.x - s.r * 3, s.y + s.r * 3); ctx.lineTo(s.x + s.r * 3, s.y - s.r * 3); ctx.stroke();

    ctx.restore();
  }

  function step() {
    // mode addition pour ressortir sur zones claires
    ctx.globalCompositeOperation = 'lighter';
    ctx.clearRect(0, 0, W, H);

    for (let s of stars) {
      // mouvement doux
      s.x += s.v;
      s.y -= s.v * 0.2;

      // wrap (revient de l'autre côté quand il sort)
      if (s.x > W + 5) s.x = -5;
      if (s.y < -5)    s.y = H + 5;

      // scintillement
      s.a += TWINKLE;
      const alpha = Math.max(0, Math.min(1, s.o + Math.sin(s.a) * 0.25));

      // dessin
      if (s.s && s.r > 0.6) drawSparkle(s, alpha);
      else                  drawGlowDot(s, alpha);
    }

    requestAnimationFrame(step);
  }

  // init + resize
  window.addEventListener('resize', resize);
  resize();
  step();
})();
