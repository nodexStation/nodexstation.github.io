/*
 * NodeX Station — Three.js hero background
 * -----------------------------------------
 * A slowly rotating gold wireframe icosahedron plus a gold/white particle
 * field with faint connecting lines, rendered on a transparent canvas
 * behind the hero content. Pure decoration (aria-hidden, pointer-events
 * off via CSS).
 *
 * Robustness contract:
 *  - If the Three.js CDN failed, WebGL is unavailable, or anything throws,
 *    the canvas is hidden and the site looks exactly as it did before.
 *  - prefers-reduced-motion: the animation never starts.
 *  - Rendering pauses when the tab is hidden or the hero is off-screen.
 *  - devicePixelRatio is capped at 2 so high-DPI screens stay cheap.
 */
(function () {
  "use strict";

  var canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  function hideCanvas() {
    canvas.style.display = "none";
  }

  // Respect users who prefer reduced motion — leave the static hero as-is.
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
    // WebGL not available, context creation failed, etc. — static hero wins.
    hideCanvas();
  }

  function init() {
    var hero = canvas.parentElement;
    var THREE = window.THREE;

    // --- Renderer (transparent, so the hero gradient shows through) ------
    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    var GOLD = 0xd4af37;
    var GOLD_LIGHT = 0xf5d67b;
    var WHITE = 0xf8fafc;

    // --- Centrepiece: gold wireframe icosahedron -------------------------
    var shapeGroup = new THREE.Group();

    var wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.55, 1),
      new THREE.MeshBasicMaterial({
        color: GOLD,
        wireframe: true,
        transparent: true,
        opacity: 0.5
      })
    );
    shapeGroup.add(wire);

    // A slightly smaller, even fainter inner shell for depth.
    var inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.7, 0),
      new THREE.MeshBasicMaterial({
        color: GOLD_LIGHT,
        wireframe: true,
        transparent: true,
        opacity: 0.28
      })
    );
    shapeGroup.add(inner);

    // Glowing vertices on the outer shell.
    var vertexDots = new THREE.Points(
      new THREE.IcosahedronGeometry(2.55, 1),
      new THREE.PointsMaterial({
        color: GOLD_LIGHT,
        size: 0.07,
        transparent: true,
        opacity: 0.9
      })
    );
    shapeGroup.add(vertexDots);

    scene.add(shapeGroup);

    // --- Particle field with faint connecting lines ----------------------
    var PARTICLE_COUNT = 340;
    var positions = new Float32Array(PARTICLE_COUNT * 3);
    var colors = new Float32Array(PARTICLE_COUNT * 3);
    var goldColor = new THREE.Color(GOLD);
    var goldLightColor = new THREE.Color(GOLD_LIGHT);
    var whiteColor = new THREE.Color(WHITE);

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      // Spread particles in a flattened sphere-ish cloud.
      var radius = 3.2 + Math.random() * 4.6;
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
      positions[i * 3 + 2] = radius * Math.cos(phi) - 1.5;

      var pick = Math.random();
      var c = pick < 0.55 ? goldColor : (pick < 0.8 ? goldLightColor : whiteColor);
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
        opacity: 0.85
      })
    );
    scene.add(particles);

    // Faint lines between nearby particles — the "connected network" feel.
    // Computed once at load; the line group rotates together with the points,
    // so the connections stay attached to their particles.
    var linePositions = [];
    var MAX_SEGMENTS = 420;
    var CONNECT_DIST_SQ = 1.55 * 1.55;
    for (var a = 0; a < PARTICLE_COUNT && linePositions.length / 6 < MAX_SEGMENTS; a++) {
      for (var b = a + 1; b < PARTICLE_COUNT && linePositions.length / 6 < MAX_SEGMENTS; b++) {
        var dx = positions[a * 3] - positions[b * 3];
        var dy = positions[a * 3 + 1] - positions[b * 3 + 1];
        var dz = positions[a * 3 + 2] - positions[b * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < CONNECT_DIST_SQ) {
          linePositions.push(
            positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2],
            positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]
          );
        }
      }
    }
    var lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    var lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({
        color: GOLD,
        transparent: true,
        opacity: 0.13
      })
    );
    // Lines share the particles' transform so they rotate as one field.
    var fieldGroup = new THREE.Group();
    scene.remove(particles);
    fieldGroup.add(particles);
    fieldGroup.add(lines);
    scene.add(fieldGroup);

    // --- Layout / sizing ---------------------------------------------------
    function layout() {
      var w = hero.clientWidth || window.innerWidth;
      var h = hero.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Park the centrepiece to the right of the text on wide screens,
      // centred (and quieter behind the text) on narrow ones.
      shapeGroup.position.x = w > 900 ? 2.5 : 0;
    }
    layout();
    window.addEventListener("resize", layout);

    // --- Mouse parallax (gentle, lerped) -----------------------------------
    var mouseX = 0;
    var mouseY = 0;
    var camX = 0;
    var camY = 0;
    window.addEventListener("mousemove", function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 .. 1
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;  // -1 .. 1
    }, { passive: true });

    // --- Pause when it can't be seen ---------------------------------------
    var tabVisible = !document.hidden;
    var heroVisible = true;
    document.addEventListener("visibilitychange", function () {
      tabVisible = !document.hidden;
    });
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
      }, { threshold: 0.02 });
      observer.observe(hero);
    }

    // --- Render loop ---------------------------------------------------------
    function tick() {
      requestAnimationFrame(tick);
      if (!tabVisible || !heroVisible) return; // paused — skip the render

      wire.rotation.y += 0.0016;
      wire.rotation.x += 0.0007;
      inner.rotation.y -= 0.0022;
      inner.rotation.z += 0.0009;
      vertexDots.rotation.copy(wire.rotation);
      fieldGroup.rotation.y += 0.00035;

      // Ease the camera toward the mouse for a subtle parallax drift.
      camX += (mouseX * 0.55 - camX) * 0.04;
      camY += (-mouseY * 0.35 - camY) * 0.04;
      camera.position.x = camX;
      camera.position.y = camY;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    tick();
  }
})();
