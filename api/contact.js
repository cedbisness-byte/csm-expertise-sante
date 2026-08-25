/* ============================================================
   Réception du formulaire de contact — backend anti-spam
   - Honeypot caché (champ "website")
   - Validation stricte des champs et tailles
   - Transfert e-mail côté serveur (l'adresse reste hors des pages
     en tant que cible de formulaire, relayé via FormSubmit)
   - Protégé en amont par le rate limiting Vercel (300/min/IP)
   ============================================================ */
var OWNER_EMAIL = "secretariat83100@gmail.com";

function s(v, max) {
  v = typeof v === "string" ? v.trim() : "";
  return v.length > max ? v.slice(0, max) : v;
}

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST uniquement" });
    return;
  }

  var b = req.body || {};

  /* Honeypot : les robots remplissent tous les champs */
  if (typeof b.website === "string" && b.website.trim() !== "") {
    console.log("[CONTACT] robot piege (honeypot), IP ignoree");
    res.status(200).json({ ok: true });
    return;
  }

  var name = s(b.name, 100);
  var email = s(b.email, 200);
  var profession = s(b.profession, 120);
  var pack = s(b.pack, 120);
  var message = s(b.message, 5000);

  if (!name || !email || !message) {
    res.status(400).json({ error: "Nom, e-mail et message sont obligatoires" });
    return;
  }
  if (!/^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    res.status(400).json({ error: "Adresse e-mail invalide" });
    return;
  }

  try {
    var r = await fetch("https://formsubmit.co/ajax/" + OWNER_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: "Nouvelle demande de contact - " + name,
        Nom: name,
        "E-mail": email,
        Profession: profession || "Non renseignee",
        Pack: pack || "Non renseigne",
        Message: message
      })
    });
    console.log("[CONTACT] demande de " + email + ", transfert statut: " + r.status);
  } catch (e) {
    console.log("[CONTACT] echec transfert: " + (e && e.message));
  }

  res.status(200).json({ ok: true });
};
