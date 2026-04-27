// --------- UTILS URL ---------
function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function getFilmName() {
  return getParam("film");
}

function getUserEmail() {
  return getParam("email");
}

// --------- IMAGE LOCALE ---------
// fabrique ../images/Nom du film.jpg
function getLocalImagePath(titreFilm) {
  // enlever les :
  let fileName = titreFilm.replace(/:/g, "");
  // garder les espaces (tu les as comme ça dans ton dossier)
  // mettre l’extension que tu utilises vraiment
  fileName = fileName + ".jpg"; // <-- change en .png si tes fichiers sont en .png
  return `../images/${encodeURIComponent(fileName)}`;
}

// --------- HEADER DYNAMIQUE ---------
function setupHeaderLinks() {
  const email = getUserEmail();
  const linkHome = document.getElementById('link-home');
  const linkLogin = document.getElementById('link-login');
  const linkSignup = document.getElementById('link-signup');
  const linkProfil = document.getElementById('link-profil');
  const btnBackHome = document.getElementById('back-home');

  if (email) {
    if (linkHome) linkHome.href = `Acceuil.html?email=${encodeURIComponent(email)}`;
    if (linkProfil) {
      linkProfil.style.display = 'inline';
      linkProfil.href = `../html/profil.html?email=${encodeURIComponent(email)}`;
      linkProfil.textContent = `Profil (${email})`;
    }
    if (linkLogin) linkLogin.href = `login.html?email=${encodeURIComponent(email)}`;
    if (linkSignup) linkSignup.href = `signup.html?email=${encodeURIComponent(email)}`;

    if (btnBackHome) {
      btnBackHome.addEventListener('click', () => {
        window.location.href = `Acceuil.html?email=${encodeURIComponent(email)}`;
      });
    }
  } else {
    if (linkProfil) linkProfil.style.display = 'none';
  }
}

// --------- FETCH FILM ---------
async function fetchFilmDetails(titre) {
  const response = await fetch(`../php/film_details.php?titre=${encodeURIComponent(titre)}`);
  if (!response.ok) throw new Error("Erreur lors du chargement du film");
  return await response.json();
}

// --------- THEME ---------
function applyTheme(film) {
  const colors = {
    "Star Wars": "#192841",
    "Marvel": "#8B0000",
    "Princesses": "#E08AD7"
  };
  const color = colors[film.univers] ?? "#333";
  document.body.style.background = color;

  const card = document.querySelector(".film-card");
  if (card) {
    card.style.background = `linear-gradient(135deg, ${color}, #111)`;
    card.style.color = "white";
    card.style.border = "2px solid white";
  }
}

// --------- AFFICHAGE PRINCIPAL ---------
function afficherFilm(film) {
  const template = document.querySelector("#template-film");
  const clone = document.importNode(template.content, true);

  // image locale + titre
  const imgEl = clone.querySelector("img");
  const localImg = getLocalImagePath(film.titre);
  imgEl.src = localImg;
  imgEl.alt = `Affiche du film ${film.titre}`;
  // fallback si l'image n'existe pas
  imgEl.onerror = () => {
    imgEl.src = "../img/placeholder.jpg";
  };

  clone.querySelector("h4").textContent = film.titre;
  clone.querySelector(".infos").innerHTML = `
    Univers: ${film.univers} | Saga: ${film.saga}<br>
    Sortie en ${film.annee}<br><br>
    <strong>Synopsis :</strong> ${film.synopsis}
  `;

  // liste utilisateurs
  const usersContainer = clone.querySelector(".users-list");
  const titreSection = clone.querySelector("h3");

  if (film.utilisateurs && film.utilisateurs.length > 0) {
    const ul = document.createElement("ul");

    film.utilisateurs
      .filter(u => u.statut && u.statut.toLowerCase() === "souhaite_separer")
      .forEach(u => {
        const li = document.createElement("li");

        const profilLink = document.createElement("a");
        profilLink.textContent = u.nom_utilisateur || u.email;
        profilLink.href = `../html/profil.html?email=${encodeURIComponent(u.email)}`;
        profilLink.style.marginRight = "8px";

        const mailLink = document.createElement("a");
        mailLink.href = `mailto:${u.email}`;
        mailLink.textContent = "(contacter)";
        mailLink.style.fontSize = "0.8rem";

        li.appendChild(profilLink);
        li.appendChild(mailLink);
        ul.appendChild(li);
      });

    if (ul.children.length > 0) {
      usersContainer.appendChild(ul);
    } else {
      titreSection.textContent += " Aucun utilisateur";
    }
  } else {
    titreSection.textContent += " Aucun utilisateur";
  }

  const filmContainer = document.getElementById("film-container");
  filmContainer.innerHTML = "";
  filmContainer.appendChild(clone);

  applyTheme(film);
}

