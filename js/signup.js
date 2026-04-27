console.log('[signup.js] chargé');

(() => {
  const form = document.getElementById('signupForm');
  const msg  = document.getElementById('signupMsg');

  if (!form || !msg) {
    console.error('[signup.js] IDs introuvables (signupForm / signupMsg)');
    return;
  }

  const setMsg = (text, type = '') => {
    msg.textContent = text;
    msg.className = 'msg';
    if (type) msg.classList.add(type);
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMsg('');

    const name     = form.name.value.trim();
    const email    = form.email.value.trim();
    const password = form.password.value;
    const confirm  = form.confirm.value;

    if (!name || !email || !password || !confirm)
      return setMsg('Tous les champs sont obligatoires.', 'error');

    if (!isValidEmail(email))
      return setMsg('Email invalide (ex: nom@domaine.com).', 'error');

    if (password.length < 6)
      return setMsg('Mot de passe : minimum 6 caractères.', 'error');

    if (password !== confirm)
      return setMsg('Les mots de passe ne correspondent pas.', 'error');

    try {
      // 🛰️ Envoi au backend
      const response = await fetch('../php/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (data.error) {
        setMsg(data.error, 'error');
      } else if (data.success) {
        setMsg('Compte créé avec succès ! Redirection...', 'ok');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } else {
        setMsg('Réponse inconnue du serveur.', 'error');
      }
    } catch (err) {
      console.error(err);
      setMsg("Erreur réseau ou serveur.", 'error');
    }
  });

  // Animation fond optionnelle
  const bg = document.querySelector('.auth .bg');
  if (bg) {
    window.addEventListener('mousemove', (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX / w - 0.5) * 6;
      const y = (e.clientY / h - 0.5) * 6;
      bg.style.backgroundPosition = `${50 + x}% ${40 + y}%`;
    });
  }
})();
