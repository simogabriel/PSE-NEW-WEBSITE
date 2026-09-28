

















(function () {
  "use strict";

  var COLOR = [52, 138, 206];     
  var LINK_DIST = 250;            
  var FACET_DIST = 150;           
  var MAX_DIST = Math.max(LINK_DIST, FACET_DIST);

  
  
  function HOSTS() {
    var list = [];
    var hero = document.getElementById("hero-section");
    if (hero) list.push(hero);
    var workHero = document.querySelector(".ref-hero");
    if (workHero) list.push(workHero);
    var proc = document.querySelector('[data-framer-name="Section Our Proccss"]');
    if (proc) list.push(proc);
    
    
    var footers = document.getElementsByTagName("footer");
    for (var i = 0; i < footers.length; i++) {
      if (footers[i].offsetWidth > 0 && footers[i].offsetHeight > 0) list.push(footers[i]);
    }
    return list;
  }

  function init(host) {
    var hero = host || document.getElementById("hero-section");
    if (!hero || hero.querySelector(".pse-antigravity")) return;
    var isFooter = hero.tagName && hero.tagName.toLowerCase() === "footer";

    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var canvas = document.createElement("canvas");
    canvas.className = "pse-antigravity";
    canvas.setAttribute("aria-hidden", "true");
    if (isFooter) canvas.style.opacity = "0.2";
    hero.insertBefore(canvas, hero.firstChild);

    var ctx = canvas.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, cx = 0, cy = 0;
    var nodes = [];
    var tick = 0;

    function rnd(a, b) { return a + Math.random() * (b - a); }

    function size() {
      var r = hero.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      cx = W / 2; cy = H / 2;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      build();
    }

    


    function build() {
      var count = isFooter
        ? Math.min(45, Math.max(14, Math.round((W * H) / 28000)))
        : Math.min(220, Math.max(70, Math.round((W * H) / 9000)));
      var clusters = Math.max(4, Math.round(count / 16));
      var seeds = [];
      for (var s = 0; s < clusters; s++) {
        
        var ang = rnd(0, Math.PI * 2);
        var rad = rnd(0.45, 1.0);
        seeds.push({
          x: cx + Math.cos(ang) * rad * W * 0.5,
          y: cy + Math.sin(ang) * rad * H * 0.5,
          spread: rnd(90, 220)
        });
      }
      nodes = [];
      for (var i = 0; i < count; i++) {
        var sd = seeds[Math.floor(Math.random() * seeds.length)];
        var a = rnd(0, Math.PI * 2);
        var dd = Math.abs(rnd(-1, 1)) * sd.spread;   
        var x = sd.x + Math.cos(a) * dd;
        var y = sd.y + Math.sin(a) * dd;
        nodes.push({
          x: Math.max(-30, Math.min(W + 30, x)),
          y: Math.max(-30, Math.min(H + 30, y)),
          bvx: rnd(-0.24, 0.24) * (isFooter ? 0.12 : 1),
          bvy: rnd(-0.24, 0.24) * (isFooter ? 0.12 : 1),
          phase: rnd(0, Math.PI * 2),
          pulse: rnd(0.009, 0.021),
          shake: rnd(0.2, 0.5) * (isFooter ? 0.12 : 1),
          ox: 0, oy: 0,              
          rx: 0, ry: 0,              
          r: rnd(1.2, 2.4),
          n1: -1, n2: -1, d1: 0, d2: 0
        });
      }
    }

    
    function edge(x, y) {
      var nx = (x - cx) / (W * 0.46);
      var ny = (y - cy) / (H * 0.42);
      var m = nx * nx + ny * ny;
      if (m > 1) m = 1;
      return 0.14 + 0.86 * (m * m);
    }

    function rgba(a) {
      return "rgba(" + COLOR[0] + "," + COLOR[1] + "," + COLOR[2] + "," + a + ")";
    }

    function frame(animate) {
      tick += animate ? 1 : 0;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      var i, j, a, b, dx, dy, d, n = nodes.length;

      
      for (i = 0; i < n; i++) {
        a = nodes[i];
        if (animate) {
          
          var surge = 0.82 + Math.sin(tick * a.pulse * 0.43 + a.phase) * 0.34;
          var crossShake = Math.sin(tick * a.pulse * 1.73 + a.phase * 0.7) * a.shake * 0.22;
          a.x += a.bvx * surge + Math.sin(tick * a.pulse + a.phase) * a.shake + crossShake;
          a.y += a.bvy * surge + Math.cos(tick * a.pulse * 1.21 + a.phase) * a.shake - crossShake;
          if (a.x < -30) a.x = W + 30; else if (a.x > W + 30) a.x = -30;
          if (a.y < -30) a.y = H + 30; else if (a.y > H + 30) a.y = -30;
        }
        a.rx = a.x + a.ox;
        a.ry = a.y + a.oy;
        a.n1 = a.n2 = -1; a.d1 = a.d2 = 1e9;
      }

      
      ctx.lineWidth = 1;
      for (i = 0; i < n; i++) {
        a = nodes[i];
        for (j = i + 1; j < n; j++) {
          b = nodes[j];
          dx = a.rx - b.rx; dy = a.ry - b.ry;
          var dist2 = dx * dx + dy * dy;
          if (dist2 > MAX_DIST * MAX_DIST) continue;
          d = Math.sqrt(dist2);

          
          if (d < FACET_DIST) {
            if (d < a.d1) { a.d2 = a.d1; a.n2 = a.n1; a.d1 = d; a.n1 = j; }
            else if (d < a.d2) { a.d2 = d; a.n2 = j; }
            if (d < b.d1) { b.d2 = b.d1; b.n2 = b.n1; b.d1 = d; b.n1 = i; }
            else if (d < b.d2) { b.d2 = d; b.n2 = i; }
          }

          
          if (d < LINK_DIST) {
            var ef = edge((a.rx + b.rx) / 2, (a.ry + b.ry) / 2);
            var linkPulse = 0.82 + Math.sin(tick * 0.018 + i * 0.31 + j * 0.13) * 0.18;
            var la = (1 - d / LINK_DIST) * 0.72 * ef * linkPulse;
            if (la > 0.01) {
              ctx.strokeStyle = rgba(la);
              ctx.beginPath();
              ctx.moveTo(a.rx, a.ry);
              ctx.lineTo(b.rx, b.ry);
              ctx.stroke();
            }
          }
        }
      }

      
      for (i = 0; i < n; i++) {
        a = nodes[i];
        if (a.n1 < 0 || a.n2 < 0) continue;
        var p1 = nodes[a.n1], p2 = nodes[a.n2];
        var ef2 = edge((a.rx + p1.rx + p2.rx) / 3, (a.ry + p1.ry + p2.ry) / 3);
        
        
        var fade = 1 - a.d2 / FACET_DIST;
        if (fade < 0) fade = 0;
        var facetPulse = 0.75 + Math.sin(tick * 0.014 + i * 0.47) * 0.25;
        var fa = 0.075 * ef2 * fade * facetPulse;
        if (fa <= 0.004) continue;
        ctx.fillStyle = rgba(fa);
        ctx.beginPath();
        ctx.moveTo(a.rx, a.ry);
        ctx.lineTo(p1.rx, p1.ry);
        ctx.lineTo(p2.rx, p2.ry);
        ctx.closePath();
        ctx.fill();
      }

      
      for (i = 0; i < n; i++) {
        a = nodes[i];
        var nodePulse = 0.82 + Math.sin(tick * a.pulse * 1.8 + a.phase) * 0.18;
        var na = 0.95 * edge(a.rx, a.ry) * nodePulse;
        if (na > 0.02) {
          
          ctx.fillStyle = "rgba(16,38,58," + na + ")";
          ctx.beginPath();
          ctx.arc(a.rx, a.ry, a.r * (0.88 + nodePulse * 0.2), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    var raf = null, running = false, inView = true;
    function loop() { frame(true); raf = requestAnimationFrame(loop); }
    function start() { if (!running && inView && !document.hidden && !reduce) { running = true; loop(); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

    var rt = null;
    window.addEventListener("resize", function () {
      clearTimeout(rt); rt = setTimeout(size, 150);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else if (!reduce) start();
    });

    size();
    if (reduce) frame(false); else start();
    if (typeof IntersectionObserver !== "undefined") {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) start(); else stop();
      }).observe(host);
    }
  }

  function boot() {
    var hs = HOSTS();
    for (var i = 0; i < hs.length; i++) init(hs[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  
  window.addEventListener("load", boot);
  setTimeout(boot, 800);
  setTimeout(boot, 2000);

  if (typeof MutationObserver !== "undefined") {
    var pend = false;
    new MutationObserver(function () {
      if (pend) return;
      pend = true;
      requestAnimationFrame(function () {
        pend = false;
        var hs = HOSTS();
        for (var i = 0; i < hs.length; i++) {
          if (!hs[i].querySelector(".pse-antigravity")) init(hs[i]);
        }
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
