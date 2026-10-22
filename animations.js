/*
 * NodeX Station — GSAP entrance & scroll animations
 * ---------------------------------------------------
 * Progressive enhancement only:
 *  - Everything is animated with gsap.from(), so elements start from their
 *    natural, fully-visible state. No CSS in this site hides animated
 *    elements — if the GSAP CDN fails, the page is simply static and
 *    completely readable.
 *  - If window.gsap is missing, this file does nothing.
 *  - prefers-reduced-motion: all animations are skipped.
 *  - Scroll reveals use ScrollTrigger when it loaded; without it, only the
 *    hero intro plays and the rest of the page stays static.
 */
(function () {
  "use strict";

  if (typeof window.gsap === "undefined") return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;

  var gsap = window.gsap;
  var hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";
  if (hasScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  // --- Hero intro: label, heading, lead, CTAs, points — staggered --------
  var heroEls = document.querySelectorAll(
    ".hero .eyebrow, .hero h1, .hero .hero-sub, .hero .hero-actions, .hero .hero-points"
  );
  if (heroEls.length) {
    gsap.from(heroEls, {
      y: 26,
      opacity: 0,
      duration: 0.85,
      ease: "power2.out",
      stagger: 0.12,
      delay: 0.1,
      clearProps: "transform,opacity"
    });
  }

  if (!hasScrollTrigger) return; // Hero intro only — page remains fully usable.

  // --- Scroll reveals ------------------------------------------------------
  // Each group fades up together with a slight stagger when it scrolls in.
  function revealGroup(elements, triggerEl) {
    if (!elements.length) return;
    gsap.from(elements, {
      y: 28,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.09,
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: triggerEl || elements[0],
        start: "top 85%",
        once: true
      }
    });
  }

  // Section headers (label → heading → lead) per section.
  document.querySelectorAll("main .section").forEach(function (section) {
    var headerEls = section.querySelectorAll(".section-label, h2, .section-lead");
    revealGroup(headerEls, section);
  });

  // Content groups, staggered per group.
  revealGroup(document.querySelectorAll("#about .two-col > *"));
  revealGroup(document.querySelectorAll("#services .card"));
  revealGroup(document.querySelectorAll("#process .process-card"));
  revealGroup(document.querySelectorAll("#products .product-card"));
  revealGroup(document.querySelectorAll("#faq .faq-item"));
  revealGroup(document.querySelectorAll("#contact .two-col > *"));
})();
