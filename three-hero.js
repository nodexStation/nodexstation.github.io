/*
 * NodeX Station — Three.js hero visual
 * -------------------------------------
 * A soft, modern scene matched to the site's light redesign: a cluster of
 * gently floating glossy spheres in emerald, amber and soft white around a
 * light wireframe icosahedron, over a fine emerald/ink particle field.
 * Rendered on a transparent canvas inside the hero panel, behind the
 * floating HTML cards. Pure decoration (aria-hidden, pointer-events off
 * via CSS).
 *
 * Robustness contract:
 *  - If the Three.js CDN failed, WebGL is unavailable, or anything throws,
 *    the canvas is hidden and the hero panel + floating cards carry the
 *    design on their own — zero visual damage.
 *  - prefers-reduced-motion: the animation never starts.
 *  - Rendering pauses when the tab is hidden or the panel is off-screen.
 *  - devicePixelRatio is capped at 2 so high-DPI screens stay cheap.
 */
(function () {
  "use strict";

  var canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  function hideCanvas() {
    canvas.style.display = "none";
  }

  // Respect users who prefer reduced motion — leave the panel static.
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) {
    hideCanvas();
    return;
  }

  // Three.js comes from a CDN; if it failed to load, bail out quietly.
  if (typeof window.THREE === "undefined") {
    hideCanvas();
    return;
  }

  try {
    init();
  } catch (err) {
    // WebGL not available, context creation failed, etc. — static panel wins.
    hideCanvas();
  }

  function init() {
    var panel = canvas.parentElement;
    var THREE = window.THREE;

    // --- Renderer (transparent, so the panel gradient shows through) -----
    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    // --- Lights (needed for the glossy standard materials) ----------------
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));

    var keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    keyLight.position.set(3.5, 5, 6);
    scene.add(keyLight);

    var warmLight = new THREE.DirectionalLight(0xffd9a0, 0.55);
    warmLight.position.set(-5, -1.5, 3);
    scene.add(warmLight);

    // --- Palette ------------------------------------------------------------
    var EMERALD = 0x0e9f6e;
    var EMERALD_LIGHT = 0x5fd3a5;
    var AMBER = 0xf5a623;
    var AMBER_SOFT = 0xffcf87;
    var WHITE = 0xffffff;
    var CREAM = 0xfde9c8;

    var worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // --- Light wireframe icosahedron — the airy centrepiece -----------------
    var wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.85, 1),
      new THREE.MeshBasicMaterial({
        color: 0x0a7a55,
        wireframe: true,
        transparent: true,
        opacity: 0.32
      })
    );
    wire.position.set(-0.9, 0.35, -0.6);
    worldGroup.add(wire);

    // Small vertex dots on the wireframe for a bit of sparkle.
    var vertexDots = new THREE.Points(
      new THREE.IcosahedronGeometry(1.85, 1),
      new THREE.PointsMaterial({
        color: 0x0e9f6e,
        size: 0.06,
        transparent: true,
        opacity: 0.75
      })
    );
    vertexDots.position.copy(wire.position);
    worldGroup.add(vertexDots);

    // --- Glossy floating orbs -------------------------------------------------
    // [x, y, z, radius, colour]
    var orbSpecs = [
      [1.55, 0.95, 0.3, 1.08, EMERALD],        // hero orb, right
      [2.55, -1.15, -0.4, 0.62, AMBER],        // warm companion
      [0.55, -1.55, 0.6, 0.48, WHITE],         // soft white
      [-2.35, -1.25, 0.1, 0.72, AMBER_SOFT],   // gentle amber, low left
      [-2.7, 1.35, -0.8, 0.42, EMERALD_LIGHT], // small emerald, top left
      [0.35, 1.85, -1.1, 0.5, CREAM],          // cream, top centre
      [2.9, 1.7, -1.3, 0.34, EMERALD]          // tiny emerald accent
    ];
    var orbs = [];
    orbSpecs.forEach(function (spec, i) {
      var orb = new THREE.Mesh(
        new THREE.SphereGeometry(spec[3], 48, 32),
        new THREE.MeshStandardMaterial({
          color: spec[4],
          roughness: 0.22,
          metalness: 0.05
        })
      );
      orb.position.set(spec[0], spec[1], spec[2]);
      worldGroup.add(orb);
      orbs.push({
        mesh: orb,
        baseY: spec[1],
        phase: i * 1.37,                    // spread the bobbing out of sync
        speed: 0.55 + (i % 3) * 0.14,
        amp: 0.14 + (i % 2) * 0.05
      });
    });

    // --- Fine particle field (emerald / ink / amber, low opacity) ------------
    var PARTICLE_COUNT = 260;
    var positions = new Float32Array(PARTICLE_COUNT * 3);
    var colors = new Float32Array(PARTICLE_COUNT * 3);
    var palette = [
      new THREE.Color(EMERALD),
      new THREE.Color(0x33413a), // soft ink
      new THREE.Color(AMBER)
    ];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6.4;
      positions[i * 3 + 2] = -2.4 + Math.random() * 2.2;
      var c = palette[i % 3 === 2 ? 2 : (i % 2)]; // mostly emerald/ink, some amber
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    var particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    var particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false
      })
    );
    worldGroup.add(particles);

    // --- Layout / sizing -------------------------------------------------------
    function layout() {
      var w = panel.clientWidth || window.innerWidth;
      var h = panel.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    layout();
    window.addEventListener("resize", layout);

    // --- Mouse parallax (gentle, lerped) ---------------------------------------
    var mouseX = 0;
    var mouseY = 0;
    var camX = 0;
    var camY = 0;
    window.addEventListener("mousemove", function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 .. 1
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;  // -1 .. 1
    }, { passive: true });

    // --- Pause when it can't be seen ---------------------------------------------
    var tabVisible = !document.hidden;
    var panelVisible = true;
    document.addEventListener("visibilitychange", function () {
      tabVisible = !document.hidden;
    });
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        panelVisible = entries[0].isIntersecting;
      }, { threshold: 0.02 });
      observer.observe(panel);
    }

    // --- Render loop ---------------------------------------------------------------
    var clock = new THREE.Clock();
    function tick() {
      requestAnimationFrame(tick);
      if (!tabVisible || !panelVisible) return; // paused — skip the render

      var t = clock.getElapsedTime();

      // Orbs bob gently on individual sine waves.
      orbs.forEach(function (o) {
        o.mesh.position.y = o.baseY + Math.sin(t * o.speed + o.phase) * o.amp;
      });

      // The wireframe breathes very slowly; the particle field drifts.
      wire.rotation.y = t * 0.12;
      wire.rotation.x = Math.sin(t * 0.18) * 0.22;
      vertexDots.rotation.copy(wire.rotation);
      particles.rotation.y = Math.sin(t * 0.05) * 0.05;
      worldGroup.rotation.y = Math.sin(t * 0.07) * 0.06;

      // Ease the camera toward the mouse for a subtle parallax drift.
      camX += (mouseX * 0.5 - camX) * 0.04;
      camY += (-mouseY * 0.3 - camY) * 0.04;
      camera.position.x = camX;
      camera.position.y = camY;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    tick();
  }
})();
