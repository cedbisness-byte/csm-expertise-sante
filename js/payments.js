(function () {
  "use strict";

  /* ==================================================================
   *  CONFIGURATION DES PAIEMENTS — LIENS DE PAIEMENT
   *  ------------------------------------------------------------------
   *  STRIPE : créez un "Payment Link" par pack dans
   *           dashboard.stripe.com -> Payment Links
   *
   *  Montants attendus (à vérifier lors de la création des liens) :
   *    Pack Installation...          : 290 €
   *    Pack Audit & sécurisation...  : 390 €
   *    Pack Accompagnement...        : 490 €
   *
   *  Remplacez chaque valeur ci-dessous par le lien réel.
   *  Tant qu'une valeur contient "REMPLACER", un message s'affiche
   *  à la place du paiement et un rappel est écrit dans la console.
   * ================================================================== */

  var STRIPE_LINKS = {
    "pack-360": "REMPLACER-PAR-LE-LIEN-STRIPE-PACK-360",
    "pack-audit": "REMPLACER-PAR-LE-LIEN-STRIPE-PACK-AUDIT",
    "pack-accompagnement": "REMPLACER-PAR-LE-LIEN-STRIPE-PACK-ACCOMPAGNEMENT"
  };

  /* ================================================================== */

  var NAMES = {
    "pack-360": "Pack Installation & premiers pas en libéral",
    "pack-audit": "Pack Audit & sécurisation des revenus",
    "pack-accompagnement": "Pack Accompagnement administratif sur mesure"
  };

  var CONTACT_MSG =
    "Le paiement en ligne arrive bientôt. Pour commander ce pack, contactez " +
    "Christine Granata au 06 13 31 07 57 ou par e-mail : secretariat83100@gmail.com.";

  function buildButton(id, url, className, label, provider) {
    var link = document.createElement("a");
    link.className = className + " pay-btn";
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = label;

    var isPlaceholder = url.indexOf("REMPLACER") !== -1;
    if (isPlaceholder) {
      link.href = "#";
      link.addEventListener("click", function (e) {
        e.preventDefault();
        alert(CONTACT_MSG);
      });
      console.warn(
        "[" + id + "] Lien " + provider + " non configuré. " +
        "Créez le lien puis remplacez la valeur dans " + provider.toUpperCase() + "_LINKS de js/payments.js."
      );
    } else {
      link.href = url;
    }
    return link;
  }

  Object.keys(NAMES).forEach(function (id) {
    var pack = document.getElementById(id);
    if (!pack) return;

    pack.appendChild(buildButton(id, STRIPE_LINKS[id], "btn btn--stripe", "Payer par carte", "Stripe"));

    var secure = document.createElement("p");
    secure.className = "pay-secure";
    secure.innerHTML =
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
      "Paiement sécurisé";

    pack.appendChild(secure);
  });
})();
