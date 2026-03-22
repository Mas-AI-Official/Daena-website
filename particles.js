/**
 * Daena Particle System v3
 * Fibonacci spiral -> Logo reveal (sprite) -> Pipe descent.
 * Logo rendered as THREE.Sprite for crisp image quality.
 * Reduced particle counts for performance.
 */
(function () {
  'use strict'

  var isMob = window.innerWidth < 768
  var noWebGL = false
  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (noMotion) return

  // Dramatically reduced counts
  var PARTICLE_COUNT = isMob ? 1200 : 4000
  var PIPE_COUNT = isMob ? 600 : 2000
  var GOLDEN_ANGLE = 2.399963229728653
  var PIPE_RADIUS = 7

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
    size: isMob ? 0.25 : 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })

  var points = new THREE.Points(geometry, material)
  points.renderOrder = 0
  scene.add(points)

  // ── Logo Sprite (actual image, not particle-formed) ──
  var logoSprite = null
  var logoAR = 1 // aspect ratio

  var textureLoader = new THREE.TextureLoader()
  textureLoader.load('/assets/img/daena-logo-gold.png', function (tex) {
    logoAR = tex.image.width / tex.image.height

    var spriteMat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: 0,
      depthWrite: false
    })
    logoSprite = new THREE.Sprite(spriteMat)
    logoSprite.renderOrder = 1
    logoSprite.visible = false
    scene.add(logoSprite)
  })

  function setLogoScale(size) {
    if (!logoSprite) return
    if (logoAR >= 1) {
      logoSprite.scale.set(size, size / logoAR, 1)
    } else {
      logoSprite.scale.set(size * logoAR, size, 1)
    }
  }

  // Export references
  window.daenaParticles.scene = scene
  window.daenaParticles.camera = camera
  window.daenaParticles.renderer = renderer
  window.daenaParticles.points = points
  window.daenaParticles.ready = true

  // ── Utilities (zero alloc) ──
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

  // ── Master update ──
  function updateParticles(time) {
    var sp = window.daenaParticles.scrollProgress
    var cam = window.daenaParticles.camera

    // ── Logo sprite state machine ──
    if (logoSprite) {
      if (sp < 0.06) {
        // Hidden during initial spiral
        logoSprite.visible = false
        logoSprite.material.opacity = 0
      } else if (sp < 0.16) {
        // FAST fade in: particles converge, logo appears
        logoSprite.visible = true
        var lt = smoothstep((sp - 0.06) / 0.10)
        logoSprite.material.opacity = lt * 0.95
        var scale = 28 - lt * 8 // 28 -> 20
        setLogoScale(scale)
        logoSprite.position.set(0, 0, 0)
      } else if (sp < 0.32) {
        // Logo shrinks to pipe-interior size
        logoSprite.visible = true
        var lt = smoothstep((sp - 0.16) / 0.16)
        var scale = 20 * (1 - lt) + 10 * lt
        setLogoScale(scale)
        logoSprite.material.opacity = 0.9
        logoSprite.position.set(0, 0, 0)
      } else {
        // Logo follows camera during pipe descent
        logoSprite.visible = true
        var camY = cam ? cam.position.y - 5 : 0
        logoSprite.position.set(0, camY, 0)
        setLogoScale(10)
        logoSprite.material.opacity = 0.85
      }
    }

    // ── Particle updates ──
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var i3 = i * 3
      var x, y, z
      var h, s, l

      // Base spiral position
      var sAngle = i * GOLDEN_ANGLE + time * 0.08
      var sRadius = Math.sqrt(i / PARTICLE_COUNT) * 38
      var sx = Math.cos(sAngle) * sRadius
      var sz2 = Math.sin(sAngle) * sRadius
      var sy = Math.sin(i * 0.008 + time * 0.4) * 0.6

      if (sp < 0.06) {
        // ═══ STATE 1: Fibonacci spiral ═══
        x = sx
        z = sz2
        y = sy

        h = 0.1 + Math.sin(i * 0.01) * 0.03
        s = 0.85
        l = 0.5 + Math.sin(i * 0.005 + time * 0.3) * 0.1

      } else if (sp < 0.16) {
        // ═══ STATE 2: Converge to center (logo image fades in) ═══
        var t = (sp - 0.06) / 0.10
        var et = smoothstep(t)

        // All particles pull inward and dim
        var pullR = sRadius * (1 - et * 0.85)
        x = Math.cos(sAngle) * pullR
        z = Math.sin(sAngle) * pullR
        y = sy * (1 - et)

        h = 0.1 + et * 0.02
        s = 0.8 - et * 0.3
        l = 0.5 - et * 0.35

      } else if (sp < 0.32) {
        // ═══ STATE 3: Pipe formation, extra particles fade ═══
        var t = (sp - 0.16) / 0.16
        var et = smoothstep(t)

        if (i < PIPE_COUNT) {
          // Transition from converged center to pipe cylinder
          var pAngle = (i * GOLDEN_ANGLE) % (Math.PI * 2) + time * 0.02
          var pRadius = PIPE_RADIUS + Math.sin(i * 0.005 + time * 0.5) * 0.3
          var px = Math.cos(pAngle) * pRadius
          var pz = Math.sin(pAngle) * pRadius
          var py = -((i / PIPE_COUNT) * 55) + 18

          // From converged center
          var cR = sRadius * 0.15
          var cx = Math.cos(sAngle) * cR
          var cz = Math.sin(sAngle) * cR

          x = cx + (px - cx) * et
          z = cz + (pz - cz) * et
          y = sy * 0.1 * (1 - et) + py * et

          h = 0.1 + et * 0.45
          s = 0.65
          l = 0.15 + et * 0.08
        } else {
          // Extra particles dissolve
          var fadeR = sRadius * 0.15 * (1 - et)
          x = Math.cos(sAngle) * fadeR
          z = Math.sin(sAngle) * fadeR
          y = 0

          h = 0.1
          s = 0.5
          l = 0.15 * (1 - et)
        }

      } else {
        // ═══ STATE 4: Pipe descent ═══
        if (i < PIPE_COUNT) {
          var pAngle = (i * GOLDEN_ANGLE) % (Math.PI * 2) + time * 0.02
          var pRadius = PIPE_RADIUS + Math.sin(i * 0.005 + time * 0.8) * 0.3
          x = Math.cos(pAngle) * pRadius
          z = Math.sin(pAngle) * pRadius
          y = -((i / PIPE_COUNT) * 55) + 18

          // Very dim: cyan with sparse gold accents
          var isGold = (i % 18 === 0)
          h = isGold ? 0.1 : 0.55
          s = 0.65
          l = isGold ? 0.3 : 0.15
        } else {
          // Hidden off-screen
          x = 0
          y = -999
          z = 0
          h = 0
          s = 0
          l = 0
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

  // Resize handler
  function onResize() {
    var w = window.innerWidth
    var h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)
})()
