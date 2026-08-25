(function () {
  "use strict";
  /* Menu actif selon la page courante */
  (function () {
    var page = location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".nav__link");
    for (var i = 0; i < links.length; i++) {
      var on = links[i].getAttribute("href") === page;
      links[i].classList.toggle("is-active", on);
      if (on) links[i].setAttribute("aria-current", "page");
    }
  })();

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var header = document.getElementById("header");
  var onScrollHeader = function () {
    if (header && window.scrollY > 10) header.classList.add("is-scrolled");
    else if (header) header.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").trim();
      var email = (data.get("email") || "").trim();
      var profession = (data.get("profession") || "").trim();
      var pack = (data.get("pack") || "").trim();
      var message = (data.get("message") || "").trim();

      if (!name || !email || !message) {
        var status = document.getElementById("formStatus");
        if (status) {
          status.textContent = "Merci de remplir les champs obligatoires (nom, e-mail et message).";
          status.style.display = "block";
        }
        return;
      }

      var lines = [
        "Nom : " + name,
        "E-mail : " + email,
        "Profession : " + (profession || "Non renseignée"),
        "Pack : " + (pack || "Non renseigné"),
        "",
        message
      ];
      var subject = encodeURIComponent("Demande de contact - " + name);
      var body = encodeURIComponent(lines.join("\n"));
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          profession: profession,
          pack: pack,
          message: message,
          website: (document.getElementById("website") || {}).value || ""
        })
      }).then(function (r) {
        if (!r.ok) throw new Error("http_" + r.status);
        try { sessionStorage.setItem("csmDemande", JSON.stringify({ kind: "formulaire", href: "" })); } catch (e) {}
      }).catch(function () {
        var mailHref = "mailto:secretariat83100@gmail.com?subject=" + subject + "&body=" + body;
        try { sessionStorage.setItem("csmDemande", JSON.stringify({ href: mailHref })); } catch (e) {}
        window.location.href = mailHref;
      });

      var ok = document.getElementById("formStatus");
      if (ok) {
        ok.textContent = "Votre messagerie s'ouvre avec votre demande prête à être envoyée. Merci !";
        ok.style.display = "block";
      }
      form.reset();

      setTimeout(function () { window.location.href = "merci.html"; }, 800);
    });
  }

  var backTop = document.getElementById("backTop");
  if (backTop) {
    var _btRaf = false; window.addEventListener("scroll", function () {
      if (_btRaf) return; _btRaf = true;
      requestAnimationFrame(function () { _btRaf = false;
        backTop.classList.toggle("is-visible", window.scrollY > 600);
      });
    }, { passive: true });
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  var PHONE_DISPLAY = "06 13 31 07 57";
  var PHONE_INTL = "+33613310757";
  var toast;
  function showToast(msg) {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2800);
  }
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(PHONE_DISPLAY).catch(function () {});
      }
      showToast("Numéro copié : " + PHONE_DISPLAY + ". Appelez depuis votre téléphone.");
    });
  });
})();

/* Reconstruction des liens e-mail cote navigateur (anti-moissonnage) */
(function () {
  var links = document.querySelectorAll("a[data-mailto]");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute("href", "mailto:" + links[i].getAttribute("data-mailto"));
    links[i].removeAttribute("data-mailto");
  }
})();