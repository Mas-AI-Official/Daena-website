/* =========================================================================
 * Daena Living Aurora Mesh
 * -------------------------------------------------------------------------
 * Replaces the prior "4-act hex narrative" background with a calmer,
 * atmosphere-first visual drawn from the design languages that shipped on
 * Linear, Vercel, Framer, Stripe and Claude.com in 2025-2026.
 *
 * Design methods applied (the three that survived my top-5 shortlist):
 *   1. Gradient Mesh  — Linear / Vercel / Framer. A handful of large soft
 *      orbs with 'lighter' compositing. No story to decode; just mood.
 *   2. Peak-end Crescendo — Stripe / Apple. Cyan governance palette up top
 *      (calm, competent), gold proof/trust in the middle, red Klyntar peak
 *      during the security section, cyan+gold resolution at the bottom.
 *   3. Cursor Soft Spotlight — Claude.com / Arc. Low-opacity white halo
 *      that follows the cursor; peripheral awareness, not a reaction game.
 *
 * Psychology this is tuned for:
 *   - Miller's chunk limit -> only 6 moving anchors + 60 static dots.
 *   - Cognitive calm       -> max orb alpha ~0.28 (never demands the eye).
 *   - Peak-end rule        -> reds surge 55-80% of scroll, then release.
 *   - Peripheral motion    -> drift speeds kept under 0.3 px/frame.
 *
 * Cost: single Canvas 2D context, ~6 radial gradients + 60 arc fills per
 * frame @ 30 fps throttle. No Three.js, no shaders, no WebGL requirement.
 * ========================================================================= */

