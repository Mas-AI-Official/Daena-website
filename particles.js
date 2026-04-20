/**
 * Daena + Klyntar Particle System
 * ═══════════════════════════════════════════════════════════════════════════
 * 10K particles telling a 4-act narrative as you scroll:
 *   Act 1 (0.00-0.25):  Fibonacci spiral  — Daena's calm governance (cyan)
 *   Act 2 (0.25-0.55):  Pipeline descent  — 10-stage governed flow (cyan+gold)
 *   Act 3 (0.55-0.72):  Threat wave       — red ripple propagates through pipe
 *   Act 4 (0.72-1.00):  Klyntar fortress  — hex shield formation (red+cyan)
 *
 * Mouse interactivity (acts 3+4):
 *   Cursor proximity creates a live red pulse. The fortress literally
 *   reacts to the viewer's touch — Klyntar's defense is real-time visible.
 *
 * Perf invariants (don't break these):
 *   - ZERO allocations in the update loop
 *   - Float32Array for positions + colors, preallocated
 *   - Inline HSL→RGB, no new THREE.Color per particle
 *   - Desktop: 10K particles @ 60fps · Mobile: 1.5K @ 50fps
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
  var FORTRESS_RADIUS = isMob ? 7 : 12  // hex fortress outer ring

  // Precomputed hex angles (6 sides) for the Klyntar fortress shape.
  var HEX_ANGLES = [0, Math.PI / 3, 2 * Math.PI / 3, Math.PI, 4 * Math.PI / 3, 5 * Math.PI / 3]

  window.daenaParticles = {
    scrollProgress: 0,
    scene: null,
    camera: null,
    renderer: null,
    points: null,
    ready: false,
    // Mouse in normalized device coords [-1,1]
    mouseX: 0,
    mouseY: 0,
    mouseActive: false,
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
    canvas: canvas,
    antialias: !isMob,
    alpha: false,
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
    vertexColors: true,
    transparent: true,
    opacity: isMob ? 0.5 : 1.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
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
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }
    out[idx] = r; out[idx + 1] = g; out[idx + 2] = b
  }
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  function smoothstep(t) { return t * t * (3 - 2 * t) }
  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v) }

  // Key hues
  var DAENA_H = 0.53     // cyan
  var GOLD_H = 0.1
  var KLYNTAR_H = 0.98   // crimson red (#ff4060-ish)

  // ── Mouse tracking → world-space point projection ─────────────────────────
  // We track normalized mouse position and project it onto the Z=0 plane so
  // we can compute particle-cursor distance in world units.
  var worldMouseX = 0, worldMouseZ = 0
  function updateWorldMouse() {
    // Rough projection: use camera position + pitch. Good enough for proximity.
    // Camera is tilted down, so worldMouseZ is derived with a damping factor.
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

  // ── Main update: ZERO allocations ─────────────────────────────────────────
  function updateParticles(time) {
    var sp = window.daenaParticles.scrollProgress
    var count = PARTICLE_COUNT
    updateWorldMouse()

    // Threat-wave phase (used in acts 3+): a ripple that propagates down-pipe
    var threatPhase = sp > 0.55 ? (time * 0.7 + (sp - 0.55) * 5) : 0

    // Mouse reactivity strength (active in acts 3+, 0 otherwise)
    var mouseStrength = (sp > 0.55 && window.daenaParticles.mouseActive) ? 1 : 0

    for (var i = 0; i < count; i++) {
      var i3 = i * 3
      var x, y, z
      var h, s, l

      if (sp < 0.25) {
        // ── ACT 1: Fibonacci spiral (Daena's PhiLattice, calm) ────────────
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
        // ── ACT 2: Spiral → Pipeline descent (governed flow) ──────────────
        var t = (sp - 0.25) / 0.30
        var et = smoothstep(t)

        var sAngle = i * GOLDEN_ANGLE + time * 0.08
        var sRadius = Math.sqrt(i / count) * SPIRAL_RADIUS
        var sx = Math.cos(sAngle) * sRadius
        var sz = Math.sin(sAngle) * sRadius
        var sy = Math.sin(i * 0.008 + time * 0.4) * 0.6

        var pAngle = (i * GOLDEN_ANGLE) % (Math.PI * 2) + time * 0.03
        var pRadius = (isMob ? 3 : 5) + Math.sin(i * 0.003 + time * 0.5) * 0.4
        var px = Math.cos(pAngle) * pRadius
        var pz = Math.sin(pAngle) * pRadius
        var py = -((i / count) * 35)

        x = sx + (px - sx) * et
        y = sy + (py - sy) * et
        z = sz + (pz - sz) * et

        // Cyan dominant, gold on every 6th vertex (stage markers)
        var isVertex = (i % 6 === 0)
        h = isVertex ? GOLD_H : DAENA_H
        s = 0.85
        l = isVertex ? 0.55 : (0.42 + t * 0.08)
      }
      else if (sp < 0.72) {
        // ── ACT 3: Threat wave (red ripple through the pipe) ──────────────
        // Particles stay in pipe shape but a red wave propagates downward.
        var tw = (sp - 0.55) / 0.17

        var waveAngle = (i * GOLDEN_ANGLE) % (Math.PI * 2) + time * 0.03
        var waveRadius = (isMob ? 3 : 5) + Math.sin(i * 0.003 + time * 0.5) * 0.4
        x = Math.cos(waveAngle) * waveRadius
        z = Math.sin(waveAngle) * waveRadius
        y = -((i / count) * 35) + tw * 5  // slight pull up

        // Wave-front color shift: particles whose y-position is near the
        // wave front go red; others stay cyan.
        var particleY = i / count  // 0 (top) to 1 (bottom)
        var waveFront = (threatPhase * 0.15) % 1.4 - 0.2
        var distToWave = Math.abs(particleY - waveFront)
        var inWave = distToWave < 0.1 ? 1 : Math.max(0, 1 - (distToWave - 0.1) * 5)

        // Mouse reactivity: particles close to cursor in XZ also go red.
        var mouseDist = 999
        if (mouseStrength > 0) {
          var dx = x - worldMouseX
          var dz = z - worldMouseZ
          mouseDist = Math.sqrt(dx * dx + dz * dz)
        }
        var mouseProx = mouseDist < 6 ? (1 - mouseDist / 6) : 0

        var redness = Math.max(inWave, mouseProx * 0.85, tw * 0.35)
        h = DAENA_H + (KLYNTAR_H - DAENA_H) * redness
        // Wrap through to avoid the hue loop going the long way
        if (redness > 0.5) h = KLYNTAR_H - (1 - redness) * 0.05
        s = 0.9
        l = 0.42 + redness * 0.2 + Math.sin(i * 0.01 + time) * 0.04
      }
      else {
        // ── ACT 4: Klyntar Fortress (hex shield formation) ────────────────
        // Particles arrange in concentric hexagons around a central core.
        // This is the viral moment — the screenshot that says "Klyntar on."
        var ft = (sp - 0.72) / 0.28  // 0 → 1 across this act

        // Assign each particle to one of 6 hex rings based on index
        var ringIdx = i % 6
        var ringCount = Math.floor(count / 6)
        var inRingPos = Math.floor(i / 6) / ringCount  // 0..1 within ring

        var ringRadius = FORTRESS_RADIUS * (0.35 + ringIdx * 0.15)
        var hexAngle = HEX_ANGLES[ringIdx] + inRingPos * (Math.PI * 2 / 3) + time * 0.03
        var hexX = Math.cos(hexAngle) * ringRadius
        var hexZ = Math.sin(hexAngle) * ringRadius
        // Gentle vertical oscillation makes the fortress "breathe"
        var hexY = Math.sin(inRingPos * Math.PI * 2 + time * 0.6 + ringIdx) * 1.5

        // Blend from prior pipe position to fortress position
        var prevAngle = (i * GOLDEN_ANGLE) % (Math.PI * 2) + time * 0.03
        var prevRadius = (isMob ? 3 : 5) + Math.sin(i * 0.003 + time * 0.5) * 0.4
        var prevX = Math.cos(prevAngle) * prevRadius
        var prevZ = Math.sin(prevAngle) * prevRadius
        var prevY = -((i / count) * 35) + 6

        var et2 = smoothstep(clamp01(ft))
        x = prevX + (hexX - prevX) * et2
        y = prevY + (hexY - prevY) * et2
        z = prevZ + (hexZ - prevZ) * et2

        // Mouse-reactive red pulse — the viral interaction.
        var mDist = 999
        if (mouseStrength > 0) {
          var ddx = x - worldMouseX
          var ddz = z - worldMouseZ
          mDist = Math.sqrt(ddx * ddx + ddz * ddz)
        }
        var mProx = mDist < 7 ? (1 - mDist / 7) : 0

        // Color: inner ring pulses red (Klyntar core), outer rings blend cyan.
        // On mouse proximity, every particle pulses red brighter.
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

  // Reduced motion: compute once, never update
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

  // Resize
  function onResize() {
    var w = window.innerWidth
    var h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)
})()
