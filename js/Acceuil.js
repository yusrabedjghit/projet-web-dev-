const container = document.querySelector("#grid-univers");

// on récupère l'email dans l'URL
const params = new URLSearchParams(window.location.search);
const userEmail = params.get("email");

// afficher l'email + lien profil dans le header
const nav = document.querySelector("header nav");
if (nav && userEmail) {
  const userInfo = document.createElement("a");
  userInfo.textContent = `Connecté : ${userEmail}`;
  userInfo.href = `../html/profil.html?email=${encodeURIComponent(userEmail)}`;
  userInfo.style.marginLeft = "20px";
  nav.appendChild(userInfo);
}

// 1. aller chercher les données en PHP
function fetchFilms() {
  return fetch("../php/films.php")
    .then(res => {
      if (!res.ok) throw new Error("Erreur lors du chargement depuis la base MySQL");
      return res.json();
    })
    .catch(err => {
      console.error("Erreur :", err);
      const msg = document.createElement("p");
      msg.textContent = "Impossible de charger les films depuis la base de données.";
      msg.style.color = "red";
      container.appendChild(msg);
    });
}

// 2. construire le chemin vers ton dossier images local
// (on NE crée PAS le dossier : on pointe vers ce que tu as déjà)
function getLocalImagePath(filmTitle) {
  // tu as dit "sans les :"
  let fileName = filmTitle.replace(/:/g, "");
  // tu as dit "avec les espaces" → on les laisse
  // on met l'extension que tu utilises dans ton dossier
  // si tes images sont en .png, change juste cette ligne
  fileName = fileName + ".jpg";
  // on encode pour les espaces
  return `../images/${encodeURIComponent(fileName)}`;
}

// 3. générer le HTML depuis les templates
function remplirPageHTML(data) {
  const templateUnivers = document.querySelector("#template-univers");
  const templateSaga = document.querySelector("#template-saga");
  const templateFilm = document.querySelector("#template-film");

  data.forEach(universData => {
    const cloneUnivers = document.importNode(templateUnivers.content, true);
    const section = cloneUnivers.querySelector("section");

    section.id = universData.univers;
    section.setAttribute("genre", universData.genre.toLowerCase());
    section.classList.add("univers-card");
    section.querySelector("h2").textContent = universData.univers;

    const sagaGrid = cloneUnivers.querySelector(".grid-sagas");

    universData.sagas.forEach(sagaData => {
      const cloneSaga = document.importNode(templateSaga.content, true);
      cloneSaga.querySelector("h3").textContent = sagaData.saga;

      const filmGrid = cloneSaga.querySelector(".grid-films");

      sagaData.films.forEach(filmData => {
        const cloneFilm = document.importNode(templateFilm.content, true);
        const titre = filmData.film;

        // texte
        cloneFilm.querySelector("h4").textContent = titre;
        cloneFilm.querySelector("p").textContent = filmData.date || "Date inconnue";

        // image : on utilise ton dossier images
        const img = cloneFilm.querySelector("img");
        const localPath = getLocalImagePath(titre);
        img.src = localPath;
        img.alt = `Affiche du film ${titre}`;
        // si jamais l'image n'existe pas en local, on met un placeholder
        img.onerror = () => {
          img.src = "../img/placeholder.jpg";
        };

        // lien vers Films.html avec le même email
        let filmUrl = `Films.html?film=${encodeURIComponent(titre)}`;
        if (userEmail) {
          filmUrl += `&email=${encodeURIComponent(userEmail)}`;
        }
        cloneFilm.querySelector("a").href = filmUrl;

        filmGrid.appendChild(cloneFilm);
      });

      sagaGrid.appendChild(cloneSaga);
    });

    container.appendChild(cloneUnivers);
  });
}

// 4. lancer
fetchFilms().then(data => {
  if (data) remplirPageHTML(data);
});

// 5. Réinitialiser les filtres
function Reinitialisation() {
  document.querySelectorAll(".univers-card").forEach(card => (card.style.display = ""));
  document.querySelectorAll('.genre input[type="checkbox"]').forEach(cb => (cb.checked = true));
}

// 6. Filtre
function filtre() {
  const universCards = document.querySelectorAll(".univers-card");
  const genresChoisis = Array.from(document.querySelectorAll('.genre input[type="checkbox"]:checked'))
    .map(cb => cb.value.toLowerCase().trim());

  if (genresChoisis.length === 0) {
    universCards.forEach(card => (card.style.display = ""));
    return;
  }

  universCards.forEach(card => {
    const genreCard = (card.getAttribute("genre") || "").toLowerCase().trim();
    card.style.display = genresChoisis.includes(genreCard) ? "" : "none";
  });
}

// 7. dernier petit truc : si t'as des liens Films.html déjà présents au chargement
if (userEmail) {
  document.querySelectorAll("a[href^='Films.html']").forEach(a => {
    const url = new URL(a.href, window.location.href);
    url.searchParams.set("email", userEmail);
    a.href = url.toString();
  });
}
