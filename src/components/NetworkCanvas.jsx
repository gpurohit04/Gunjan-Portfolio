import { useEffect, useRef } from 'react';

/**
 * Animated network constellation canvas.
 * Renders slowly drifting nodes connected by lines —
 * looks like a live infrastructure topology map.
 */
export default function NetworkCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let nodes = [];

    const COLORS = [
      'rgba(108, 92, 231, 0.7)',   // accent purple
      'rgba(0, 206, 201, 0.6)',    // teal
      'rgba(116, 185, 255, 0.5)',  // soft blue
      'rgba(253, 121, 168, 0.4)',  // pink
    ];

    const NODE_COUNT = 55;
    const CONNECTION_DIST = 160;
    const PULSE_CHANCE = 0.001; // chance per frame per connection

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createNodes() {
      const w = canvas.parentElement.getBoundingClientRect().width;
      const h = canvas.parentElement.getBoundingClientRect().height;
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1.5 + Math.random() * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          pulse: 0,       // glow pulse phase
          pulseSpeed: 0.01 + Math.random() * 0.02,
        });
      }
    }

    // Active data pulses traveling along connections
    let pulses = [];

    function spawnPulse(a, b) {
      pulses.push({
        ax: a.x, ay: a.y,
        bx: b.x, by: b.y,
        t: 0,
        speed: 0.015 + Math.random() * 0.02,
        color: a.color,
      });
    }

    function draw() {
      const w = canvas.parentElement.getBoundingClientRect().width;
      const h = canvas.parentElement.getBoundingClientRect().height;

      ctx.clearRect(0, 0, w, h);

      // Move nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;

        // Bounce off edges with padding
        if (n.x < -20) n.vx = Math.abs(n.vx);
        if (n.x > w + 20) n.vx = -Math.abs(n.vx);
        if (n.y < -20) n.vy = Math.abs(n.vy);
        if (n.y > h + 20) n.vy = -Math.abs(n.vy);
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // Random chance to spawn a pulse
            if (Math.random() < PULSE_CHANCE && pulses.length < 8) {
              spawnPulse(nodes[i], nodes[j]);
            }
          }
        }
      }

      // Draw data pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const px = p.ax + (p.bx - p.ax) * p.t;
        const py = p.ay + (p.by - p.ay) * p.t;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 6);
        grd.addColorStop(0, p.color.replace('0.7', '0.4').replace('0.6', '0.3'));
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // Draw nodes
      for (const n of nodes) {
        const glowRadius = n.r + 1.5 + Math.sin(n.pulse) * 1.2;

        // Glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowRadius * 3, 0, Math.PI * 2);
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowRadius * 3);
        grd.addColorStop(0, n.color.replace(/[\d.]+\)$/, '0.12)'));
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + Math.sin(n.pulse) * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createNodes();
    draw();

    const handleResize = () => {
      resize();
      createNodes();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero__network-canvas"
      aria-hidden="true"
    />
  );
}