(function () {
    'use strict';

    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // --- Aurora orbs -----------------------------------------------------
    // Role: 0 = cyan (governance), 1 = gold (trust), 2 = red (Klyntar).
    // bx / by are viewport-relative home positions; each orb drifts on a
    // slow sine around that home via its own phase offset.
    var orbs = [
        { bx: 0.15, by: 0.22, phase: 0.0, r: 240, role: 0 },
        { bx: 0.82, by: 0.30, phase: 1.3, r: 300, role: 1 },
        { bx: 0.35, by: 0.78, phase: 2.7, r: 260, role: 0 },
        { bx: 0.72, by: 0.82, phase: 3.9, r: 220, role: 2 },
        { bx: 0.55, by: 0.12, phase: 4.5, r: 200, role: 1 },
        { bx: 0.06, by: 0.60, phase: 5.2, r: 260, role: 0 }
    ];

    function colorFor(role) {
        if (role === 0) return [0,   200, 255];  // cyan   - Daena governance
        if (role === 1) return [212, 168, 83];   // gold   - trust / proof
        return              [255, 64,  96];      // red    - Klyntar security
    }

    // Weight of each role at a given scroll fraction (0..1).
    // Curves are tuned so that:
    //   - cyan (governance) is present everywhere but recedes past the middle
    //   - gold (trust) peaks at the Proof Wall (~40-50%)
    //   - red (Klyntar) surges hard in the 55-80% band, then tapers for the
    //     closing CTA (peak-end rule)
    function weightAt(role, s) {
        if (role === 0) return Math.max(0.30, 1 - s * 0.42);
        if (role === 1) return Math.max(0.22, 1 - Math.abs(s - 0.45) * 1.4);
        // Red: smooth gaussian-ish peak centered around 0.65 scroll
        var redCenter = 0.65, redSpread = 0.22;
        var redBell = Math.exp(-Math.pow((s - redCenter) / redSpread, 2));
        return Math.max(0.10, redBell * 1.25);
    }

    // --- Dot field (depth) ----------------------------------------------
    var DOTS = 60;
    var dots = [];
    for (var i = 0; i < DOTS; i++) {
        dots.push({
            x: Math.random(),
            y: Math.random(),
            r: 0.6 + Math.random() * 1.2,
            phase: Math.random() * 6.28
        });
    }

    // --- Light streaks (subtle motion trails, adds kinetic depth) --------
    var STREAKS = 4;
    var streaks = [];
    for (var si = 0; si < STREAKS; si++) {
        streaks.push({
            y: Math.random(),
            speed: 0.00002 + Math.random() * 0.00005, // pixels-per-ms per viewport width
            phase: Math.random() * 1000,
            len: 0.18 + Math.random() * 0.18,  // length as fraction of W
            hue: si % 2                          // 0 = cyan-ish, 1 = gold-ish
        });
    }

    // --- Cursor spotlight -----------------------------------------------
    var mx = -9999, my = -9999, ma = 0;
    window.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
    }, { passive: true });
    window.addEventListener('mouseleave', function () {
        mx = -9999; my = -9999;
    }, { passive: true });

    // --- Scroll fraction ------------------------------------------------
    var scrollPct = 0;
    function updateScroll() {
        var h = document.documentElement;
        scrollPct = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    }
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    // --- Draw -----------------------------------------------------------
    var lastT = 0;
    var MIN_FRAME_MS = 33; // ~30 fps throttle

    function draw(ts) {
        var t = ts * 0.00012;

        // 1. Base fill - dark navy (NOT pure black; lighter-blend needs a seed).
        ctx.fillStyle = '#070b18';
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // 2. Dot depth layer
        for (var i = 0; i < DOTS; i++) {
            var d = dots[i];
            var twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 3.2 + d.phase));
            ctx.beginPath();
            ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(170, 200, 255, ' + (0.04 * twinkle).toFixed(3) + ')';
            ctx.fill();
        }

        // 3. Aurora orbs (radial gradients)
        for (var o = 0; o < orbs.length; o++) {
            var orb = orbs[o];
            var driftX = Math.sin(t * 0.8 + orb.phase)       * 0.07;
            var driftY = Math.cos(t * 0.7 + orb.phase * 1.3) * 0.055;
            var x = (orb.bx + driftX) * W;
            var y = (orb.by + driftY) * H;
            var r = orb.r * (0.92 + 0.08 * Math.sin(t * 1.5 + orb.phase));

            var w = weightAt(orb.role, scrollPct);
            var col = colorFor(orb.role);
            var a = 0.26 * w;

            var g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0,    'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + a.toFixed(3) + ')');
            g.addColorStop(0.45, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (a * 0.35).toFixed(3) + ')');
            g.addColorStop(1,    'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3.5. Light streaks — slow-moving horizontal trails for kinetic depth
        for (var sj = 0; sj < STREAKS; sj++) {
            var sk = streaks[sj];
            var px = ((ts * sk.speed) + sk.phase) % 1;
            var cx = px * W;
            var cy = sk.y * H + Math.sin(ts * 0.0003 + sj) * 12;
            var sLen = sk.len * W;
            var sCol = sk.hue === 0 ? '0,200,255' : '212,168,83';
            var sAlpha = 0.07;
            var lg = ctx.createLinearGradient(cx - sLen, cy, cx, cy);
            lg.addColorStop(0,   'rgba(' + sCol + ',0)');
            lg.addColorStop(0.8, 'rgba(' + sCol + ',' + sAlpha + ')');
            lg.addColorStop(1,   'rgba(' + sCol + ',0)');
            ctx.fillStyle = lg;
            ctx.fillRect(cx - sLen, cy - 1, sLen, 2);
        }

        // 4. Cursor spotlight (peripheral awareness, not a reaction game)
        if (mx > -100) {
            ma += (1 - ma) * 0.08;
            var mr = 200;
            var mAlpha = 0.12 * ma;
            var mc = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
            mc.addColorStop(0,   'rgba(255,255,255,' + mAlpha.toFixed(3) + ')');
            mc.addColorStop(0.5, 'rgba(255,255,255,' + (mAlpha * 0.3).toFixed(3) + ')');
            mc.addColorStop(1,   'rgba(255,255,255,0)');
            ctx.fillStyle = mc;
            ctx.beginPath();
            ctx.arc(mx, my, mr, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ma += (0 - ma) * 0.08;
        }

        ctx.restore();

        // 5. Corner vignette - grounds edges, keeps focus on centered content.
        var vg = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.78);
        vg.addColorStop(0, 'rgba(0,0,0,0)');
        vg.addColorStop(1, 'rgba(0,0,0,0.45)');
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);
    }

    function loop(ts) {
        if (ts - lastT >= MIN_FRAME_MS) {
            lastT = ts;
            draw(ts);
        }
        requestAnimationFrame(loop);
    }

    if (reduced) {
        draw(0);
    } else {
        requestAnimationFrame(loop);
    }
})();
