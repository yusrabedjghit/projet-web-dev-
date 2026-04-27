console.log("[login.js] chargé");

(() => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");

  if (!form || !msg) {
    console.error("[login.js] IDs introuvables (loginForm / loginMsg)");
    return;
  }

  const setMsg = (text, type = "") => {
    msg.textContent = text;
    msg.className = "msg";
    if (type) msg.classList.add(type);
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("");

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      return setMsg("Veuillez remplir tous les champs.", "error");
    }

    try {
      const response = await fetch("../php/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.error) return setMsg(data.error, "error");

      setMsg("Connexion réussie !", "ok");

      //Sauvegarde utilisateur dans localStorage (utile si besoin plus tard)
      localStorage.setItem("user", JSON.stringify(data.user));

      //Redirection avec l'adresse email dans l'URL
      setTimeout(() => {
        const encodedEmail = encodeURIComponent(data.user.email);
        window.location.href = `Acceuil.html?email=${encodedEmail}`;
      }, 1000);
    } catch (err) {
      console.error(err);
      setMsg("Erreur réseau ou serveur injoignable.", "error");
    }
  });
})();
