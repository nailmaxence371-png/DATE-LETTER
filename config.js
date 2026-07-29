/* ==============================================================
   CONFIGURATION — c'est le SEUL fichier à modifier normalement.
   ==============================================================

   Choisissez UNE méthode de notification ci-dessous (ou plusieurs,
   elles seront toutes tentées). Laissez les autres en chaîne vide "".

   ---------------------------------------------------------------
   OPTION 1 · Webhook Discord (le plus simple, gratuit, instantané)
   ---------------------------------------------------------------
   1. Dans Discord : Paramètres du salon → Intégrations → Webhooks
      → "Nouveau webhook" → copier l'URL du webhook.
   2. Collez l'URL ci-dessous dans DISCORD_WEBHOOK_URL.

   ---------------------------------------------------------------
   OPTION 2 · E-mail via FormSubmit (aucun serveur nécessaire)
   ---------------------------------------------------------------
   1. Mettez votre adresse e-mail dans EMAIL_TO.
   2. Au tout premier envoi, FormSubmit vous enverra un e-mail de
      confirmation à valider (une seule fois). Après quoi, chaque
      réponse arrivera automatiquement dans votre boîte mail.
   3. Rien d'autre à créer ni héberger : https://formsubmit.co

   ---------------------------------------------------------------
   OPTION 3 · Webhook personnalisé (Supabase / Zapier / Make / n8n…)
   ---------------------------------------------------------------
   Utile si vous préférez stocker la réponse dans une base de
   données (Supabase, Firebase via une Cloud Function, etc.).
   Mettez l'URL de votre endpoint dans CUSTOM_WEBHOOK_URL : il
   recevra un POST JSON avec { reponse, jour, creneau, heure_reponse }.

   Exemple de fonction Supabase Edge (à héberger séparément) :
     - Table `reponses` (jour text, creneau text, heure_reponse timestamptz)
     - La fonction insère la ligne reçue en POST puis renvoie 200.
   ============================================================== */

const CONFIG = {
  DISCORD_WEBHOOK_URL: "", // https://discord.com/api/webhooks/1532053133428129822/WeIEqr1zP89-OWW9BrwRfdfW85fcQo5TaE7qgmGZXL2c7zdH29m7NhaotnHwp8KbXVix
  EMAIL_TO: "",             // "nailmaxence@gmail.com"
  CUSTOM_WEBHOOK_URL: "",   // ex: "https://xxxx.supabase.co/functions/v1/reponse-date"

  // Personnalisation rapide (facultatif)
  PRENOM_EXPEDITEUR: "", // apparaîtra dans la notification si renseigné
};
