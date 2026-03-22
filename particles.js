/**
 * Daena Particle System
 * 10K particles morphing between fibonacci spiral, convergence, and pipe descent.
 * Zero garbage collection in the update loop. Pure math positions on Float32Array.
 */
(function () {
  'use strict'

  var isMob = window.innerWidth < 768
  var noWebGL = false
  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Particle count: 10K desktop, 2K mobile (fewer = less visual noise over text)
  var PARTICLE_COUNT = isMob ? 2000 : 10000
  var GOLDEN_ANGLE = 2.399963229728653 // 2*PI / PHI^2
  var SPIRAL_RADIUS = isMob ? 16 : 38 // Mobile: fit full spiral in narrow portrait viewport

  // Exports
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

  // Three.js setup
  var canvas = document.getElementById('bg-canvas')
  if (!canvas) return

  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200)
  // Mobile: camera higher up so the full spiral pattern is visible in portrait viewport
  camera.position.set(0, isMob ? 22 : 35, isMob ? 3 : 5)
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

  // Geometry
  var geometry = new THREE.BufferGeometry()
  var positions = new Float32Array(PARTICLE_COUNT * 3)
  var colors = new Float32Array(PARTICLE_COUNT * 3)

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  var material = new THREE.PointsMaterial({
    size: isMob ? 0.18 : 0.15,
    vertexColors: true,
    transparent: true,
    opacity: isMob ? 0.55 : 0.85, // Mobile: dimmer so gold text stays readable
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

  // HSL to RGB inline (avoids new THREE.Color per particle)
  // h in [0,1], s in [0,1], l in [0,1]
  function hsl2rgb(h, s, l, out, idx) {
    var r, g, b
    if (s === 0) {
      r = g = b = l
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s
      var p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    out[idx] = r
    out[idx + 1] = g
    out[idx + 2] = b
  }

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  // Smoothstep
  function smoothstep(t) {
    return t * t * (3 - 2 * t)
  }

  // Master update: ZERO allocations
  function updateParticles(time) {
    var sp = window.daenaParticles.scrollProgress
    var count = PARTICLE_COUNT

    for (var i = 0; i < count; i++) {
      var i3 = i * 3
      var x, y, z
      var h, s, l

      if (sp < 0.25) {
        // STATE 1: Fibonacci spiral (top-down view)
        var angle = i * GOLDEN_ANGLE + time * 0.08
        var radius = Math.sqrt(i / count) * SPIRAL_RADIUS
        x = Math.cos(angle) * radius
        z = Math.sin(angle) * radius
        y = Math.sin(i * 0.008 + time * 0.4) * 0.6

        if (isMob) {
          // Mobile: deep indigo/blue to contrast with gold hero text
          // h≈0.62-0.68 = indigo/blue range, low lightness = subtle glow
          h = 0.65 + Math.sin(i * 0.01) * 0.03
          s = 0.6
          l = 0.3 + Math.sin(i * 0.005 + time * 0.3) * 0.06
        } else {
          // Desktop: gold/amber range (text is far from particles)
          h = 0.1 + Math.sin(i * 0.01) * 0.03
          s = 0.8
          l = 0.5 + Math.sin(i * 0.005 + time * 0.3) * 0.08
        }
      } else if (sp < 0.45) {
        // STATE 2: Morph spiral to pipe
        var t = (sp - 0.25) / 0.20
        var et = smoothstep(t)

        // Spiral position
        var sAngle = i * GOLDEN_ANGLE + time * 0.08
        var sRadius = Math.sqrt(i / count) * SPIRAL_RADIUS
        var sx = Math.cos(sAngle) * sRadius
        var sz = Math.sin(sAngle) * sRadius
        var sy = Math.sin(i * 0.008 + time * 0.4) * 0.6

        // Pipe position
        var pAngle = (i * GOLDEN_ANGLE) % (Math.PI * 2) + time * 0.03
        var pRadius = (isMob ? 3 : 5) + Math.sin(i * 0.003 + time * 0.5) * 0.4
        var px = Math.cos(pAngle) * pRadius
        var pz = Math.sin(pAngle) * pRadius
        var py = -((i / count) * 35)

        x = sx + (px - sx) * et
        y = sy + (py - sy) * et
        z = sz + (pz - sz) * et

        if (isMob) {
          // Mobile: deep blue to cyan (stays in cool tones)
          h = 0.65 - t * 0.1 // indigo → cyan
          s = 0.6 + t * 0.2
          l = 0.3 + t * 0.15
        } else {
          // Desktop: gold to cyan transition
          h = 0.1 + t * 0.45
          s = 0.8
          l = 0.5 + t * 0.08
        }
      } else {
        // STATE 3: Full pipe with descent
        var pipeAngle = (i * GOLDEN_ANGLE) % (Math.PI * 2) + time * 0.02
        var pipeRadius = (isMob ? 3 : 5) + Math.sin(i * 0.005 + time * 0.8) * 0.35
        x = Math.cos(pipeAngle) * pipeRadius
        z = Math.sin(pipeAngle) * pipeRadius
        // Pipe extends downward, scroll pulls more into view
        y = -((i / count) * 50) + (sp - 0.45) * 25

        // Cyan with gold vertices (every 6th)
        var isVertex = (i % 6 === 0)
        h = isVertex ? 0.1 : 0.55
        s = 0.9
        l = isVertex ? 0.65 : 0.45
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

  // Animation loop
  var lastFrame = 0
  var frameInterval = isMob ? 33.33 : 16.67 // 30fps mobile, 60fps desktop

  function animate(now) {
    requestAnimationFrame(animate)

    // Throttle on mobile
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
