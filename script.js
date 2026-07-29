(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#nav-principal");
  const yearEl = document.querySelector("#year");
  const form = document.querySelector("#form-contacto");
  const formStatus = document.querySelector("#form-status");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

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

  /* ---------- Project gallery modal ---------- */
  const galleries = {
    climatizacion: {
      title: "Proyectos de climatizacion",
      images: Array.from({ length: 12 }, (_, i) => {
        const n = String(i + 1).padStart(2, "0");
        return {
          src: `clima-${n}.jpg`,
          alt: `Proyecto de climatización ${i + 1}`,
        };
      }),
    },
    electricas: {
      title: "Proyectos de soluciones electricas",
      images: Array.from({ length: 3 }, (_, i) => {
        const n = String(i + 1).padStart(2, "0");
        return {
          src: `electrica-proy-${n}.jpg`,
          alt: `Proyecto de soluciones eléctricas ${i + 1}`,
        };
      }),
    },
    videovigilancia: {
      title: "Sistemas de Video Vigilancia (Camaras de Seguridad)",
      images: Array.from({ length: 8 }, (_, i) => {
        const n = String(i + 1).padStart(2, "0");
        return {
          src: `videovigilancia-proy-${n}.jpg`,
          alt: `Proyecto de videovigilancia ${i + 1}`,
        };
      }),
    },
  };

  const galleryModal = document.querySelector("#gallery-modal");
  const galleryTitle = galleryModal?.querySelector("#gallery-modal-title");
  const galleryImage = galleryModal?.querySelector("[data-gallery-image]");
  const galleryCurrent = galleryModal?.querySelector("[data-gallery-current]");
  const galleryTotal = galleryModal?.querySelector("[data-gallery-total]");
  const galleryTriggers = document.querySelectorAll("[data-gallery]");
  let activeGallery = galleries.climatizacion;
  let galleryIndex = 0;
  let galleryLastFocus = null;

  const renderGallery = () => {
    if (!galleryImage || !galleryCurrent || !galleryTotal || !activeGallery) return;
    const item = activeGallery.images[galleryIndex];
    galleryImage.src = item.src;
    galleryImage.alt = item.alt;
    galleryCurrent.textContent = String(galleryIndex + 1);
    galleryTotal.textContent = String(activeGallery.images.length);
    if (galleryTitle) galleryTitle.textContent = activeGallery.title;
  };

  const openGallery = (galleryKey, startIndex = 0) => {
    if (!galleryModal || !galleries[galleryKey]) return;
    galleryLastFocus = document.activeElement;
    activeGallery = galleries[galleryKey];
    galleryIndex = startIndex;
    renderGallery();
    galleryModal.hidden = false;
    document.body.classList.add("gallery-open");
    galleryModal.querySelector(".gallery-close")?.focus();
  };

  const closeGallery = () => {
    if (!galleryModal || galleryModal.hidden) return;
    galleryModal.hidden = true;
    document.body.classList.remove("gallery-open");
    if (galleryLastFocus && typeof galleryLastFocus.focus === "function") {
      galleryLastFocus.focus();
    }
  };

  const stepGallery = (delta) => {
    if (!activeGallery) return;
    const total = activeGallery.images.length;
    galleryIndex = (galleryIndex + delta + total) % total;
    renderGallery();
  };

  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openGallery(trigger.getAttribute("data-gallery") || "climatizacion", 0);
    });
  });

  galleryModal?.querySelectorAll("[data-gallery-close]").forEach((el) => {
    el.addEventListener("click", closeGallery);
  });

  galleryModal?.querySelector("[data-gallery-prev]")?.addEventListener("click", () => {
    stepGallery(-1);
  });

  galleryModal?.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
    stepGallery(1);
  });

  window.addEventListener("keydown", (event) => {
    if (!galleryModal || galleryModal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeGallery();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepGallery(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepGallery(1);
    }
  });

  /* ---------- Quote request modal ---------- */
  const quoteModal = document.querySelector("#quote-modal");
  const quoteForm = document.querySelector("#form-cotizacion");
  const quoteTrigger = document.querySelector("#btn-cotizacion");
  let quoteLastFocus = null;

  const openQuoteModal = () => {
    if (!quoteModal) return;
    quoteLastFocus = document.activeElement;
    quoteModal.hidden = false;
    document.body.classList.add("quote-open");
    quoteModal.querySelector("#cotizacion-nombre")?.focus();
  };

  const closeQuoteModal = () => {
    if (!quoteModal || quoteModal.hidden) return;
    quoteModal.hidden = true;
    document.body.classList.remove("quote-open");
    if (quoteLastFocus && typeof quoteLastFocus.focus === "function") {
      quoteLastFocus.focus();
    }
  };

  quoteTrigger?.addEventListener("click", openQuoteModal);

  quoteModal?.querySelectorAll("[data-quote-close]").forEach((el) => {
    el.addEventListener("click", closeQuoteModal);
  });

  window.addEventListener("keydown", (event) => {
    if (!quoteModal || quoteModal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeQuoteModal();
    }
  });

  quoteForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = [
      { label: "Nombre", value: quoteForm.elements.namedItem("nombre")?.value?.trim() || "" },
      { label: "Nombre de empresa", value: quoteForm.elements.namedItem("empresa")?.value?.trim() || "" },
      { label: "Tipo de servicio", value: quoteForm.elements.namedItem("servicio")?.value?.trim() || "" },
      { label: "Telefono", value: quoteForm.elements.namedItem("telefono")?.value?.trim() || "" },
      { label: "Correo", value: quoteForm.elements.namedItem("correo")?.value?.trim() || "" },
    ];

    const lines = ["Solicitud de cotizacion - AIRE SYSTEM"];
    fields.forEach((field) => {
      if (field.value) lines.push(`${field.label}: ${field.value}`);
    });

    const message = lines.length > 1 ? lines.join("\n") : "Solicitud de cotizacion - AIRE SYSTEM";
    const url = `https://wa.me/50378196376?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    closeQuoteModal();
  });

  const revealTargets = document.querySelectorAll(
    ".section-head, .about-inner, .about-pillars, .service-grid, .process-list, .project-grid, .contact-shell"
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

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
      const firstInvalid = form.querySelector(
        ".field.is-invalid input, .field.is-invalid select, .field.is-invalid textarea"
      );
      firstInvalid?.focus();
      return;
    }

    formStatus.classList.remove("is-error");
    formStatus.textContent = "Solicitud lista. Nos pondremos en contacto pronto.";
    form.reset();
    Object.keys(validators).forEach((name) => showFieldError(name, ""));
  });
})();
