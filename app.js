/* ==============================================================
   APP.JS — logique de l'expérience.
   Ce fichier n'a normalement pas besoin d'être modifié.
   Pour changer les infos de notification, éditez config.js.
   ============================================================== */

(() => {
  "use strict";

  /* ---------- Utilitaires ---------- */
  const $ = (sel) => document.querySelector(sel);
  const alea = (min, max) => Math.random() * (max - min) + min;

  function afficherScene(id) {
    document.querySelectorAll(".scene").forEach((s) => s.classList.remove("actif"));
    $(id).classList.add("actif");
  }

  /* ==============================================================
     1. PARTICULES DE FOND (cœurs discrets qui flottent)
     ============================================================== */
  function initParticules() {
    const conteneur = $("#particules");
    const total = window.innerWidth < 600 ? 12 : 20;
    for (let i = 0; i < total; i++) {
      const p = document.createElement("span");
      p.className = "particule";
      p.textContent = "❤";
      p.style.left = alea(0, 100) + "vw";
      p.style.fontSize = alea(10, 22) + "px";
      p.style.setProperty("--derive", alea(-60, 60) + "px");
      p.style.animationDuration = alea(9, 18) + "s";
      p.style.animationDelay = alea(0, 14) + "s";
      conteneur.appendChild(p);
    }
  }

  /* ==============================================================
     2. SCÈNE 1 → OUVERTURE DE L'ENVELOPPE
     ============================================================== */
  function initEnveloppe() {
    const env = $("#enveloppe");
    const ouvrir = () => {
      if (env.classList.contains("ouverte")) return;
      env.classList.add("ouverte");
      setTimeout(() => afficherScene("#scene-question"), 750);
    };
    env.addEventListener("click", ouvrir);
    env.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") ouvrir();
    });
  }

  /* ==============================================================
     3. SCÈNE 2 → LE BOUTON "NON" QUI FUIT + LE BOUTON "OUI"
     ============================================================== */
  const TAQUINERIES = [
    "La seule réponse possible est « Oui »… 😏",
    "Tu peux essayer… mais « Non » ne fonctionne pas. ❤️",
  ];

  function initBoutons() {
    const zone = $("#zone-boutons");
    const btnNon = $("#btn-non");
    const btnOui = $("#btn-oui");
    const taquinerie = $("#taquinerie");
    let tentatives = 0;
    let margeSecurite = 16;

    function positionAleatoire() {
      const larg = btnNon.offsetWidth || 120;
      const haut = btnNon.offsetHeight || 48;
      const maxX = window.innerWidth - larg - margeSecurite;
      const maxY = window.innerHeight - haut - margeSecurite;
      const x = alea(margeSecurite, Math.max(margeSecurite, maxX));
      const y = alea(margeSecurite, Math.max(margeSecurite, maxY));
      return { x, y };
    }

    function fuir() {
      if (!btnNon.classList.contains("fixe")) {
        btnNon.classList.add("fixe");
      }
      const { x, y } = positionAleatoire();
      btnNon.style.left = x + "px";
      btnNon.style.top = y + "px";

      tentatives++;
      taquinerie.textContent = TAQUINERIES[tentatives % TAQUINERIES.length];
      taquinerie.classList.remove("shake");
      // force le reflow pour rejouer l'animation
      void taquinerie.offsetWidth;
      taquinerie.classList.add("shake");
    }

    // Sur ordinateur : le bouton s'échappe dès que la souris approche
    btnNon.addEventListener("mouseenter", fuir);

    // Sur ordinateur ET mobile : toute tentative de "pointerdown"
    // (clic ou tap) fait fuir le bouton AVANT que le clic ne s'exécute,
    // donc "Non" ne peut jamais être réellement sélectionné.
    btnNon.addEventListener(
      "pointerdown",
      (e) => {
        e.preventDefault();
        fuir();
      },
      { passive: false }
    );

    // Filet de sécurité si un navigateur laisse quand même passer un clic
    btnNon.addEventListener("click", (e) => {
      e.preventDefault();
      fuir();
    });

    // Repositionne le bouton si la fenêtre change de taille pendant la fuite
    window.addEventListener("resize", () => {
      if (btnNon.classList.contains("fixe")) {
        const { x, y } = positionAleatoire();
        btnNon.style.left = x + "px";
        btnNon.style.top = y + "px";
      }
    });

    // Le bouton "Oui" fonctionne normalement
    btnOui.addEventListener("click", () => {
      afficherScene("#scene-creneaux");
      lancerConfettis();
    });
  }

  /* ==============================================================
     4. CONFETTIS LÉGERS (sans librairie externe)
     ============================================================== */
  function lancerConfettis() {
    const conteneur = $("#confettis");
    const symboles = ["❤️", "✨", "🎉", "💗"];
    const total = window.innerWidth < 600 ? 26 : 46;

    for (let i = 0; i < total; i++) {
      const c = document.createElement("span");
      c.className = "confetti";
      c.textContent = symboles[Math.floor(alea(0, symboles.length))];
      c.style.left = alea(0, 100) + "vw";
      c.style.fontSize = alea(14, 26) + "px";
      c.style.setProperty("--rot", alea(180, 540) + "deg");
      c.style.animationDuration = alea(2.4, 4.2) + "s";
      c.style.animationDelay = alea(0, 0.6) + "s";
      conteneur.appendChild(c);
      setTimeout(() => c.remove(), 5200);
    }
  }

  /* ==============================================================
     5. SCÈNE 3 → CHOIX DU CRÉNEAU
     ============================================================== */
  function initCreneaux() {
    document.querySelectorAll(".creneau").forEach((bouton) => {
      bouton.addEventListener("click", () => {
        document.querySelectorAll(".creneau").forEach((b) => (b.disabled = true));

        const jour = bouton.dataset.jour;
        const heure = bouton.dataset.heure;
        const maintenant = new Date();

        confirmerChoix(jour, heure, maintenant);
        envoyerNotification({
          reponse: "oui",
          jour,
          creneau: heure,
          heure_reponse: maintenant.toISOString(),
        });
      });
    });
  }

  function confirmerChoix(jour, heure, date) {
    const heureLisible = date.toLocaleString("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
    });
    $("#confirm-detail").innerHTML =
      `<strong>${jour}</strong> · ${heure}<br>` +
      `Réponse envoyée le ${heureLisible}`;
    setTimeout(() => afficherScene("#scene-confirmation"), 350);
  }

  /* ==============================================================
     6. ENVOI DE LA NOTIFICATION (configurable dans config.js)
     ============================================================== */
  async function envoyerNotification({ reponse, jour, creneau, heure_reponse }) {
    const cfg = window.CONFIG || {};
    const qui = cfg.PRENOM_EXPEDITEUR ? `${cfg.PRENOM_EXPEDITEUR} ` : "";
    let auMoinsUneMethode = false;

    // --- Option 1 : Discord ---
    if (cfg.DISCORD_WEBHOOK_URL) {
      auMoinsUneMethode = true;
      try {
        await fetch(cfg.DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: "💌 Nouvelle réponse au date !",
                description: `${qui}a répondu **${reponse === "oui" ? "Oui ❤️" : "Non"}**`,
                color: 10233171,
                fields: [
                  { name: "Jour", value: jour, inline: true },
                  { name: "Créneau", value: creneau, inline: true },
                  { name: "Répondu le", value: heure_reponse, inline: false },
                ],
              },
            ],
          }),
        });
      } catch (err) {
        console.warn("Échec de l'envoi vers Discord :", err);
      }
    }

    // --- Option 2 : E-mail via FormSubmit ---
    if (cfg.EMAIL_TO) {
      auMoinsUneMethode = true;
      try {
        await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cfg.EMAIL_TO)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: "💌 Nouvelle réponse au date !",
            reponse,
            jour,
            creneau,
            heure_reponse,
          }),
        });
      } catch (err) {
        console.warn("Échec de l'envoi par e-mail :", err);
      }
    }

    // --- Option 3 : Webhook personnalisé (Supabase, Zapier, etc.) ---
    if (cfg.CUSTOM_WEBHOOK_URL) {
      auMoinsUneMethode = true;
      try {
        await fetch(cfg.CUSTOM_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reponse, jour, creneau, heure_reponse }),
        });
      } catch (err) {
        console.warn("Échec de l'envoi vers le webhook personnalisé :", err);
      }
    }

    if (!auMoinsUneMethode) {
      console.warn(
        "Aucune méthode de notification n'est configurée. " +
          "Ouvrez config.js pour renseigner DISCORD_WEBHOOK_URL, EMAIL_TO ou CUSTOM_WEBHOOK_URL."
      );
    }
  }

  /* ==============================================================
     INITIALISATION
     ============================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initParticules();
    initEnveloppe();
    initBoutons();
    initCreneaux();
  });
})();
