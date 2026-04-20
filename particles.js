/* =========================================================================
 * Daena Background Story Engine v3
 * -------------------------------------------------------------------------
 * Scene-aware scroll-coupled background. Each section on the page has a
 * data-scene attribute ("awakening", "origin", "question", "answer",
 * "zen", "chaos", "pipeline", "trust", "proof", "lattice", "spiral",
 * "split", "fortress", "calm", "focus", "warm"). As the user scrolls,
 * an IntersectionObserver identifies the currently-visible section and
 * tells the canvas which scene to render. The canvas smoothly blends
 * between scenes instead of cutting — so the background tells a
 * continuous story alongside the content.
 *
 * Design methods (from 2026 scroll-storytelling research):
 *   1. Gradient Mesh base (Linear / Vercel / Framer) — 6 soft orbs
 *      drifting on slow sine waves with 'lighter' compositing.
 *   2. Scene-specific overlays — Fibonacci spiral for origin, fortress
 *      honeycomb for Klyntar, red threat wave for chaos. Each scene
 *      adds one layer on top of the gradient mesh.
 *   3. Cursor-reactive micro-interactions — mouse movement creates a
 *      soft halo, and in "fortress" / "chaos" scenes, defensive pulses.
 *
 * Psychology:
 *   - Peripheral motion < 0.3 px/frame
 *   - Max orb alpha ~0.28 (never demands the eye)
 *   - Miller's limit: 6 orbs + 60 dots + one scene overlay
 *   - Scene transitions ease over ~1 second (no hard cuts)
 *
 * Cost: Canvas 2D only. No Three.js, no WebGL. ~30fps throttle.
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

    // --- Scene definitions ----------------------------------------------
    // Each scene tunes the orb palette + adds a scene-specific overlay.
    //   palette: { cyan, gold, red } weights summing loosely to 1.
    //   overlay: function(ctx, t, W, H, scenePct, mouseState) -> draws extra layer
    // Scene blending: a `sceneBlend` lerps from old to new scene over ~1s.
    var SCENES = {
        // Default / hero: calm cyan dominant
        awakening: { cyan: 0.8, gold: 0.4, red: 0.0, streaks: 2, overlay: null },
        // Prologue beats: spiral convergence, gold ascending
        origin:    { cyan: 0.6, gold: 0.5, red: 0.0, streaks: 3, overlay: 'spiralFormation' },
        question:  { cyan: 0.4, gold: 0.8, red: 0.0, streaks: 4, overlay: 'spiralFormation' },
        answer:    { cyan: 0.6, gold: 0.7, red: 0.3, streaks: 3, overlay: 'spiralFormation' },
        // Manifesto: zen, still
        zen:       { cyan: 0.5, gold: 0.6, red: 0.0, streaks: 1, overlay: null },
        // Problem: red chaos, erratic
        chaos:     { cyan: 0.2, gold: 0.3, red: 0.7, streaks: 6, overlay: 'warningPulse' },
        // Solution/governance: gold pipeline, ordered
        pipeline:  { cyan: 0.5, gold: 0.9, red: 0.1, streaks: 2, overlay: 'pipelineFlow' },
        // Proof / Stats / Results: trust gold, stable
        trust:     { cyan: 0.4, gold: 1.0, red: 0.1, streaks: 2, overlay: null },
        proof:     { cyan: 0.4, gold: 1.0, red: 0.1, streaks: 2, overlay: null },
        // Features bento: honeycomb of departments
        lattice:   { cyan: 0.7, gold: 0.7, red: 0.1, streaks: 2, overlay: 'hexLattice' },
        // Architecture: Fibonacci spiral full
        spiral:    { cyan: 0.6, gold: 0.9, red: 0.1, streaks: 2, overlay: 'fiboSpiral' },
        // Why: split theme
        split:     { cyan: 0.6, gold: 0.3, red: 0.6, streaks: 3, overlay: null },
        // Klyntar peak: red fortress + threat wave + mouse-reactive pulses
        fortress:  { cyan: 0.1, gold: 0.2, red: 1.0, streaks: 4, overlay: 'klyntarFortress' },
        // Demos / Contact: calm resolution
        calm:      { cyan: 0.7, gold: 0.5, red: 0.1, streaks: 2, overlay: null },
        // Request: focus, intent
        focus:     { cyan: 0.5, gold: 0.8, red: 0.1, streaks: 1, overlay: null },
        // Creator: warm gold
        warm:      { cyan: 0.3, gold: 1.0, red: 0.1, streaks: 2, overlay: null }
    };

    // Current scene (blended)
    var currentScene = SCENES.awakening;
    var targetSceneName = 'awakening';
    var sceneBlend = { cyan: 0.8, gold: 0.4, red: 0.0, streaks: 2 };

    // --- Observe sections and pick the active scene ---------------------
    function updateActiveScene() {
        var best = null, bestArea = 0;
        var sections = document.querySelectorAll('[data-scene]');
        var vH = window.innerHeight;
        for (var i = 0; i < sections.length; i++) {
            var rect = sections[i].getBoundingClientRect();
            // Measure how much of the viewport this section covers
            var visible = Math.min(rect.bottom, vH) - Math.max(rect.top, 0);
            if (visible > bestArea) {
                bestArea = visible;
                best = sections[i];
            }
        }
        if (best) {
            var sc = best.dataset.scene || 'awakening';
            if (SCENES[sc]) targetSceneName = sc;
        }
    }
    updateActiveScene();
    window.addEventListener('scroll', updateActiveScene, { passive: true });
    window.addEventListener('resize', updateActiveScene);

    // --- Aurora orbs (shared base across all scenes) ---------------------
    var orbs = [
        { bx: 0.15, by: 0.22, phase: 0.0, r: 240, role: 0 },
        { bx: 0.82, by: 0.30, phase: 1.3, r: 300, role: 1 },
        { bx: 0.35, by: 0.78, phase: 2.7, r: 260, role: 0 },
        { bx: 0.72, by: 0.82, phase: 3.9, r: 220, role: 2 },
        { bx: 0.55, by: 0.12, phase: 4.5, r: 200, role: 1 },
        { bx: 0.06, by: 0.60, phase: 5.2, r: 260, role: 0 }
    ];

    function colorFor(role) {
        if (role === 0) return [0,   200, 255];
        if (role === 1) return [212, 168, 83];
        return              [255, 64,  96];
    }

    // --- Dot field ------------------------------------------------------
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

    // --- Light streaks --------------------------------------------------
    var streaks = [];
    for (var si = 0; si < 6; si++) {
        streaks.push({
            y: Math.random(),
            speed: 0.00002 + Math.random() * 0.00005,
            phase: Math.random() * 1000,
            len: 0.18 + Math.random() * 0.18,
            hue: si % 3
        });
    }

    // --- Cursor state (for fortress mouse-reactive pulses) --------------
    var mx = -9999, my = -9999, ma = 0;
    var mouseTrail = []; // for fortress scene pulses
    window.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        // Sample a pulse every ~200ms for fortress scene
        if (currentScene === SCENES.fortress || sceneBlend.red > 0.6) {
            var now = performance.now();
            if (!mouseTrail.length || now - mouseTrail[mouseTrail.length-1].t > 150) {
                mouseTrail.push({ x: mx, y: my, t: now, r: 0 });
                if (mouseTrail.length > 6) mouseTrail.shift();
            }
        }
    }, { passive: true });
    window.addEventListener('mouseleave', function () { mx = -9999; my = -9999; }, { passive: true });

    // --- Scroll fraction (for global peak-end crescendo) ----------------
    var scrollPct = 0;
    function updateScroll() {
        var h = document.documentElement;
        scrollPct = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    }
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    // --- Scene overlays -------------------------------------------------
    // Each returns how strong to draw (0..1) using sceneBlend.

    // 1. Fibonacci spiral. Used in origin/question/answer and spiral scenes.
    var PHI = (1 + Math.sqrt(5)) / 2;
    var GOLDEN_ANGLE = 2 * Math.PI / (PHI * PHI); // ~137.5 deg
    function drawSpiral(strength, t, rotSpeed) {
        if (strength < 0.02) return;
        ctx.save();
        var cx = W / 2, cy = H / 2;
        ctx.translate(cx, cy);
        ctx.rotate(t * (rotSpeed || 0.05));
        var count = 60;
        var spread = Math.min(W, H) * 0.015;
        for (var k = 0; k < count; k++) {
            var angle = k * GOLDEN_ANGLE;
            var rr = Math.sqrt(k) * spread * (0.8 + 0.3 * Math.sin(t * 0.5 + k * 0.1));
            var x = Math.cos(angle) * rr;
            var y = Math.sin(angle) * rr;
            var rad = 1.4 + (k / count) * 2;
            ctx.beginPath();
            ctx.arc(x, y, rad, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212,168,83,' + (strength * 0.45 * (1 - k/count)).toFixed(3) + ')';
            ctx.fill();
        }
        ctx.restore();
    }

    // 2. Hex lattice. Used in lattice / fortress scenes.
    function drawHexLattice(strength, t, warmth) {
        if (strength < 0.02) return;
        var cellR = 50;
        var hSpace = cellR * Math.sqrt(3);
        var col = warmth > 0.5 ? [255, 64, 96] : [0, 200, 255];
        ctx.save();
        for (var r = -1; r < H / hSpace + 1; r++) {
            for (var q = -1; q < W / (cellR * 1.5) + 1; q++) {
                var cx = q * cellR * 1.5;
                var cy = r * hSpace + (q % 2 ? hSpace / 2 : 0);
                // Distance from center for a radial pulse
                var dx = cx - W / 2, dy = cy - H / 2;
                var d = Math.sqrt(dx*dx + dy*dy);
                var pulse = 0.5 + 0.5 * Math.sin(t * 0.7 - d * 0.005);
                var a = strength * 0.12 * pulse;
                if (a < 0.01) continue;
                ctx.beginPath();
                for (var a2 = 0; a2 < 6; a2++) {
                    var ang = Math.PI / 3 * a2;
                    var hx = cx + cellR * 0.82 * Math.cos(ang);
                    var hy = cy + cellR * 0.82 * Math.sin(ang);
                    if (a2 === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.strokeStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + a.toFixed(3) + ')';
                ctx.lineWidth = 0.9;
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    // 3. Klyntar fortress. Dense honeycomb + threat wave + mouse pulses.
    function drawFortress(strength, t) {
        if (strength < 0.02) return;
        drawHexLattice(strength * 0.9, t, 1);
        // Horizontal threat wave sweeping across
        var waveCycle = (t * 0.2) % 1.0;
        var waveX = W * waveCycle;
        var waveGrad = ctx.createLinearGradient(waveX - 200, 0, waveX + 200, 0);
        waveGrad.addColorStop(0, 'rgba(255,64,96,0)');
        waveGrad.addColorStop(0.5, 'rgba(255,64,96,' + (strength * 0.14).toFixed(3) + ')');
        waveGrad.addColorStop(1, 'rgba(255,64,96,0)');
        ctx.fillStyle = waveGrad;
        ctx.fillRect(0, 0, W, H);
        // Mouse trail pulses
        var now = performance.now();
        for (var p = 0; p < mouseTrail.length; p++) {
            var pulse = mouseTrail[p];
            var age = (now - pulse.t) / 1200; // 1.2s lifetime
            if (age >= 1) { mouseTrail.splice(p, 1); p--; continue; }
            var radius = age * 160;
            var alpha = strength * (1 - age) * 0.35;
            ctx.beginPath();
            ctx.arc(pulse.x, pulse.y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,64,96,' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1.5 + (1 - age) * 1.5;
            ctx.stroke();
        }
    }

    // 4. Warning pulse. Used in chaos scene. Red flashes at random points.
    var warnPoints = [];
    function drawWarningPulse(strength, t) {
        if (strength < 0.02) return;
        // Spawn a new warning every ~1.5s
        if (!warnPoints.length || t - warnPoints[warnPoints.length-1].bornAt > 1.5) {
            warnPoints.push({
                x: 0.15 + Math.random() * 0.7,
                y: 0.2 + Math.random() * 0.6,
                bornAt: t
            });
            if (warnPoints.length > 4) warnPoints.shift();
        }
        for (var p = 0; p < warnPoints.length; p++) {
            var w = warnPoints[p];
            var age = t - w.bornAt;
            if (age > 2.5) continue;
            var pulse = age / 2.5;
            var radius = pulse * 180;
            var alpha = strength * (1 - pulse) * 0.3;
            ctx.beginPath();
            ctx.arc(w.x * W, w.y * H, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(239,68,68,' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }
    }

    // 5. Pipeline flow. Ordered dots moving along an arc.
    function drawPipelineFlow(strength, t) {
        if (strength < 0.02) return;
        ctx.save();
        var cx = W / 2, cy = H / 2;
        var arcR = Math.min(W, H) * 0.35;
        // Draw the arc itself faintly
        ctx.beginPath();
        ctx.arc(cx, cy, arcR, Math.PI * 0.15, Math.PI * 0.85);
        ctx.strokeStyle = 'rgba(212,168,83,' + (strength * 0.18).toFixed(3) + ')';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Flowing dots
        for (var k = 0; k < 10; k++) {
            var frac = ((k / 10) + (t * 0.12)) % 1;
            var ang = Math.PI * 0.15 + frac * Math.PI * 0.7;
            var x = cx + Math.cos(ang) * arcR;
            var y = cy + Math.sin(ang) * arcR;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212,168,83,' + (strength * 0.5).toFixed(3) + ')';
            ctx.fill();
        }
        ctx.restore();
    }

    // --- Draw loop ------------------------------------------------------
    var lastT = 0;
    var MIN_FRAME_MS = 33;

    function draw(ts) {
        var t = ts * 0.00012;
        var tReal = ts / 1000;

        // Smooth scene blending toward target
        var target = SCENES[targetSceneName] || SCENES.awakening;
        var lerp = 0.04; // ~1 second to blend
        sceneBlend.cyan    += (target.cyan - sceneBlend.cyan) * lerp;
        sceneBlend.gold    += (target.gold - sceneBlend.gold) * lerp;
        sceneBlend.red     += (target.red  - sceneBlend.red)  * lerp;
        sceneBlend.streaks += ((target.streaks || 2) - sceneBlend.streaks) * lerp;

        // 1. Base fill
        ctx.fillStyle = '#070b18';
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // 2. Dot depth
        for (var i = 0; i < DOTS; i++) {
            var d = dots[i];
            var twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 3.2 + d.phase));
            ctx.beginPath();
            ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(170, 200, 255, ' + (0.04 * twinkle).toFixed(3) + ')';
            ctx.fill();
        }

        // 3. Aurora orbs. Role weights driven by current scene blend.
        for (var o = 0; o < orbs.length; o++) {
            var orb = orbs[o];
            var driftX = Math.sin(t * 0.8 + orb.phase)       * 0.07;
            var driftY = Math.cos(t * 0.7 + orb.phase * 1.3) * 0.055;
            var x = (orb.bx + driftX) * W;
            var y = (orb.by + driftY) * H;
            var r = orb.r * (0.92 + 0.08 * Math.sin(t * 1.5 + orb.phase));

            var w = orb.role === 0 ? sceneBlend.cyan
                  : orb.role === 1 ? sceneBlend.gold
                  :                  sceneBlend.red;
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

        // 3.5 Streaks (count derived from scene)
        var streakCount = Math.min(6, Math.floor(sceneBlend.streaks + 0.5));
        for (var sj = 0; sj < streakCount; sj++) {
            var sk = streaks[sj];
            var px = ((ts * sk.speed) + sk.phase) % 1;
            var cx2 = px * W;
            var cy2 = sk.y * H + Math.sin(ts * 0.0003 + sj) * 12;
            var sLen = sk.len * W;
            var sCol = sk.hue === 0 ? '0,200,255' : sk.hue === 1 ? '212,168,83' : '255,64,96';
            var sAlpha = 0.07;
            var lg = ctx.createLinearGradient(cx2 - sLen, cy2, cx2, cy2);
            lg.addColorStop(0,   'rgba(' + sCol + ',0)');
            lg.addColorStop(0.8, 'rgba(' + sCol + ',' + sAlpha + ')');
            lg.addColorStop(1,   'rgba(' + sCol + ',0)');
            ctx.fillStyle = lg;
            ctx.fillRect(cx2 - sLen, cy2 - 1, sLen, 2);
        }

        // 4. Scene-specific overlay
        var overlayName = target.overlay;
        if (overlayName) {
            // Strength = how much target scene dominates blend.
            // Using red if target is red-heavy, else cyan+gold mix.
            var strength = target.red > 0.5
                ? Math.max(0, sceneBlend.red - 0.4) * 1.7
                : Math.max(0, (sceneBlend.cyan + sceneBlend.gold) / 2 - 0.3) * 1.5;
            strength = Math.max(0, Math.min(1, strength));

            if (overlayName === 'spiralFormation') drawSpiral(strength, t, 0.05);
            else if (overlayName === 'fiboSpiral') drawSpiral(strength, t, 0.03);
            else if (overlayName === 'hexLattice') drawHexLattice(strength, t, 0);
            else if (overlayName === 'klyntarFortress') drawFortress(strength, tReal);
            else if (overlayName === 'warningPulse') drawWarningPulse(strength, tReal);
            else if (overlayName === 'pipelineFlow') drawPipelineFlow(strength, t);
        }

        // 5. Cursor spotlight
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

        // 6. Edge vignette
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

    // Expose currentScene setter for external hooks (used by the
    // prologue-beat IntersectionObserver below for fine-grained control).
    window.__daenaScene = {
        set: function (name) { if (SCENES[name]) targetSceneName = name; },
        get: function () { return targetSceneName; }
    };

    // --- Prologue beat observer ----------------------------------------
    // Each beat inside #s-prologue gets its own scene. Fade them in as
    // their pinned container enters the viewport.
    window.addEventListener('load', function () {
        var beats = document.querySelectorAll('.prologue-beat');
        if (!beats.length) return;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting && e.intersectionRatio > 0.4) {
                    e.target.classList.add('in');
                    var beat = e.target.dataset.beat;
                    if (beat && SCENES[beat]) targetSceneName = beat;
                } else if (e.intersectionRatio < 0.1) {
                    e.target.classList.remove('in');
                }
            });
        }, { threshold: [0, 0.1, 0.4, 0.7, 1.0] });
        beats.forEach(function (b) { io.observe(b); });
    });
})();
