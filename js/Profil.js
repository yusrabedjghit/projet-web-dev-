// --- utils ---
function getEmailFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('email') || '';
}

const userEmail = getEmailFromURL();

// mettre à jour le header (lien accueil avec l'email)
(function updateHeaderLinks() {
  if (!userEmail) return;
  const homeLink = document.querySelector('header nav a[href="Acceuil.html"]');
  if (homeLink) {
    homeLink.href = `Acceuil.html?email=${encodeURIComponent(userEmail)}`;
  }
  // si un jour tu veux faire pareil pour login/signup, tu peux le faire ici
})();

// remplir le header (nom + email)
function renderProfilHeader(user) {
  const header = document.getElementById('profil-header');
  if (!header) return;

  const initials = (user.nom_utilisateur || user.email || 'US').slice(0, 2).toUpperCase();

  header.insertAdjacentHTML(
    'afterbegin',
    `
    <div class="avatar">${initials}</div>
    <div class="profil-info">
      <h1>${user.nom_utilisateur || 'Utilisateur'}</h1>
      <p>${user.email || ''}</p>
    </div>
    `
  );
}

// remplir une section
function fillSection(sectionId, films, type) {
  const container = document.getElementById(sectionId);
  if (!container) return;
  container.innerHTML = '';

  if (!films || films.length === 0) {
    container.innerHTML = `<p>Aucun film.</p>`;
    return;
  }

  films.forEach(film => {
    const card = document.createElement('article');
    card.className = 'film-card';
    card.innerHTML = `
      <div class="film-cover" style="background-image:url('${film.image || "https://via.placeholder.com/200x280?text=FILM"}');"></div>
      <div class="film-title">${film.titre}</div>
      <div class="film-meta">${film.annee || ''}</div>
      ${renderStatus(type)}
    `;
    container.appendChild(card);
  });
}

function renderStatus(type) {
  if (type === 'possession') return `<span class="status status-separer">à céder</span>`;
  if (type === 'vu') return `<span class="status status-vu">vu</span>`;
  return `<span class="status status-envie">envie de voir</span>`;
}

// --- chargement profil + films ---
async function loadProfil() {
  if (!userEmail) return;

  // 1. profil
  const resUser = await fetch(`../php/get_user_profile.php?email=${encodeURIComponent(userEmail)}`);
  const userData = await resUser.json();
  renderProfilHeader(userData);

  // 2. films
  const resFilms = await fetch(`../php/get_user_films.php?email=${encodeURIComponent(userEmail)}`);
  const filmsData = await resFilms.json();

  fillSection('section-possession', filmsData.possession, 'possession');
  fillSection('section-vu', filmsData.vu, 'vu');
  fillSection('section-envie', filmsData.envie_de_voir, 'envie_de_voir');
}

// --- vider une liste ---
async function clearList(type) {
  const res = await fetch('../php/clear_user_list.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail, type })
  });
  const data = await res.json();
  if (data.success) {
    loadProfil();
  } else {
    alert(data.error || 'Erreur lors du vidage.');
  }
}

// écouteur sur les boutons "Vider"
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-clear]')) {
    const type = e.target.getAttribute('data-clear');
    clearList(type);
  }
});

// lancer
loadProfil();