// --------- POSSESSION ---------
async function togglePossession(email, filmTitre) {
  try {
    const res = await fetch('../php/update_possession.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, film: filmTitre })
    });
    const result = await res.json();
    if (result.error) alert(result.error);
    else updateButtonPossession(result.status);
  } catch (err) {
    console.error('Erreur réseau:', err);
    alert('Erreur réseau.');
  }
}

function updateButtonPossession(status) {
  const btn = document.getElementById('toggle-possession');
  if (!btn) return;
  if (status === 'souhaite_separer') {
    btn.textContent = ' Je souhaite m’en séparer';
    btn.style.backgroundColor = '#d9534f';
  } else {
    btn.textContent = ' Je possède ce film';
    btn.style.backgroundColor = '#5cb85c';
  }
}

// --------- WATCH (vu / envie / aucun) ---------
async function toggleWatch(email, filmTitre, currentStatus) {
  // cycle d'état
  let nextStatus = 'none';
  if (currentStatus === 'none') nextStatus = 'envie_de_voir';
  else if (currentStatus === 'envie_de_voir') nextStatus = 'vu';
  else if (currentStatus === 'vu') nextStatus = 'none';

  try {
    const res = await fetch('../php/update_watch.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, film: filmTitre, statut: nextStatus })
    });

    const raw = await res.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error('Réponse non JSON du serveur :', raw);
      alert('Erreur serveur (voir console).');
      return;
    }

    if (!res.ok) {
      console.error('Erreur HTTP', res.status, data);
      alert(data.error || 'Erreur HTTP');
      return;
    }

    if (data.error) {
      alert(data.error);
      return;
    }

    updateButtonWatch(data.statut || nextStatus);
  } catch (err) {
    console.error('Erreur réseau:', err);
    alert('Erreur réseau.');
  }
}

function updateButtonWatch(status) {
  const btn = document.getElementById('toggle-watch');
  if (!btn) return;
  if (status === 'envie_de_voir') {
    btn.textContent = ' Envie de voir';
    btn.style.backgroundColor = '#fbbf24';
  } else if (status === 'vu') {
    btn.textContent = ' Déjà vu';
    btn.style.backgroundColor = '#22c55e';
  } else {
    btn.textContent = ' Aucun statut';
    btn.style.backgroundColor = '';
  }
  btn.dataset.status = status;
}

// --------- IIFE PRINCIPALE ---------
(async () => {
  setupHeaderLinks();

  const filmName = getFilmName();
  if (!filmName) return;

  try {
    const film = await fetchFilmDetails(filmName);
    if (film.error) throw new Error(film.error);
    afficherFilm(film);
  } catch (err) {
    console.error("Erreur :", err);
    document.body.innerHTML = `<h2> Erreur : ${err.message}</h2>`;
  }
})();

// --------- IIFE POSSESSION ---------
(async () => {
  const filmTitre = getFilmName();
  const email = getUserEmail();

  if (!filmTitre || !email) {
    console.error('Film ou email manquant pour la possession.');
    return;
  }

  const btn = document.getElementById('toggle-possession');
  if (btn) {
    btn.addEventListener('click', () => togglePossession(email, filmTitre));
  }

  try {
    const res = await fetch(`../php/update_possession.php?email=${encodeURIComponent(email)}&film=${encodeURIComponent(filmTitre)}`);
    const data = await res.json();
    if (data.status) updateButtonPossession(data.status);
  } catch (e) {
    console.error(e);
  }
})();

// --------- IIFE WATCH ---------
(async () => {
  const filmTitre = getFilmName();
  const email = getUserEmail();
  const btnWatch = document.getElementById('toggle-watch');

  if (!filmTitre || !email || !btnWatch) return;

  btnWatch.addEventListener('click', () => {
    const currentStatus = btnWatch.dataset.status || 'none';
    toggleWatch(email, filmTitre, currentStatus);
  });

  try {
    const res = await fetch(`../php/update_watch.php?email=${encodeURIComponent(email)}&film=${encodeURIComponent(filmTitre)}`);
    const data = await res.json();
    if (data.statut) {
      updateButtonWatch(data.statut);
    } else {
      updateButtonWatch('none');
    }
  } catch (e) {
    console.error(e);
    updateButtonWatch('none');
  }
})();
