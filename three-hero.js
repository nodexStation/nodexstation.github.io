/*
 * NodeX Station — Three.js hero visual (cinematic ember network)
 * ----------------------------------------------------------------
 * A warm neural system breathing on the near-black hero: ~64 nodes in
 * orange and cream joined by faint lines to their nearest neighbours,
 * a soft radial glow sprite at the centre, and a sparse ember dust
 * field. The whole network slowly rotates and "breathes" (a gentle
 * scale pulse with light travelling along a few highlighted links).
 * Mouse parallax and a scroll-progress value (window.__nxScroll,
 * written by animations.js — read defensively) drift the camera.
 *
 * Robustness contract:
 *  - Three.js CDN missing / WebGL unavailable / any throw → canvas is
 *    hidden; the CSS hero shade carries the hero alone.
 *  - prefers-reduced-motion: the loop never starts (canvas hidden).
 *  - Loop pauses when the tab is hidden or the hero is off-screen.
 *  - devicePixelRatio capped at 2; resize handled.
 */
(function () {
  "use strict";

  var canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  function hideCanvas() { canvas.style.display = "none"; }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hideCanvas();
    return;
  }
  if (typeof window.THREE === "undefined") {
    hideCanvas();
    return;
  }

  try { init(); } catch (err) { hideCanvas(); }

  function init() {
    var THREE = window.THREE;
    var hero = canvas.parentElement; // .hero-bg — sizing/visibility anchor

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    // ── Palette ──────────────────────────────────────────────────────
    var ORANGE = new THREE.Color(0xdc5000);
    var EMBER = new THREE.Color(0xff7a1a);
    var CREAM = new THREE.Color(0xffedd7);

    var world = new THREE.Group();
    scene.add(world);

    // ── Central glow (canvas-generated radial sprite) ────────────────
    function makeGlowTexture() {
      var s = 256;
      var c = document.createElement("canvas");
      c.width = s; c.height = s;
      var ctx = c.getContext("2d");
      var g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, "rgba(255,122,26,0.55)");
      g.addColorStop(0.35, "rgba(220,80,0,0.22)");
      g.addColorStop(1, "rgba(220,80,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
      return new THREE.CanvasTexture(c);
    }
    var glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeGlowTexture(),
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    glow.scale.set(13, 13, 1);
    glow.position.z = -2.5;
    world.add(glow);

    // ── Network nodes (deterministic pseudo-random, seeded) ──────────
    var seed = 42;
    function rnd() { // small LCG so the composition is stable per load
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }
    var NODE_COUNT = 64;
    var nodes = [];
    var nodePos = new Float32Array(NODE_COUNT * 3);
    var nodeCol = new Float32Array(NODE_COUNT * 3);
    for (var i = 0; i < NODE_COUNT; i++) {
      // Ellipsoidal cloud, denser toward the centre-right of the hero.
      var r = Math.pow(rnd(), 0.6) * 5.4;
      var theta = rnd() * Math.PI * 2;
      var y = (rnd() - 0.5) * 4.6;
      var p = {
        x: Math.cos(theta) * r * 1.25 + 1.1,
        y: y,
        z: Math.sin(theta) * r * 0.55 - 0.6,
        phase: rnd() * Math.PI * 2
      };
      nodes.push(p);
      nodePos[i * 3] = p.x; nodePos[i * 3 + 1] = p.y; nodePos[i * 3 + 2] = p.z;
      var c = rnd() < 0.72 ? ORANGE.clone().lerp(EMBER, rnd() * 0.7) : CREAM.clone();
      nodeCol[i * 3] = c.r; nodeCol[i * 3 + 1] = c.g; nodeCol[i * 3 + 2] = c.b;
    }
    var nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeCol, 3));
    var nodePoints = new THREE.Points(nodeGeo, new THREE.PointsMaterial({
      size: 0.13,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    world.add(nodePoints);

    // ── Links: each node to its 2 nearest neighbours (deduped) ──────
    var linkPairs = {};
    var linkVerts = [];
    nodes.forEach(function (p, a) {
      var dists = [];
      nodes.forEach(function (q, b) {
        if (a === b) return;
        var dx = p.x - q.x, dy = p.y - q.y, dz = p.z - q.z;
        dists.push({ b: b, d: dx * dx + dy * dy + dz * dz });
      });
      dists.sort(function (m, n) { return m.d - n.d; });
      for (var k = 0; k < 2; k++) {
        var b2 = dists[k].b;
        var key = Math.min(a, b2) + "-" + Math.max(a, b2);
        if (linkPairs[key]) continue;
        linkPairs[key] = true;
        linkVerts.push(p.x, p.y, p.z, nodes[b2].x, nodes[b2].y, nodes[b2].z);
      }
    });
    var linkGeo = new THREE.BufferGeometry();
    linkGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linkVerts), 3));
    var links = new THREE.LineSegments(linkGeo, new THREE.LineBasicMaterial({
      color: 0xdc5000,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    world.add(links);

    // ── Travelling pulses on a few highlighted links ─────────────────
    var linkList = Object.keys(linkPairs).map(function (k) {
      var parts = k.split("-");
      return [nodes[+parts[0]], nodes[+parts[1]]];
    });
    var PULSE_COUNT = Math.min(10, linkList.length);
    var pulsePos = new Float32Array(PULSE_COUNT * 3);
    var pulses = [];
    for (var j = 0; j < PULSE_COUNT; j++) {
      pulses.push({
        link: linkList[Math.floor(j * linkList.length / PULSE_COUNT)],
        offset: j / PULSE_COUNT,
        speed: 0.05 + (j % 4) * 0.012
      });
    }
    var pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
    var pulsePoints = new THREE.Points(pulseGeo, new THREE.PointsMaterial({
      color: 0xffc79a,
      size: 0.2,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    world.add(pulsePoints);

    // ── Ember dust ────────────────────────────────────────────────────
    var DUST = 240;
    var dustPos = new Float32Array(DUST * 3);
    for (var d = 0; d < DUST; d++) {
      dustPos[d * 3] = (rnd() - 0.5) * 17;
      dustPos[d * 3 + 1] = (rnd() - 0.5) * 9.5;
      dustPos[d * 3 + 2] = -3.5 + rnd() * 3;
    }
    var dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    var dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      color: 0xff8c3a,
      size: 0.045,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    world.add(dust);

    // ── Sizing ────────────────────────────────────────────────────────
    function layout() {
      var w = hero.clientWidth || window.innerWidth;
      var h = hero.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    layout();
    window.addEventListener("resize", layout);

    // ── Mouse parallax ────────────────────────────────────────────────
    var mouseX = 0, mouseY = 0, camX = 0, camY = 0;
    window.addEventListener("mousemove", function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // ── Pause when unseen ─────────────────────────────────────────────
    var tabVisible = !document.hidden;
    var heroVisible = true;
    document.addEventListener("visibilitychange", function () { tabVisible = !document.hidden; });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
      }, { threshold: 0.02 }).observe(hero);
    }

    // ── Loop ──────────────────────────────────────────────────────────
    var clock = new THREE.Clock();
    var posAttr = pulseGeo.getAttribute("position");
    function tick() {
      requestAnimationFrame(tick);
      if (!tabVisible || !heroVisible) return;

      var t = clock.getElapsedTime();

      // Slow breathing: rotation + a soft scale pulse on the network.
      world.rotation.y = t * 0.03;
      world.rotation.x = Math.sin(t * 0.11) * 0.05;
      var breathe = 1 + Math.sin(t * 0.55) * 0.022;
      nodePoints.scale.set(breathe, breathe, breathe);
      links.scale.copy(nodePoints.scale);
      glow.material.opacity = 0.72 + Math.sin(t * 0.55) * 0.13;

      // Pulses travel their links, looping.
      for (var m = 0; m < PULSE_COUNT; m++) {
        var pu = pulses[m];
        var f = (t * pu.speed + pu.offset) % 1;
        posAttr.setXYZ(m,
          pu.link[0].x + (pu.link[1].x - pu.link[0].x) * f,
          pu.link[0].y + (pu.link[1].y - pu.link[0].y) * f,
          pu.link[0].z + (pu.link[1].z - pu.link[0].z) * f
        );
      }
      posAttr.needsUpdate = true;
      dust.rotation.y = Math.sin(t * 0.04) * 0.04;

      // Camera: mouse parallax + scroll drift (progress from animations.js).
      var scrollP = (typeof window.__nxScroll === "number") ? window.__nxScroll : 0;
      camX += (mouseX * 0.55 - camX) * 0.04;
      camY += (-mouseY * 0.35 - camY) * 0.04;
      camera.position.x = camX;
      camera.position.y = camY - scrollP * 1.6;
      camera.position.z = 11 - scrollP * 1.4;
      camera.lookAt(1.1, 0, 0);

      renderer.render(scene, camera);
    }
    tick();
  }
})();
