/**
 * Scroll Engine: GSAP ScrollTrigger driving particle morph, camera, and content panels.
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

    // Camera timeline: scrub with scroll
    var camTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-content',
        start: 'top top',
        end: 'bottom bottom',
        scrub: isMob ? 1.5 : 3
      }
    })

    // Phase 1 (0% to 28%): Above spiral + logo formation, looking down
    camTL.to(camera.position, { x: 0, y: 30, z: 10, duration: 28 }, 0)
    camTL.to(camera.rotation, { x: -1.2, y: 0, z: 0, duration: 28 }, 0)

    // Phase 2 (28% to 48%): Pull back, see logo shrink + pipe forming
    camTL.to(camera.position, { x: 16, y: 14, z: 16, duration: 20 }, 28)
    camTL.to(camera.rotation, { x: -0.4, y: 0.6, z: 0, duration: 20 }, 28)

    // Phase 3 (48% to 85%): Descend alongside pipe, logo in center
    camTL.to(camera.position, { x: 14, y: -28, z: 14, duration: 37 }, 48)
    camTL.to(camera.rotation, { x: -0.15, y: 0.7, z: 0, duration: 37 }, 48)

    // Phase 4 (85% to 100%): Settle at bottom
    camTL.to(camera.position, { x: 10, y: -35, z: 10, duration: 15 }, 85)
    camTL.to(camera.rotation, { x: -0.1, y: 0.6, z: 0, duration: 15 }, 85)

    // Content panel swing animations
    if (!isMob) {
      document.querySelectorAll('.swing-right').forEach(function (panel) {
        var section = panel.closest('.step')
        if (!section) return

        // Enter from right
        gsap.fromTo(panel,
          { x: '100%', rotateY: -12, opacity: 0 },
          {
            x: '0%', rotateY: 0, opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 1.5
            }
          }
        )

        // Exit to left
        gsap.to(panel, {
          x: '-100%', rotateY: 12, opacity: 0,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: section,
            start: 'bottom 60%',
            end: 'bottom 10%',
            scrub: 1.5
          }
        })
      })
    } else {
      // Mobile: simple fade-up, no 3D swing
      document.querySelectorAll('.swing-right').forEach(function (panel) {
        var section = panel.closest('.step')
        if (!section) return

        gsap.fromTo(panel,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1
            }
          }
        )
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
