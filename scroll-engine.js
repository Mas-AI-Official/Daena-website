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

    if (isMob) {
      // Mobile: tighter camera positions matching smaller spiral/pipe radii
      // Phase 1 (0% to 20%): Above spiral looking down
      camTL.to(camera.position, { x: 0, y: 20, z: 5, duration: 15 }, 0)
      camTL.to(camera.rotation, { x: -1.3, y: 0, z: 0, duration: 15 }, 0)

      // Phase 2 (20% to 40%): Pull back, see convergence
      camTL.to(camera.position, { x: 10, y: 8, z: 10, duration: 20 }, 15)
      camTL.to(camera.rotation, { x: -0.35, y: 0.7, z: 0, duration: 20 }, 15)

      // Phase 3 (40% to 85%): Descend alongside pipe
      camTL.to(camera.position, { x: 8, y: -20, z: 8, duration: 45 }, 35)
      camTL.to(camera.rotation, { x: -0.15, y: 0.7, z: 0, duration: 45 }, 35)

      // Phase 4 (85% to 100%): Settle at bottom
      camTL.to(camera.position, { x: 6, y: -25, z: 6, duration: 20 }, 80)
      camTL.to(camera.rotation, { x: -0.1, y: 0.6, z: 0, duration: 20 }, 80)
    } else {
      // Desktop: original camera positions
      // Phase 1 (0% to 20%): Above spiral looking down
      camTL.to(camera.position, { x: 0, y: 32, z: 8, duration: 15 }, 0)
      camTL.to(camera.rotation, { x: -1.3, y: 0, z: 0, duration: 15 }, 0)

      // Phase 2 (20% to 40%): Pull back, see convergence
      camTL.to(camera.position, { x: 18, y: 12, z: 18, duration: 20 }, 15)
      camTL.to(camera.rotation, { x: -0.35, y: 0.7, z: 0, duration: 20 }, 15)

      // Phase 3 (40% to 85%): Descend alongside pipe
      camTL.to(camera.position, { x: 14, y: -28, z: 14, duration: 45 }, 35)
      camTL.to(camera.rotation, { x: -0.15, y: 0.7, z: 0, duration: 45 }, 35)

      // Phase 4 (85% to 100%): Settle at bottom
      camTL.to(camera.position, { x: 10, y: -35, z: 10, duration: 20 }, 80)
      camTL.to(camera.rotation, { x: -0.1, y: 0.6, z: 0, duration: 20 }, 80)
    }

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
