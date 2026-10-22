/*
 * NodeX Station — GSAP cinematic scroll animations
 * ---------------------------------------------------
 * Progressive enhancement only. The hero visual is pure CSS + inline
 * SVG (its rings, pulse and embers are CSS keyframes); this file adds
 * the GSAP layer on top:
 *  - Hero intro, plus a gentle scroll parallax and mouse drift on the
 *    orbital visual (transform-only, decorative layer).
 *  - All motion uses gsap.from() / gsap.fromTo() / gsap.to() driven by
 *    JS — no CSS hides animated content, so if the GSAP CDN fails the
 *    page is static and completely readable.
 *  - prefers-reduced-motion: no GSAP motion at all (CSS keyframe
 *    motion is disabled in styles.css under the same preference).
 *  - No pins, no loader. Reveals fire once.
 */
(function () {
  "use strict";

  // ── Motion gate ────────────────────────────────────────────────────
  if (typeof window.gsap === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var gsap = window.gsap;
  var hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";
  if (hasScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  // ── Hero intro ─────────────────────────────────────────────────────
  var heroEls = document.querySelectorAll("[data-hero]");
  if (heroEls.length) {
    gsap.from(heroEls, {
      y: 34,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.13,
      clearProps: "transform,opacity",
      delay: 0.1
    });
  }

  if (!hasScrollTrigger) return; // Intro only — everything stays visible.

  // ── Hero visual: scroll parallax + gentle mouse drift ──────────────
  var heroVisual = document.querySelector(".hero-visual");
  var heroSection = document.querySelector(".hero");
  if (heroVisual && heroSection) {
    // Drifts up slower than the page as the hero scrolls away.
    gsap.to(heroVisual, {
      y: -46,
      ease: "none",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: 0.7
      }
    });
    // A slow idle float on the artwork itself, so the diagram feels
    // alive even at rest (kept off the wrapper — no transform fights).
    var orbitArt = heroVisual.querySelector(".orbit-svg");
    if (orbitArt) {
      gsap.to(orbitArt, {
        y: -10,
        duration: 3.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }
    // The whole diagram leans a few pixels toward the cursor.
    if (window.matchMedia("(pointer: fine)").matches && gsap.quickTo) {
      var driftX = gsap.quickTo(heroVisual, "x", { duration: 0.9, ease: "power3.out" });
      var driftR = gsap.quickTo(heroVisual, "rotation", { duration: 1.1, ease: "power3.out" });
      heroSection.addEventListener("mousemove", function (e) {
        var nx = e.clientX / window.innerWidth - 0.5;
        driftX(nx * 16);
        driftR(nx * 1.4);
      });
      heroSection.addEventListener("mouseleave", function () {
        driftX(0);
        driftR(0);
      });
    }
  }

  // ── Group reveals ──────────────────────────────────────────────────
  function revealGroup(elements, triggerEl, opts) {
    if (!elements.length) return;
    var o = opts || {};
    gsap.from(elements, {
      y: o.y || 30,
      opacity: 0,
      duration: o.duration || 0.85,
      ease: "power3.out",
      stagger: o.stagger || 0.09,
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: triggerEl || elements[0],
        start: "top 86%",
        once: true
      }
    });
  }

  // Section headers throughout.
  document.querySelectorAll("main .section, .story, .closing").forEach(function (section) {
    revealGroup(section.querySelectorAll(".section-label, .section-title, .section-lead"), section);
  });

  // ── Story: word-by-word progressive reveal (scrubbed) ─────────────
  document.querySelectorAll("[data-words]").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map(function (w) {
      return '<span class="w" aria-hidden="true">' + w + "</span>";
    }).join(" ");
    gsap.fromTo(el.querySelectorAll(".w"),
      { opacity: 0.13 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.06,
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          end: "bottom 45%",
          scrub: 0.4
        }
      });
    // The block's index + label rise in as it arrives.
    var block = el.closest(".story-block");
    if (block) {
      revealGroup(block.querySelectorAll(".story-index, .story-label"), block);
    }
  });

  // ── Workflow diagram: draw paths, then activate stages ─────────────
  var flowSvg = document.querySelector(".flow-svg");
  if (flowSvg) {
    var paths = flowSvg.querySelectorAll(".flow-path");
    paths.forEach(function (p) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
    var flowTl = gsap.timeline({
      scrollTrigger: { trigger: flowSvg, start: "top 78%", once: true }
    });
    flowTl.to(paths, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.inOut",
      stagger: 0.12
    });
    [1, 2, 3].forEach(function (step, i) {
      flowTl.fromTo(
        flowSvg.querySelectorAll('.flow-node[data-step="' + step + '"]'),
        { opacity: 0.25 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          onStart: activateStep(step)
        },
        0.3 + i * 0.55
      );
    });
    function activateStep(step) {
      return function () {
        flowSvg.querySelectorAll(".flow-node").forEach(function (n) {
          n.classList.toggle("is-on", n.getAttribute("data-step") === String(step));
        });
      };
    }
    revealGroup(document.querySelectorAll("#how .flow-steps > li"), document.querySelector("#how .flow-steps"));
    revealGroup(document.querySelectorAll("#how .spec-row-t"), document.querySelector("#how .spec-table"));
  }

  // ── Capabilities rows ──────────────────────────────────────────────
  revealGroup(document.querySelectorAll("#capabilities .spec-item"), document.querySelector("#capabilities .spec-list"), { stagger: 0.07, y: 22 });

  // ── Console preview: entrance, parallax, looping row highlight ─────
  var consoleEl = document.querySelector(".console");
  if (consoleEl) {
    revealGroup([consoleEl], consoleEl, { y: 46, duration: 1 });
    gsap.to(consoleEl, {
      y: -22,
      ease: "none",
      scrollTrigger: {
        trigger: consoleEl,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6
      }
    });
    var rows = consoleEl.querySelectorAll(".run-row");
    if (rows.length) {
      var loopTl = gsap.timeline({
        repeat: -1,
        scrollTrigger: { trigger: consoleEl, start: "top 80%", once: true }
      });
      rows.forEach(function (row) {
        loopTl.fromTo(row,
          { backgroundColor: "rgba(220,80,0,0)" },
          { backgroundColor: "rgba(220,80,0,0.10)", duration: 0.45, ease: "sine.inOut" })
          .to(row, { backgroundColor: "rgba(220,80,0,0)", duration: 0.45, ease: "sine.inOut" }, "+=0.55");
      });
    }
    revealGroup(consoleEl.querySelectorAll(".chat-msg"), consoleEl, { stagger: 0.16, y: 16 });
  }

  // ── Use cases, pricing, founder, FAQ, contact ──────────────────────
  revealGroup(document.querySelectorAll("#use-cases .case-row"), document.querySelector("#use-cases .case-list"));
  revealGroup(document.querySelectorAll("#products .price-row"), document.querySelector("#products .price-table"), { stagger: 0.07, y: 22 });
  revealGroup(document.querySelectorAll("#founder .founder-mark, #founder .founder-body > *"), document.querySelector("#founder"), { stagger: 0.08 });
  revealGroup(document.querySelectorAll("#faq .faq-item"), document.querySelector("#faq .faq-list"), { stagger: 0.06, y: 18 });
  revealGroup(document.querySelectorAll("#contact .contact-grid > *"), document.querySelector("#contact .contact-grid"));
  revealGroup(document.querySelectorAll(".closing .closing-title, .closing .btn, .closing .closing-note"), document.querySelector(".closing"), { stagger: 0.12, y: 36 });
})();
