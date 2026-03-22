/**
 * Daena Particle System v4
 * Fibonacci spiral → Particles converge to form logo → Pipe descent with logo center.
 * Logo sampled from image using brightness threshold (handles opaque backgrounds).
 * Particles physically form the logo shape — no sprite overlay.
 */
(function () {
  'use strict'

  var isMob = window.innerWidth < 768
  var noWebGL = false
  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (noMotion) return

  // More logo particles for crisp formation, fewer pipe for visibility
  var LOGO_COUNT = isMob ? 1000 : 3500
  var PIPE_COUNT = isMob ? 500 : 1500
  var PARTICLE_COUNT = LOGO_COUNT + PIPE_COUNT
  var GOLDEN_ANGLE = 2.399963229728653

  // Logo scale: big during formation (camera above), small inside pipe
  var LOGO_SCALE_BIG = 26
  var LOGO_SCALE_SMALL = 8
  var PIPE_RADIUS = 8

  window.daenaParticles = {
    scrollProgress: 0,
    scene: null,
    camera: null,
    renderer: null,
    points: null,
    ready: false
  }

  // WebGL check
  try {
    var testCanvas = document.createElement('canvas')
    var gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
    if (!gl) noWebGL = true
  } catch (e) {
    noWebGL = true
  }

  if (noWebGL) {
    document.body.classList.add('no-webgl')
    return
  }

  var canvas = document.getElementById('bg-canvas')
  if (!canvas) return

  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200)
  camera.position.set(0, 35, 5)
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

  // Particle geometry
  var geometry = new THREE.BufferGeometry()
  var positions = new Float32Array(PARTICLE_COUNT * 3)
  var colors = new Float32Array(PARTICLE_COUNT * 3)

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  var material = new THREE.PointsMaterial({
    size: isMob ? 0.28 : 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })

  var points = new THREE.Points(geometry, material)
  scene.add(points)

  // Export references
  window.daenaParticles.scene = scene
  window.daenaParticles.camera = camera
  window.daenaParticles.renderer = renderer
  window.daenaParticles.points = points
  window.daenaParticles.ready = true

  // ── Logo image sampling (brightness-based) ──
  // Normalized targets [-0.5, 0.5], scaled at render time
  var logoNX = new Float32Array(LOGO_COUNT)
  var logoNZ = new Float32Array(LOGO_COUNT)
  var logoReady = false

  var logoImg = new Image()
  logoImg.onload = function () {
    var sz = isMob ? 120 : 180 // higher resolution = denser sampling
    var lc = document.createElement('canvas')
    lc.width = sz; lc.height = sz
    var ctx = lc.getContext('2d')
    ctx.drawImage(logoImg, 0, 0, sz, sz)
    var data = ctx.getImageData(0, 0, sz, sz).data

    // Collect positions where pixel is BRIGHT (not dark background)
    var cands = []
    for (var py = 0; py < sz; py++) {
      for (var px = 0; px < sz; px++) {
        var idx = (py * sz + px) * 4
        var r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3]
        var brightness = (r + g + b) / 3

        // Use brightness threshold: catches gold logo parts, ignores dark bg
        // Also check alpha for PNGs with proper transparency
        if ((brightness > 60 && a > 80) || a > 200 && brightness > 30) {
          cands.push(px / sz - 0.5, -(py / sz - 0.5)) // x, z (flip Y)
        }
      }
    }
    var numCands = cands.length / 2

    // If too many candidates (opaque bg), raise brightness threshold
    if (numCands > sz * sz * 0.7) {
      cands = []
      for (var py = 0; py < sz; py++) {
        for (var px = 0; px < sz; px++) {
          var idx = (py * sz + px) * 4
          var r = data[idx], g = data[idx + 1], b = data[idx + 2]
          var brightness = (r + g + b) / 3
          if (brightness > 100) {
            cands.push(px / sz - 0.5, -(py / sz - 0.5))
          }
        }
      }
      numCands = cands.length / 2
    }

    // Fisher-Yates shuffle pairs
    for (var i = numCands - 1; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0
      var t0 = cands[i * 2], t1 = cands[i * 2 + 1]
      cands[i * 2] = cands[j * 2]; cands[i * 2 + 1] = cands[j * 2 + 1]
      cands[j * 2] = t0; cands[j * 2 + 1] = t1
    }

    // Assign to logo particles with tight jitter
    for (var i = 0; i < LOGO_COUNT; i++) {
      var ci = (i % numCands) * 2
      logoNX[i] = cands[ci] + (Math.random() - 0.5) * 0.004
      logoNZ[i] = cands[ci + 1] + (Math.random() - 0.5) * 0.004
    }
    logoReady = true
  }
  logoImg.src = '/assets/img/daena-logo-gold.png'

  // ── Utilities (inline, zero alloc) ──
  function hsl2rgb(h, s, l, out, idx) {
    var r, g, b
    if (s === 0) {
      r = g = b = l
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s
      var p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }
    out[idx] = r
    out[idx + 1] = g
    out[idx + 2] = b
  }

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t)
  }

  // ── Master update: zero allocations ──
  function updateParticles(time) {
    var sp = window.daenaParticles.scrollProgress
    var cam = window.daenaParticles.camera

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var i3 = i * 3
      var isLogo = (i < LOGO_COUNT)
      var x, y, z
      var h, s, l

      // Base spiral position
      var sAngle = i * GOLDEN_ANGLE + time * 0.08
      var sRadius = Math.sqrt(i / PARTICLE_COUNT) * 38
      var sx = Math.cos(sAngle) * sRadius
      var sz2 = Math.sin(sAngle) * sRadius
      var sy = Math.sin(i * 0.008 + time * 0.4) * 0.6

      if (sp < 0.08) {
        // ═══ STATE 1: Fibonacci spiral (all particles) ═══
        x = sx
        z = sz2
        y = sy

        h = 0.1 + Math.sin(i * 0.01) * 0.03
        s = 0.85
        l = 0.5 + Math.sin(i * 0.005 + time * 0.3) * 0.1

      } else if (sp < 0.20) {
        // ═══ STATE 2: Logo particles morph to logo shape ═══
        // Fast transition: 8% to 20% scroll
        var t = (sp - 0.08) / 0.12
        var et = smoothstep(t)

        if (isLogo && logoReady) {
          // Morph from spiral position to logo position (big scale, XZ plane)
          var lx = logoNX[i] * LOGO_SCALE_BIG
          var lz = logoNZ[i] * LOGO_SCALE_BIG

          x = sx + (lx - sx) * et
          z = sz2 + (lz - sz2) * et
          y = sy * (1 - et)

          // Gold → bright white-gold as they form logo
          h = 0.1
          s = 0.9 - et * 0.2
          l = 0.5 + et * 0.35
        } else {
          // Background particles disperse outward and dim
          var dRadius = sRadius * (1 + et * 2.0)
          x = Math.cos(sAngle) * dRadius
          z = Math.sin(sAngle) * dRadius
          y = sy + et * Math.sin(i * 0.07) * 5

          h = 0.1 + et * 0.45
          s = 0.6
          l = 0.4 - et * 0.3
        }

      } else if (sp < 0.35) {
        // ═══ STATE 3: Logo shrinks, pipe forms ═══
        var t = (sp - 0.20) / 0.15
        var et = smoothstep(t)

        if (isLogo && logoReady) {
          // Logo shrinks from big to small (pipe interior scale)
          var logoScale = LOGO_SCALE_BIG * (1 - et) + LOGO_SCALE_SMALL * et
          // Gentle float during shrink
          var fx = Math.sin(time * 0.3 + i * 0.09) * 0.15 * et
          var fz = Math.cos(time * 0.25 + i * 0.07) * 0.15 * et

          x = logoNX[i] * logoScale + fx
          z = logoNZ[i] * logoScale + fz
          y = Math.sin(time * 0.5 + i * 0.04) * 0.1 * et

          // Bright gold with gentle pulse
          h = 0.1
          s = 0.85
          l = 0.8 + Math.sin(time * 0.8 + i * 0.02) * 0.05
        } else {
          // Background → pipe formation
          var bgIdx = i - LOGO_COUNT
          var pAngle = (bgIdx * GOLDEN_ANGLE) % (Math.PI * 2) + time * 0.02
          var pRadius = PIPE_RADIUS + Math.sin(bgIdx * 0.005 + time * 0.5) * 0.3
          var px = Math.cos(pAngle) * pRadius
          var pz = Math.sin(pAngle) * pRadius
          var py = -((bgIdx / PIPE_COUNT) * 55) + 18

          // Dispersed source position
          var dAngle = i * GOLDEN_ANGLE
          var dRadius2 = Math.sqrt(i / PARTICLE_COUNT) * 38 * 2.8
          var dx = Math.cos(dAngle) * dRadius2
          var dz = Math.sin(dAngle) * dRadius2
          var dy = Math.sin(i * 0.07) * 5

          x = dx + (px - dx) * et
          z = dz + (pz - dz) * et
          y = dy + (py - dy) * et

          // Dim cyan
          h = 0.55
          s = 0.6
          l = 0.15 + et * 0.08
        }

      } else {
        // ═══ STATE 4: Pipe descent with logo in center ═══
        if (isLogo && logoReady) {
          // Logo stays at camera Y, centered, gentle float
          var camY = cam ? cam.position.y - 5 : 0
          var fx = Math.sin(time * 0.2 + i * 0.07) * 0.1
          var fz = Math.cos(time * 0.15 + i * 0.05) * 0.1

          x = logoNX[i] * LOGO_SCALE_SMALL + fx
          z = logoNZ[i] * LOGO_SCALE_SMALL + fz
          y = camY + Math.sin(time * 0.4 + i * 0.02) * 0.08

          // Bright gold pulse
          h = 0.1
          s = 0.9
          l = 0.75 + Math.sin(time * 1.2 + i * 0.01) * 0.07
        } else {
          // Pipe descent
          var bgIdx = i - LOGO_COUNT
          var pAngle = (bgIdx * GOLDEN_ANGLE) % (Math.PI * 2) + time * 0.02
          var pRadius = PIPE_RADIUS + Math.sin(bgIdx * 0.005 + time * 0.8) * 0.3
          x = Math.cos(pAngle) * pRadius
          z = Math.sin(pAngle) * pRadius
          y = -((bgIdx / PIPE_COUNT) * 55) + 18

          // Very dim cyan with sparse gold accents
          var isGold = (bgIdx % 20 === 0)
          h = isGold ? 0.1 : 0.55
          s = 0.6
          l = isGold ? 0.3 : 0.12
        }
      }

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z

      hsl2rgb(h, s, l, colors, i3)
    }

    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate = true
  }

  // Animation loop with frame throttling
  var lastFrame = 0
  var frameInterval = isMob ? 33.33 : 16.67

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
