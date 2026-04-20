/**
 * Daena + Klyntar Particle System v2
 * ═══════════════════════════════════════════════════════════════════════════
 * Replaces the descending pipe with a 4-act hexagonal narrative that
 * visually represents the brand (PhiLattice = Fibonacci + honeycomb).
 *
 *   Act 1 (0.00-0.25):  Fibonacci spiral       — Daena's PhiLattice calm
 *   Act 2 (0.25-0.55):  Hexagonal honeycomb    — 10 departments forming
 *   Act 3 (0.55-0.72):  Threat wave            — red ripple crosses the hex grid
 *   Act 4 (0.72-1.00):  Klyntar fortress       — symbiotic hex tendrils (red)
 *
 * Mouse reactivity in acts 3+4: cursor creates a red pulse. The fortress
 * literally reacts to presence.
 *
 * Perf invariants:
 *   - ZERO allocations in the update loop
 *   - Float32Array for positions + colors, preallocated
 *   - Inline HSL→RGB, no new THREE.Color per particle
 *   - 10K desktop @ 60fps · 1.5K mobile @ 50fps
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
  'use strict'

  var isMob = window.innerWidth < 768
  var noWebGL = false
  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  var PARTICLE_COUNT = isMob ? 1500 : 10000
  var GOLDEN_ANGLE = 2.399963229728653
  var SPIRAL_RADIUS = isMob ? 14 : 38
  var FORTRESS_RADIUS = isMob ? 7 : 12

  // Honeycomb layout: 10 hexagonal cells = 10 Daena departments.
  // Arranged in 2 rings: 1 center cell + 6 around = 7 classic honeycomb,
  // but we need 10, so: 1 center + 6 inner ring + 3 outer ring offset.
  // Pre-computed cell centers on the XZ plane (scaled per act).
  var HEX_CELL_CENTERS = [
    { x:  0.0, z:  0.0 },       // 1 center
    { x:  1.0, z:  0.0 },       // 2
    { x:  0.5, z:  0.866 },     // 3
    { x: -0.5, z:  0.866 },     // 4
    { x: -1.0, z:  0.0 },       // 5
    { x: -0.5, z: -0.866 },     // 6
    { x:  0.5, z: -0.866 },     // 7 (inner ring complete)
    { x:  1.5, z:  0.866 },     // 8 outer ring top-right
    { x:  0.0, z:  1.732 },     // 9 outer ring top
    { x: -1.5, z:  0.866 },     // 10 outer ring top-left
  ]
  var CELL_SCALE = isMob ? 6 : 10

  // Precomputed hex angles for the fortress ring pattern
  var HEX_ANGLES = [0, Math.PI / 3, 2 * Math.PI / 3, Math.PI, 4 * Math.PI / 3, 5 * Math.PI / 3]

  window.daenaParticles = {
    scrollProgress: 0,
    scene: null, camera: null, renderer: null, points: null, ready: false,
    mouseX: 0, mouseY: 0, mouseActive: false,
  }

  // WebGL check
  try {
    var testCanvas = document.createElement('canvas')
    var gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
    if (!gl) noWebGL = true
  } catch (e) { noWebGL = true }
  if (noWebGL) { document.body.classList.add('no-webgl'); return }

  var canvas = document.getElementById('bg-canvas')
  if (!canvas) return

  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(isMob ? 75 : 60, window.innerWidth / window.innerHeight, 0.1, 200)
  camera.position.set(0, isMob ? 18 : 35, isMob ? 8 : 5)
  camera.lookAt(0, 0, 0)

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas, antialias: !isMob, alpha: false,
    powerPreference: isMob ? 'low-power' : 'high-performance'
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMob ? 1.5 : 2))
  renderer.setClearColor(0x0a0a0a, 1)

  var geometry = new THREE.BufferGeometry()
  var positions = new Float32Array(PARTICLE_COUNT * 3)
  var colors = new Float32Array(PARTICLE_COUNT * 3)
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  var material = new THREE.PointsMaterial({
    size: isMob ? 0.12 : 0.25,
    vertexColors: true, transparent: true,
    opacity: isMob ? 0.5 : 1.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false, sizeAttenuation: true
  })

  var points = new THREE.Points(geometry, material)
  scene.add(points)

  window.daenaParticles.scene = scene
  window.daenaParticles.camera = camera
  window.daenaParticles.renderer = renderer
  window.daenaParticles.points = points
  window.daenaParticles.ready = true

  // ── Color utils (inline, allocation-free) ─────────────────────────────────
  function hsl2rgb(h, s, l, out, idx) {
    var r, g, b
    if (s === 0) { r = g = b = l }
    else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s
      var p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    out[idx] = r; out[idx + 1] = g; out[idx + 2] = b
  }
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  function smoothstep(t) { return t * t * (3 - 2 * t) }
  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v) }

  var DAENA_H = 0.53
  var GOLD_H = 0.1
  var KLYNTAR_H = 0.98

  // ── Mouse tracking ────────────────────────────────────────────────────────
  var worldMouseX = 0, worldMouseZ = 0
  function updateWorldMouse() {
    worldMouseX = window.daenaParticles.mouseX * 25
    worldMouseZ = window.daenaParticles.mouseY * 15
  }
  window.addEventListener('pointermove', function (e) {
    window.daenaParticles.mouseX = (e.clientX / window.innerWidth) * 2 - 1
    window.daenaParticles.mouseY = (e.clientY / window.innerHeight) * 2 - 1
    window.daenaParticles.mouseActive = true
  }, { passive: true })
  window.addEventListener('pointerleave', function () {
    window.daenaParticles.mouseActive = false
  }, { passive: true })

  // ── Main update ───────────────────────────────────────────────────────────
  function updateParticles(time) {
    var sp = window.daenaParticles.scrollProgress
    var count = PARTICLE_COUNT
    updateWorldMouse()

    // Threat-wave phase (acts 3+)
    var threatPhase = sp > 0.55 ? (time * 0.7 + (sp - 0.55) * 5) : 0
    var mouseStrength = (sp > 0.55 && window.daenaParticles.mouseActive) ? 1 : 0

    // Per-particle cell assignment for honeycomb + fortress
    // (10 cells, particles evenly distributed across them)
    var cellCount = 10

    for (var i = 0; i < count; i++) {
      var i3 = i * 3
      var x, y, z
      var h, s, l

      // Which cell does this particle belong to? (for hex acts 2 and 4)
      var cellIdx = i % cellCount
      var inCellPos = Math.floor(i / cellCount) / Math.floor(count / cellCount)
      var cell = HEX_CELL_CENTERS[cellIdx]

      if (sp < 0.25) {
        // ── ACT 1: Fibonacci spiral ────────────────────────────────────
        var angle = i * GOLDEN_ANGLE + time * 0.08
        var radius = Math.sqrt(i / count) * SPIRAL_RADIUS
        x = Math.cos(angle) * radius
        z = Math.sin(angle) * radius
        y = Math.sin(i * 0.008 + time * 0.4) * 0.6

        h = DAENA_H + Math.sin(i * 0.01) * 0.04
        s = isMob ? 0.85 : 0.7
        l = (isMob ? 0.5 : 0.38) + Math.sin(i * 0.005 + time * 0.3) * 0.08
      }
      else if (sp < 0.55) {
        // ── ACT 2: Spiral → Hexagonal Honeycomb (10 departments) ─────
        var t = (sp - 0.25) / 0.30
        var et = smoothstep(t)

        // Spiral position
        var sAngle = i * GOLDEN_ANGLE + time * 0.08
        var sRadius = Math.sqrt(i / count) * SPIRAL_RADIUS
        var sx = Math.cos(sAngle) * sRadius
        var sz = Math.sin(sAngle) * sRadius
        var sy = Math.sin(i * 0.008 + time * 0.4) * 0.6

        // Target: particle orbits within its assigned hex cell
        var hAngle = inCellPos * Math.PI * 2 + time * 0.15 + cellIdx
        var hRadius = (isMob ? 2.4 : 3.8) * (0.3 + Math.sin(inCellPos * Math.PI) * 0.7)
        var hx = cell.x * CELL_SCALE + Math.cos(hAngle) * hRadius
        var hz = cell.z * CELL_SCALE + Math.sin(hAngle) * hRadius
        var hy = Math.sin(inCellPos * Math.PI * 2 + time * 0.5 + cellIdx) * 1.2

        x = sx + (hx - sx) * et
        y = sy + (hy - sy) * et
        z = sz + (hz - sz) * et

        // Cell centers (every 6th particle) glow gold as department beacons
        var isBeacon = (inCellPos < 0.02)
        h = isBeacon ? GOLD_H : DAENA_H
        s = 0.85
        l = isBeacon ? 0.58 : (0.4 + t * 0.1)
      }
      else if (sp < 0.72) {
        // ── ACT 3: Threat wave across the hex grid ────────────────────
        // Grid stays in place, red wave propagates across the X axis
        var waveAngle = inCellPos * Math.PI * 2 + time * 0.15 + cellIdx
        var waveRadius = (isMob ? 2.4 : 3.8) * (0.3 + Math.sin(inCellPos * Math.PI) * 0.7)
        x = cell.x * CELL_SCALE + Math.cos(waveAngle) * waveRadius
        z = cell.z * CELL_SCALE + Math.sin(waveAngle) * waveRadius
        y = Math.sin(inCellPos * Math.PI * 2 + time * 0.5 + cellIdx) * 1.2

        // Wave sweeps left→right across the grid
        var waveX = -20 + ((threatPhase * 8) % 50)
        var distToWave = Math.abs(x - waveX)
        var inWave = distToWave < 4 ? 1 - distToWave / 4 : 0

        // Mouse reactivity
        var mouseDist = 999
        if (mouseStrength > 0) {
          var dx = x - worldMouseX, dz = z - worldMouseZ
          mouseDist = Math.sqrt(dx * dx + dz * dz)
        }
        var mouseProx = mouseDist < 6 ? (1 - mouseDist / 6) : 0

        var redness = Math.max(inWave, mouseProx * 0.85)
        h = DAENA_H + (KLYNTAR_H - DAENA_H) * redness
        if (redness > 0.5) h = KLYNTAR_H - (1 - redness) * 0.05
        s = 0.9
        l = 0.42 + redness * 0.22 + Math.sin(i * 0.01 + time) * 0.04
      }
      else {
        // ── ACT 4: Klyntar Fortress (symbiotic hex tendrils) ──────────
        var ft = (sp - 0.72) / 0.28
        var et2 = smoothstep(clamp01(ft))

        // Ring index for fortress formation (6 rings like hex sides)
        var ringIdx = i % 6
        var ringPos = Math.floor(i / 6) / Math.floor(count / 6)
        var ringRadius = FORTRESS_RADIUS * (0.25 + ringIdx * 0.14)
        var fAngle = HEX_ANGLES[ringIdx] + ringPos * (Math.PI * 2 / 3) + time * 0.025
        var fx = Math.cos(fAngle) * ringRadius
        var fz = Math.sin(fAngle) * ringRadius
        // Tendril-like vertical oscillation
        var fy = Math.sin(ringPos * Math.PI * 3 + time * 0.8 + ringIdx) * 2

        // Previous hex-grid position for smooth morph
        var prevAngle = inCellPos * Math.PI * 2 + time * 0.15 + cellIdx
        var prevRadius = (isMob ? 2.4 : 3.8) * (0.3 + Math.sin(inCellPos * Math.PI) * 0.7)
        var px = cell.x * CELL_SCALE + Math.cos(prevAngle) * prevRadius
        var pz = cell.z * CELL_SCALE + Math.sin(prevAngle) * prevRadius
        var py = Math.sin(inCellPos * Math.PI * 2 + time * 0.5 + cellIdx) * 1.2

        x = px + (fx - px) * et2
        y = py + (fy - py) * et2
        z = pz + (fz - pz) * et2

        // Mouse-reactive red pulse (the viral moment)
        var mDist = 999
        if (mouseStrength > 0) {
          var ddx = x - worldMouseX, ddz = z - worldMouseZ
          mDist = Math.sqrt(ddx * ddx + ddz * ddz)
        }
        var mProx = mDist < 7 ? (1 - mDist / 7) : 0

        var pulse = Math.sin(time * 2 + i * 0.05) * 0.15 + 0.85
        var ringRedness = (ringIdx < 3 ? 1 : 0.35) * pulse
        var totalRed = Math.max(ringRedness, mProx * 1.2)
        h = DAENA_H + (KLYNTAR_H - DAENA_H) * clamp01(totalRed)
        if (totalRed > 0.55) h = KLYNTAR_H
        s = 0.92
        l = 0.42 + totalRed * 0.25 + mProx * 0.15
      }

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      hsl2rgb(h, s, l, colors, i3)
    }

    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate = true
  }

  if (noMotion) {
    updateParticles(0)
    renderer.render(scene, camera)
    return
  }

  var lastFrame = 0
  var frameInterval = isMob ? 20 : 16.67

  function animate(now) {
    requestAnimationFrame(animate)
    if (now - lastFrame < frameInterval) return
    lastFrame = now
    var time = now * 0.001
    updateParticles(time)
    renderer.render(scene, camera)
  }
  requestAnimationFrame(animate)

  function onResize() {
    var w = window.innerWidth, h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)
})()
