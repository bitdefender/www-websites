/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */

// ===========================================
// DOT CLOUD HERO ANIMATION
// Bitdefender - Pioneering AI in Cybersecurity
// ===========================================

function insertBreaks(text, isMobile, mobileBreakpoints, desktopBreakpoints) {
  const words = text.split(/\s+/); // split by 1+ spaces
  const breakPositions = isMobile ? mobileBreakpoints?.split(',') : desktopBreakpoints?.split(',');
  const result = [];
  let wordCounter = 0;
  for (let i = 0; i < words.length; i++) {
    result.push(words[i]);
    // word index is 1-based
    const pos = i + 1;
    if (breakPositions?.[0]) {
      if (breakPositions.includes(String(pos))) {
        result.push('\n');
      } else {
        result.push(' ');
      }
    } else {
      const defaultBreakInterval = 2;
      wordCounter++;
      if (wordCounter === defaultBreakInterval) {
        wordCounter = 0;
        result.push('\n');
      } else {
        result.push(' ');
      }
    }
  }

  return result.join('');
}

/**
 * Initialize the dot cloud hero animation
 * @param {string} canvasId - The ID of the canvas element
 * @param {string} sectionSelector - The selector for the hero section
 */
// eslint-disable-next-line max-len
async function initDotCloud(block, canvasId, isMobile, mobileBreakpoints, desktopBreakpoints) {
  // usage

  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const DPR_MULTIPLIER = isMobile ? 0.5 : 1;
  // Global accessibility & performance detection
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPageVisible = !document.hidden;
  const canvas = document.getElementById(canvasId);

  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true });
  const off = document.createElement('canvas');
  const octx = off.getContext('2d', { willReadFrequently: true });
  const title = block.querySelector('h1');
  // Tunables - with mobile-specific overrides that preserve font characteristics
  const FONT_WEIGHT = 700; // Mobile: Black weight for better visibility
  const DOT_STEP = 3; // Mobile: density 3
  const DOT_RADIUS = 1; // Mobile: size 1
  const FORCE = isMobile ? 400 : 100;
  const CLEAR_RADIUS = isMobile ? 0.2 : 0.3; // Mobile: better touch area
  const LINE_WIDTH = isMobile ? 1.2 : 1; // Mobile: slightly thicker lines
  const LINE_ALPHA = 1;
  const LINE_PERSIST = 2000; // time to keep a link visible after last seen (ms)
  const MAX_FPS = 60;
  const AUTO_PERF = true;

  // Performance tracking
  let lastFrameTime = 0;
  const frameInterval = 1000 / MAX_FPS;
  const fpsHistory = [];
  let performanceQuality = 1.0; // 1.0 = full quality, lower = reduced quality

  const state = {
    text: (insertBreaks(title.innerText, isMobile, mobileBreakpoints, desktopBreakpoints) || 'AI-Powered').trim(),
    fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--font') || 'IBM Plex Sans',
    points: [],
    mouse: {
      x: 0, y: 0, down: false, inside: false,
    },
  };

  // Cache computed styles (only update when needed, not every frame)
  let cachedDotColor = (getComputedStyle(document.documentElement).getPropertyValue('--dot-color').trim() || '#006dff');

  // Small link cache with expiry to keep lines visible longer
  const linkCache = []; // {a, b, expire}
  function addOrRefreshLink(a, b, now) {
    // Ensure stable ordering
    const ia = state.points.indexOf(a);
    const ib = state.points.indexOf(b);
    if (ia < 0 || ib < 0) return;
    const keyA = Math.min(ia, ib); const
      keyB = Math.max(ia, ib);
    for (const L of linkCache) {
      if (L.ia === keyA && L.ib === keyB) { L.expire = now + LINE_PERSIST; return; }
    }
    linkCache.push({ ia: keyA, ib: keyB, expire: now + LINE_PERSIST });
    if (linkCache.length > 500) linkCache.shift(); // guard
  }

  // Performance monitoring
  function updatePerformanceMetrics(deltaTime) {
    if (!AUTO_PERF) return;

    const currentFps = 1000 / deltaTime;
    fpsHistory.push(currentFps);
    if (fpsHistory.length > 60) fpsHistory.shift(); // Keep last 60 frames

    if (fpsHistory.length >= 30) {
      const avgFps = fpsHistory.reduce((a, b) => a + b) / fpsHistory.length;

      // If consistently below 30fps, reduce quality
      if (avgFps < 30 && performanceQuality > 0.5) {
        performanceQuality = Math.max(0.5, performanceQuality - 0.05);
      } else if (avgFps > 50 && performanceQuality < 1.0) {
        // If consistently above 50fps, increase quality
        performanceQuality = Math.min(1.0, performanceQuality + 0.02);
      }
    }
  }

  function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    canvas.width = 2000;
    canvas.width = Math.round(w * DPR);
    canvas.height = Math.round(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }

  function rasterizeTextToOffscreen() {
    const targetW = canvas.width; const
      targetH = canvas.height;
    off.width = targetW; off.height = targetH;
    octx.clearRect(0, 0, off.width, off.height);

    // Split text by newlines for multi-line support
    const lines = state.text.split('\n');
    const lineCount = lines.length;

    let fontSize = targetH / lineCount;
    octx.font = `${FONT_WEIGHT} ${fontSize}px ${state.fontFamily}`;

    // Find the longest line for scaling
    let maxWidth = 0;
    for (const line of lines) {
      const metrics = octx.measureText(line);
      if (metrics.width > maxWidth) maxWidth = metrics.width;
    }

    const PAD = targetW * 0.04;
    if (maxWidth + PAD * 2 > targetW) {
      const scale = (targetW - PAD * 2) / maxWidth;
      fontSize *= scale;
      octx.font = `${FONT_WEIGHT} ${fontSize}px ${state.fontFamily}`;
    }

    const lineHeight = fontSize * 1;
    const totalHeight = lineHeight * lineCount;
    const startY = (targetH - totalHeight) / 2 + fontSize * 0.8;

    octx.fillStyle = '#000';
    octx.textBaseline = 'alphabetic';
    octx.font = `${FONT_WEIGHT} ${fontSize}px ${state.fontFamily}`;

    // Draw each line (left-aligned)
    const x = PAD;
    for (let i = 0; i < lines.length; i++) {
      const y = startY + (i * lineHeight);
      octx.fillText(lines[i], x, y);
    }
  }

  function buildPoints() {
    state.points.length = 0;
    const { width: W, height: H } = off;
    const img = octx.getImageData(0, 0, W, H).data;
    const step = Math.max(2, DOT_STEP) * DPR * DPR_MULTIPLIER;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        // eslint-disable-next-line no-bitwise
        const idx = ((y | 0) * W + (x | 0)) * 4 + 3;
        if (img[idx] > 80) {
          state.points.push({
            x, y, ox: x, oy: y, vx: 0, vy: 0,
          });
        }
      }
    }
    linkCache.length = 0; // reset links when rebuilding
  }

  function draw(currentTime) {
    // Pause animation if page is not visible
    if (!isPageVisible) {
      requestAnimationFrame(draw);
      return;
    }

    // FPS throttling
    const elapsed = currentTime - lastFrameTime;
    if (elapsed < frameInterval) {
      requestAnimationFrame(draw);
      return;
    }
    lastFrameTime = currentTime - (elapsed % frameInterval);

    // Track performance
    updatePerformanceMetrics(elapsed);

    const W = canvas.width; const
      H = canvas.height;
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);

    const r = DOT_RADIUS * DPR * DPR_MULTIPLIER;
    const mx = state.mouse.x; const
      my = state.mouse.y;
    const hasMouse = state.mouse.inside || state.mouse.down;
    const repelRadius = (FORCE * CLEAR_RADIUS) * DPR * DPR_MULTIPLIER;
    const repelRadius2 = repelRadius * repelRadius;

    // Adjust physics based on reduced motion preference and performance
    const reducedMotion = prefersReducedMotion;
    const spring = reducedMotion ? 0.08 : 0.03; // Faster return for reduced motion
    const damping = reducedMotion ? 0.8 : 0.9;
    const now = performance.now();

    // --- physics ---
    // Skip physics if reduced motion is enabled and no active interaction
    if (!reducedMotion || hasMouse) {
      for (const p of state.points) {
        if (hasMouse && !reducedMotion) {
          const dx = p.x - mx; const
            dy = p.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < repelRadius2) {
            const dist = Math.max(0.0001, Math.sqrt(d2));
            const push = (FORCE * DPR * DPR_MULTIPLIER) / dist;
            // Softer push with distance-based easing
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
    }

    // --- draw dots with radial gradient on hover ---
    for (const p of state.points) {
      let color = cachedDotColor; // Default blue

      if (hasMouse) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const distFromMouse = Math.sqrt(dx * dx + dy * dy);
        const gradientRadius = repelRadius * 1.5; // Gradient extends beyond repel zone

        if (distFromMouse < gradientRadius) {
          color = '#006dff'; // Set to blue on hover
        }
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- neighbor linking (active zone) ---
    // Skip linking for reduced motion preference or low performance
    if (hasMouse && !reducedMotion && performanceQuality > 0.3) {
      const linkR2 = repelRadius2;
      const active = [];
      for (const p of state.points) {
        const dx = p.x - mx; const
          dy = p.y - my;
        if (dx * dx + dy * dy < linkR2) active.push(p);
      }

      // Adjust link distance based on performance quality
      const maxDist2 = (50 * DPR * DPR_MULTIPLIER * performanceQuality) ** 2; const
        k = 1;
      const cellSize = 50 * DPR * DPR_MULTIPLIER;
      const grid = new Map();

      for (let i = 0; i < active.length; i++) {
        const p = active[i];
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);
        const key = `${cx},${cy}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(i);
      }

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

            for (const j of cell) {
              if (i === j) continue;
              const p2 = active[j];
              const ddx = p1.x - p2.x; const
                ddy = p1.y - p2.y;
              const d2 = ddx * ddx + ddy * ddy;
              if (d2 < maxDist2) {
                if (nearest.length < k) {
                  nearest.push([d2, j]);
                  if (nearest.length === k) nearest.sort((a, b) => a[0] - b[0]);
                } else if (d2 < nearest[k - 1][0]) {
                  nearest[k - 1] = [d2, j];
                  nearest.sort((a, b) => a[0] - b[0]);
                }
              }
            }
          }
        }

        for (const [, j] of nearest) {
          addOrRefreshLink(p1, active[j], now);
        }
      }
    }

    // --- Cull expired links ---
    let writeIdx = 0;
    for (let i = 0; i < linkCache.length; i++) {
      const L = linkCache[i];
      if (now <= L.expire) linkCache[writeIdx++] = L;
    }
    linkCache.length = writeIdx;

    // --- Draw fading links ---
    ctx.lineWidth = LINE_WIDTH * DPR * DPR_MULTIPLIER;
    for (const L of linkCache) {
      const a = state.points[L.ia]; const
        b = state.points[L.ib];
      if (!a || !b) continue;
      const remain = Math.max(0, L.expire - now);
      const alpha = LINE_ALPHA * Math.min(1, remain / LINE_PERSIST);
      if (alpha <= 0.02) continue;
      ctx.strokeStyle = `rgba(0, 109, 255, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    ctx.restore();
    requestAnimationFrame(draw);
  }

  function regenerate() {
    fitCanvas();
    rasterizeTextToOffscreen();
    buildPoints();
    // Refresh cached styles
    cachedDotColor = (getComputedStyle(document.documentElement).getPropertyValue('--dot-color').trim() || '#006dff');
  }

  function canvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * DPR;
    const y = (e.clientY - rect.top) * DPR;
    return { x, y };
  }

  // Pointer Events (modern - supports mouse, touch, pen)
  if (window.PointerEvent) {
    canvas.addEventListener('pointermove', (e) => { e.preventDefault(); const p = canvasPos(e); state.mouse.x = p.x; state.mouse.y = p.y; state.mouse.inside = true; });
    canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); state.mouse.down = true; const p = canvasPos(e); state.mouse.x = p.x; state.mouse.y = p.y; });
    canvas.addEventListener('pointerup', () => { state.mouse.down = false; });
    canvas.addEventListener('pointerleave', () => { state.mouse.inside = false; state.mouse.down = false; });
  } else {
    // Fallback for older browsers
    canvas.addEventListener('mousemove', (e) => { const p = canvasPos(e); state.mouse.x = p.x; state.mouse.y = p.y; state.mouse.inside = true; });
    canvas.addEventListener('mousedown', (e) => { state.mouse.down = true; const p = canvasPos(e); state.mouse.x = p.x; state.mouse.y = p.y; });
    canvas.addEventListener('mouseup', () => { state.mouse.down = false; });
    canvas.addEventListener('mouseleave', () => { state.mouse.inside = false; state.mouse.down = false; });

    // Touch events fallback
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const p = canvasPos(touch);
      state.mouse.x = p.x; state.mouse.y = p.y; state.mouse.down = true; state.mouse.inside = true;
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const p = canvasPos(touch);
      state.mouse.x = p.x; state.mouse.y = p.y; state.mouse.inside = true;
    }, { passive: false });

    canvas.addEventListener('touchend', () => { state.mouse.down = false; state.mouse.inside = false; });
  }

  let resizeT; window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(regenerate, 120); });

  // Wait for IBM Plex Sans font to load before rendering
  document.fonts.ready.then(() => {
    regenerate();
    requestAnimationFrame(draw);
  });
}

export default function decorate(block) {
  const { mobileBreakpoints, desktopBreakpoints } = block.closest('.section').dataset;
  const isMobile = window.innerWidth < 768;
  const bannerCanvas = document.createElement('canvas');
  bannerCanvas.setAttribute('id', 'animation-canvas');
  bannerCanvas.classList.add('interactive-canvas');
  block.appendChild(bannerCanvas);

  const canvas = block.querySelector('#animation-canvas');

  if (canvas) {
    let initialized = false;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      if (!initialized && width > 0 && height > 0) {
        initDotCloud(
          block,
          'animation-canvas',
          isMobile,
          mobileBreakpoints,
          desktopBreakpoints,
        );

        initialized = true;
        resizeObserver.disconnect();
      }
    });

    resizeObserver.observe(canvas);
  }
}
