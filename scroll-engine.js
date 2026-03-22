/**
 * Scroll Engine: GSAP ScrollTrigger driving camera and content panels.
 * Unified panel timelines prevent stuck/mispositioned panels on reverse scroll.
 */
(function () {
  'use strict'

  var isMob = window.innerWidth < 768
  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (noMotion) return

  gsap.registerPlugin(ScrollTrigger)

  // Wait for particle system to be ready
  function waitForParticles(cb) {
    if (window.daenaParticles && window.daenaParticles.ready) { cb(); return }
    var checks = 0
    var interval = setInterval(function () {
      checks++
      if ((window.daenaParticles && window.daenaParticles.ready) || checks > 100) {
        clearInterval(interval)
        cb()
      }
    }, 50)
  }

  waitForParticles(function () {
    var dp = window.daenaParticles
    if (!dp || !dp.camera) return
    var camera = dp.camera

    // Master scroll progress: drives particle morph states
    ScrollTrigger.create({
      trigger: '#scroll-content',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: function (self) {
        dp.scrollProgress = self.progress
      }
    })

    // Camera timeline (faster phases matching v3 particle states)
    var camTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-content',
        start: 'top top',
        end: 'bottom bottom',
        scrub: isMob ? 1.5 : 2.5
      }
    })

    // Phase 1 (0% to 16%): Above spiral + logo reveal, looking down
    camTL.to(camera.position, { x: 0, y: 30, z: 10, duration: 16 }, 0)
    camTL.to(camera.rotation, { x: -1.2, y: 0, z: 0, duration: 16 }, 0)

    // Phase 2 (16% to 35%): Pull back, see logo + pipe forming
    camTL.to(camera.position, { x: 16, y: 14, z: 16, duration: 19 }, 16)
    camTL.to(camera.rotation, { x: -0.4, y: 0.6, z: 0, duration: 19 }, 16)

    // Phase 3 (35% to 85%): Descend alongside pipe, logo in center
    camTL.to(camera.position, { x: 14, y: -28, z: 14, duration: 50 }, 35)
    camTL.to(camera.rotation, { x: -0.15, y: 0.7, z: 0, duration: 50 }, 35)

    // Phase 4 (85% to 100%): Settle at bottom
    camTL.to(camera.position, { x: 10, y: -35, z: 10, duration: 15 }, 85)
    camTL.to(camera.rotation, { x: -0.1, y: 0.6, z: 0, duration: 15 }, 85)

    // ── Content panels: unified timeline per panel ──
    // Single timeline (enter + hold + exit) prevents stuck panels on reverse scroll
    if (!isMob) {
      document.querySelectorAll('.swing-right').forEach(function (panel) {
        var section = panel.closest('.step')
        if (!section) return

        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.5
          }
        })

        // Enter (first 30%)
        tl.fromTo(panel,
          { x: '100%', rotateY: -12, opacity: 0 },
          { x: '0%', rotateY: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
        // Hold visible (middle 40%)
        tl.to(panel, { x: '0%', opacity: 1, duration: 0.4 })
        // Exit (last 30%)
        tl.to(panel, { x: '-100%', rotateY: 12, opacity: 0, duration: 0.3, ease: 'power2.in' })
      })
    } else {
      // Mobile: simple fade-up with unified timeline
      document.querySelectorAll('.swing-right').forEach(function (panel) {
        var section = panel.closest('.step')
        if (!section) return

        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'bottom 30%',
            scrub: 1
          }
        })

        tl.fromTo(panel,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        )
        tl.to(panel, { y: 0, opacity: 1, duration: 0.4 })
        tl.to(panel, { y: -30, opacity: 0, duration: 0.2 })
      })
    }

    // Scroll progress bar
    var scrollBar = document.getElementById('scrollBar')
    if (scrollBar) {
      window.addEventListener('scroll', function () {
        var t = window.pageYOffset
        var h = document.documentElement.scrollHeight - window.innerHeight
        var p = h > 0 ? t / h : 0
        scrollBar.style.transform = 'scaleX(' + p + ')'
      }, { passive: true })
    }
  })
})()
