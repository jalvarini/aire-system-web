(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#nav-principal");
  const yearEl = document.querySelector("#year");
  const form = document.querySelector("#form-contacto");
  const formStatus = document.querySelector("#form-status");
  const servicePanels = document.querySelectorAll("[data-service]");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Header scroll state ---------- */
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const setMenuOpen = (open) => {
    if (!header || !navToggle || !nav) return;
    header.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") !== "true";
      setMenuOpen(open);
    });
  }

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  /* ---------- Service accordion ---------- */
  const setActivePanel = (panel) => {
    servicePanels.forEach((item) => {
      const isActive = item === panel;
      item.classList.toggle("is-active", isActive);
      const trigger = item.querySelector(".service-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", String(isActive));
    });
  };

  servicePanels.forEach((panel) => {
    const trigger = panel.querySelector(".service-trigger");
    trigger?.addEventListener("click", () => {
      if (panel.classList.contains("is-active")) {
        // Keep one open on desktop; allow collapse only on small screens
        if (window.matchMedia("(max-width: 720px)").matches) {
          panel.classList.remove("is-active");
          trigger.setAttribute("aria-expanded", "false");
        }
        return;
      }
      setActivePanel(panel);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    ".section-head, .service-stack, .about-content, .process-list, .contact-intro, .contact-form"
  );

  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Contact form validation ---------- */
  const validators = {
    nombre: (value) => {
      if (!value.trim()) return "Ingrese su nombre.";
      if (value.trim().length < 2) return "El nombre es demasiado corto.";
      return "";
    },
    telefono: (value) => {
      const cleaned = value.replace(/[\s()-]/g, "");
      if (!cleaned) return "Ingrese un teléfono.";
      if (!/^\+?\d{8,15}$/.test(cleaned)) return "Use un teléfono válido.";
      return "";
    },
    email: (value) => {
      if (!value.trim()) return "Ingrese su correo.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Correo no válido.";
      return "";
    },
    servicio: (value) => (!value ? "Seleccione un servicio." : ""),
    mensaje: (value) => {
      if (!value.trim()) return "Describa su proyecto.";
      if (value.trim().length < 12) return "Agregue un poco más de detalle.";
      return "";
    },
  };

  const showFieldError = (fieldName, message) => {
    const field = form?.querySelector(`[name="${fieldName}"]`)?.closest(".field");
    const error = form?.querySelector(`[data-error-for="${fieldName}"]`);
    if (!field || !error) return;
    field.classList.toggle("is-invalid", Boolean(message));
    error.textContent = message;
  };

  const validateForm = () => {
    let valid = true;
    Object.keys(validators).forEach((name) => {
      const input = form?.elements.namedItem(name);
      const value = input && "value" in input ? String(input.value) : "";
      const message = validators[name](value);
      showFieldError(name, message);
      if (message) valid = false;
    });
    return valid;
  };

  form?.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("blur", () => {
      const name = el.getAttribute("name");
      if (!name || !validators[name]) return;
      showFieldError(name, validators[name](el.value));
    });

    el.addEventListener("input", () => {
      const name = el.getAttribute("name");
      if (!name) return;
      const field = el.closest(".field");
      if (field?.classList.contains("is-invalid")) {
        showFieldError(name, validators[name](el.value));
      }
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!formStatus) return;

    if (!validateForm()) {
      formStatus.textContent = "Revise los campos marcados.";
      formStatus.classList.add("is-error");
      const firstInvalid = form.querySelector(".field.is-invalid input, .field.is-invalid select, .field.is-invalid textarea");
      firstInvalid?.focus();
      return;
    }

    formStatus.classList.remove("is-error");
    formStatus.textContent = "Solicitud lista. Nos pondremos en contacto pronto.";
    form.reset();

    Object.keys(validators).forEach((name) => showFieldError(name, ""));
  });
})();
