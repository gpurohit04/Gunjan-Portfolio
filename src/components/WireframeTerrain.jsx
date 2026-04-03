import { useEffect, useRef } from 'react';

/**
 * 3D wireframe terrain — optimized for 60fps.
 * Uses batched path drawing and reduced grid density.
 */
export default function WireframeTerrain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    // Reduced grid for performance
    const COLS = 45;
    const ROWS = 28;
    const SPACING = 32;

    const CAM_HEIGHT = 180;
    const CAM_DIST = 350;
    const FOV = 600;

    let w = 0, h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function getHeight(x, z, t) {
      return (
        Math.sin(x * 0.04 + t * 0.4) * Math.cos(z * 0.04 + t * 0.3) * 30 +
        Math.sin(x * 0.07 - t * 0.2) * Math.sin(z * 0.07 + t * 0.5) * 15 +
        Math.cos((x + z) * 0.02 + t * 0.15) * 20
      );
    }

    function project(x3d, y3d, z3d) {
      const dz = z3d + CAM_DIST;
      if (dz <= 0) return null;
      const scale = FOV / dz;
      return {
        x: w / 2 + x3d * scale,
        y: h / 2 + (y3d - CAM_HEIGHT) * scale,
        depth: dz,
      };
    }

    // Pre-allocate arrays
    const points = new Array(ROWS);
    for (let r = 0; r < ROWS; r++) points[r] = new Array(COLS);

    const maxDepth = ROWS * SPACING + CAM_DIST;
    const offsetX = -(COLS * SPACING) / 2;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      time += 0.008;

      // Compute all points
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const gx = c * SPACING;
          const gz = r * SPACING;
          points[r][c] = project(
            offsetX + gx,
            -getHeight(gx, gz, time),
            50 + gz
          );
        }
      }

      // Batch draw all lines in one stroke style per opacity band
      // Use 4 opacity bands to reduce state changes
      const bands = [0.08, 0.15, 0.22, 0.3];
      for (let b = 0; b < bands.length; b++) {
        const minAlpha = b === 0 ? 0.01 : bands[b - 1];
        const maxAlpha = bands[b];

        ctx.strokeStyle = `rgba(108, 92, 231, ${maxAlpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();

        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const p = points[r][c];
            if (!p) continue;

            const alpha = Math.max(0, 1 - p.depth / maxDepth) * 0.35;
            if (alpha < minAlpha || alpha >= maxAlpha) continue;

            // Right neighbor
            if (c < COLS - 1) {
              const pr = points[r][c + 1];
              if (pr) {
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(pr.x, pr.y);
              }
            }
            // Down neighbor
            if (r < ROWS - 1) {
              const pd = points[r + 1][c];
              if (pd) {
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(pd.x, pd.y);
              }
            }
          }
        }
        ctx.stroke();
      }

      // Sparse peak dots (no gradient glow — too expensive)
      ctx.fillStyle = 'rgba(108, 92, 231, 0.35)';
      for (let r = 0; r < ROWS; r += 4) {
        for (let c = 0; c < COLS; c += 4) {
          const p = points[r][c];
          if (!p) continue;
          const ht = getHeight(c * SPACING, r * SPACING, time);
          if (ht > 22) {
            const fade = Math.max(0, 1 - p.depth / maxDepth);
            if (fade < 0.1) continue;
            ctx.globalAlpha = fade * 0.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero__terrain-canvas"
      aria-hidden="true"
    />
  );
}
