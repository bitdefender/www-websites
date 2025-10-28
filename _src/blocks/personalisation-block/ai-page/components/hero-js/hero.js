// ===========================================
// DOT CLOUD HERO ANIMATION
// Bitdefender - Pioneering AI in Cybersecurity
// ===========================================

/**
 * Initialize the dot cloud hero animation
 * @param {string} canvasId - The ID of the canvas element
 * @param {string} sectionSelector - The selector for the hero section
 */
function initDotHero(canvasId, sectionSelector) {
  const canvas = document.getElementById(canvasId);
  const section = document.querySelector(sectionSelector);

  if (!canvas || !section) {
    console.warn('Hero canvas or section not found');
    return;
  }

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('Reduced motion detected, skipping animation');
    return;
  }

  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true});
  const off = document.createElement('canvas');
  const octx = off.getContext('2d', { willReadFrequently: true});

  // Get configuration from data attributes
  const config = {
    text: (section.dataset.lines || 'Pioneering\nAI in Cybersecurity\nSince 2008').trim(),
    density: Number(section.dataset.density) || 3,
    dotSize: Number(section.dataset.dotSize) || 1,
    force: Number(section.dataset.force) || 100,
    clearRadius: Number(section.dataset.clearRadius) || 0.3,
    lineWidth: Number(section.dataset.lineWidth) || 0.75,
    lineAlpha: Number(section.dataset.lineAlpha) || 1,
    linePersist: Number(section.dataset.linePersist) || 2000,
  };

  // State management (reuse objects to avoid GC)
  const state = {
    text: config.text,
    fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--font-primary') || 'IBM Plex Sans, system-ui',
    points: [],
    mouse: {
      x: 0, y: 0, down: false, inside: false,
    },
  };

  // Cached colors
  let dotColor = getComputedStyle(document.documentElement).getPropertyValue('--hero-dot-color').trim() || '#1677FF';
  let lineColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--hero-line-color').trim() || '22, 119, 255';

  // Link cache for persistent connections
  const linkCache = [];

  /**
   * Add or refresh a link between two points
   */
  function addOrRefreshLink(a, b, now) {
    const ia = state.points.indexOf(a);
    const ib = state.points.indexOf(b);
    if (ia < 0 || ib < 0) return;

    const keyA = Math.min(ia, ib);
    const keyB = Math.max(ia, ib);

    // Check if link exists
    for (let i = 0; i < linkCache.length; i++) {
      const L = linkCache[i];
      if (L.ia === keyA && L.ib === keyB) {
        L.expire = now + config.linePersist;
        return;
      }
    }

    // Add new link
    linkCache.push({
      ia: keyA, ib: keyB, expire: now + config.linePersist, created: now,
    });

    // Prevent memory leak
    if (linkCache.length > 500) linkCache.shift();
  }

  /**
   * Fit canvas to container
   */
  function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    canvas.width = Math.round(w * DPR);
    canvas.height = Math.round(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }

  /**
   * Rasterize text to offscreen canvas
   */
  function rasterizeTextToOffscreen() {
    const targetW = canvas.width;
    const targetH = canvas.height;
    off.width = targetW;
    off.height = targetH;
    octx.clearRect(0, 0, targetW, targetH);

    // Split text by newlines
    const lines = state.text.split('\n');
    const lineCount = lines.length;

    let fontSize = (targetH * 0.7) / lineCount;
    octx.font = `700 ${fontSize}px ${state.fontFamily}`;

    // Find longest line for scaling
    let maxWidth = 0;
    for (const line of lines) {
      const metrics = octx.measureText(line);
      if (metrics.width > maxWidth) maxWidth = metrics.width;
    }

    const PAD = targetW * 0.04;
    if (maxWidth + PAD * 2 > targetW) {
      const scale = (targetW - PAD * 2) / maxWidth;
      fontSize *= scale;
      octx.font = `700 ${fontSize}px ${state.fontFamily}`;
    }

    const lineHeight = fontSize * 1;
    const totalHeight = lineHeight * lineCount;
    const startY = (targetH - totalHeight) / 2 + fontSize * 0.8;

    octx.fillStyle = '#000';
    octx.textBaseline = 'alphabetic';
    octx.font = `700 ${fontSize}px ${state.fontFamily}`;

    // Draw each line (left-aligned)
    const x = PAD;
    for (let i = 0; i < lines.length; i++) {
      const y = startY + (i * lineHeight);
      octx.fillText(lines[i], x, y);
    }
  }

  /**
   * Build points from rasterized text
   */
  function buildPoints() {
    state.points.length = 0;
    const W = off.width;
    const H = off.height;
    const img = octx.getImageData(0, 0, W, H).data;
    const step = Math.max(2, config.density) * DPR;

    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const idx = ((y | 0) * W + (x | 0)) * 4 + 3;
        if (img[idx] > 80) {
          state.points.push({
            x, y, ox: x, oy: y, vx: 0, vy: 0,
          });
        }
      }
    }

    linkCache.length = 0;
  }

  /**
   * Main draw loop
   */
  function draw() {
    const W = canvas.width;
    const H = canvas.height;

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);

    const r = config.dotSize * DPR;
    const mx = state.mouse.x;
    const my = state.mouse.y;
    const hasMouse = state.mouse.inside || state.mouse.down;
    const repelRadius = (config.force * config.clearRadius) * DPR;
    const repelRadius2 = repelRadius * repelRadius;
    const spring = 0.03;
    const damping = 0.9;
    const now = performance.now();

    // Physics simulation
    for (let i = 0; i < state.points.length; i++) {
      const p = state.points[i];

      if (hasMouse) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;

        if (d2 < repelRadius2) {
          const dist = Math.max(0.0001, Math.sqrt(d2));
          const push = (config.force * DPR) / dist;
          const pushStrength = 1 - (dist / Math.sqrt(repelRadius2));
          p.vx += (dx / dist) * push * 0.15 * pushStrength;
          p.vy += (dy / dist) * push * 0.15 * pushStrength;
        }
      }

      p.vx += (p.ox - p.x) * spring;
      p.vy += (p.oy - p.y) * spring;
      p.vx *= damping;
      p.vy *= damping;
      p.x += p.vx;
      p.y += p.vy;
    }

    // Draw dots
    for (let i = 0; i < state.points.length; i++) {
      const p = state.points[i];
      let color = dotColor;

      if (hasMouse) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const distFromMouse = Math.sqrt(dx * dx + dy * dy);
        const gradientRadius = repelRadius * 1.5;

        if (distFromMouse < gradientRadius) {
          color = dotColor;
        }
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Neighbor linking (active zone)
    if (hasMouse) {
      const linkR2 = repelRadius2;
      const active = [];

      for (let i = 0; i < state.points.length; i++) {
        const p = state.points[i];
        const dx = p.x - mx;
        const dy = p.y - my;
        if (dx * dx + dy * dy < linkR2) active.push(p);
      }

      const maxDist2 = (50 * DPR) ** 2;
      const k = 1;
      const cellSize = 50 * DPR;
      const grid = new Map();

      // Build spatial grid
      for (let i = 0; i < active.length; i++) {
        const p = active[i];
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);
        const key = `${cx},${cy}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(i);
      }

      // Find nearest neighbors
      for (let i = 0; i < active.length; i++) {
        const p1 = active[i];
        const cx = Math.floor(p1.x / cellSize);
        const cy = Math.floor(p1.y / cellSize);
        const nearest = [];

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const key = `${cx + dx},${cy + dy}`;
            const cell = grid.get(key);
            if (!cell) continue;

            for (let j = 0; j < cell.length; j++) {
              const idx = cell[j];
              if (i === idx) continue;

              const p2 = active[idx];
              const ddx = p1.x - p2.x;
              const ddy = p1.y - p2.y;
              const d2 = ddx * ddx + ddy * ddy;

              if (d2 < maxDist2) {
                if (nearest.length < k) {
                  nearest.push([d2, idx]);
                  if (nearest.length === k) nearest.sort((a, b) => a[0] - b[0]);
                } else if (d2 < nearest[k - 1][0]) {
                  nearest[k - 1] = [d2, idx];
                  nearest.sort((a, b) => a[0] - b[0]);
                }
              }
            }
          }
        }

        for (let j = 0; j < nearest.length; j++) {
          addOrRefreshLink(p1, active[nearest[j][1]], now);
        }
      }
    }

    // Cull expired links
    let writeIdx = 0;
    for (let i = 0; i < linkCache.length; i++) {
      const L = linkCache[i];
      if (now <= L.expire) linkCache[writeIdx++] = L;
    }
    linkCache.length = writeIdx;

    // Draw fading links
    ctx.lineWidth = config.lineWidth * DPR;
    for (let i = 0; i < linkCache.length; i++) {
      const L = linkCache[i];
      const a = state.points[L.ia];
      const b = state.points[L.ib];
      if (!a || !b) continue;

      const remain = Math.max(0, L.expire - now);
      const alpha = config.lineAlpha * Math.min(1, remain / config.linePersist);
      if (alpha <= 0.02) continue;

      ctx.strokeStyle = `rgba(${lineColorRGB}, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    ctx.restore();
    requestAnimationFrame(draw);
  }

  /**
   * Regenerate everything
   */
  function regenerate() {
    fitCanvas();
    rasterizeTextToOffscreen();
    buildPoints();

    // Refresh cached colors
    dotColor = getComputedStyle(document.documentElement).getPropertyValue('--hero-dot-color').trim() || '#1677FF';
    lineColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--hero-line-color').trim() || '22, 119, 255';
  }

  /**
   * Get canvas position from event
   */
  function canvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * DPR;
    const y = (e.clientY - rect.top) * DPR;
    return { x, y };
  }

  // Event listeners
  canvas.addEventListener('pointermove', (e) => {
    const p = canvasPos(e);
    state.mouse.x = p.x;
    state.mouse.y = p.y;
    state.mouse.inside = true;
  });

  canvas.addEventListener('pointerdown', (e) => {
    state.mouse.down = true;
    const p = canvasPos(e);
    state.mouse.x = p.x;
    state.mouse.y = p.y;
  });

  canvas.addEventListener('pointerup', () => {
    state.mouse.down = false;
  });

  canvas.addEventListener('pointerleave', () => {
    state.mouse.inside = false;
    state.mouse.down = false;
  });

  // Resize handling with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(regenerate, 120);
  });

  // Initialize
  document.fonts.ready.then(() => {
    regenerate();
    requestAnimationFrame(draw);
  });

  // Expose API
  // eslint-disable-next-line consistent-return
  return {
    regenerate,
    updateText: (newText) => {
      state.text = newText;
      regenerate();
    },
  };
}

const heroSection = document.querySelector('.hero-section');
heroSection.style.visibility = 'visible';

requestAnimationFrame(() => {
  initDotHero('heroCanvas', '.hero-section');
});
