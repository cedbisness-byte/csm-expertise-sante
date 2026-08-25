/* ============================================================
   Page de remerciement — CSM Expertise Santé
   Récupère la demande enregistrée par le formulaire de contact
   (sessionStorage "csmDemande") et propose un raccourci.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "csmDemande";
  var raw = null;
  try { raw = sessionStorage.getItem(KEY); } catch (e) { /* navigation privée */ }

  var box = document.getElementById("merciAction");
  if (!box) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var data = null;
  if (raw) {
    try {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed.href === "string" && /^(mailto|tel|https?):/i.test(parsed.href)) {
        data = parsed;
      }
    } catch (e) { /* JSON invalide : on ignore */ }
    try { sessionStorage.removeItem(KEY); } catch (e) {}
  }

  if (data) {
    box.innerHTML =
      '<a class="btn btn--green merci__btn" href="' + esc(data.href) + '">' +
      (data.href.indexOf("mailto:") === 0 ? "Ouvrir ma messagerie" : "Reprendre ma demande") +
      "</a>" +
      '<p class="merci__hint">Si votre messagerie ne s\'est pas ouverte automatiquement, cliquez sur le bouton ci-dessus.</p>';
  } else {
    box.innerHTML =
      '<p class="merci__hint">Vous pouvez aussi me joindre directement au <a href="tel:+33613310757">06&nbsp;13&nbsp;31&nbsp;07&nbsp;57</a> ou par e-mail à <a href="mailto:secretariat83100@gmail.com">secretariat83100@gmail.com</a>.</p>';
  }
})();
