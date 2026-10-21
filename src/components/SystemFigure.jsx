import { useEffect, useMemo, useRef, useState } from 'react';
import { AutoscaleSim, MAX_WORKERS } from '../sim/autoscale';
import { prefersReducedMotion, useMediaQuery } from '../lib/motion';
import Diagram from '../diagrams/Diagram';
import { system } from '../diagrams/specs';
import './SystemFigure.css';

const QUEUE_SCALE = 90; // depth at which the 2D queue bar reads full

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

// Steps the simulation on rAF while the figure is on screen and the tab is visible.
function useSimLoop(sim, ref) {
  useEffect(() => {
    let raf = 0;
    let last = 0;
    let visible = true;
    const tick = (t) => {
      const dt = last ? (t - last) / 1000 : 0;
      last = t;
      sim.step(dt);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(ref.current);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    start();
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [sim, ref]);
}

function useSnapshot(sim, hz = 8) {
  const [snap, setSnap] = useState(() => sim.snapshot());
  useEffect(() => {
    const id = setInterval(() => setSnap(sim.snapshot()), 1000 / hz);
    return () => clearInterval(id);
  }, [sim, hz]);
  return snap;
}

function QueueNode({ n, depth }) {
  const barW = n.w - 24;
  const fill = Math.min(depth / QUEUE_SCALE, 1) * barW;
  return (
    <g className="dg-node">
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="2" />
      <text className="dg-title" x={n.x + 12} y={n.y + 24}>
        Request queue
      </text>
      <text className="dg-sub" x={n.x + 12} y={n.y + 40}>
        SQS · depth {depth}
      </text>
      <rect className="sf-bar" x={n.x + 12} y={n.y + n.h - 24} width={barW} height="10" />
      <rect className="sf-bar-fill" x={n.x + 12} y={n.y + n.h - 24} width={fill} height="10" />
    </g>
  );
}

function WorkersNode({ n, snap }) {
  const cols = 5;
  const size = 30;
  const gap = 10;
  const gw = cols * size + (cols - 1) * gap;
  const x0 = n.x + (n.w - gw) / 2;
  const y0 = n.y + 72;
  return (
    <g className="dg-node">
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="2" />
      <text className="dg-title" x={n.x + 12} y={n.y + 24}>
        EC2 workers
      </text>
      <text className="dg-sub" x={n.x + 12} y={n.y + 40}>
        {snap.running} running{snap.booting ? ` · ${snap.booting} booting` : ''} · max {MAX_WORKERS}
      </text>
      {snap.workers.map((state, i) => (
        <rect
          key={i}
          className={`sf-worker sf-worker--${state}`}
          x={x0 + (i % cols) * (size + gap)}
          y={y0 + Math.floor(i / cols) * (size + gap)}
          width={size}
          height={size}
          rx="1"
        />
      ))}
    </g>
  );
}

export default function SystemFigure() {
  const sim = useMemo(() => new AutoscaleSim(), []);
  const ref = useRef(null);
  useSimLoop(sim, ref);
  const snap = useSnapshot(sim);

  const desktop = useMediaQuery('(min-width: 900px) and (pointer: fine)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [Scene, setScene] = useState(null);
  const [sceneReady, setSceneReady] = useState(false);

  // three.js only on desktop with motion allowed, fetched once the page is idle.
  useEffect(() => {
    if (!desktop || reduced || prefersReducedMotion() || !hasWebGL()) {
      setSceneReady(false);
      return;
    }
    let cancelled = false;
    const load = () =>
      import('./Scene3D').then((m) => {
        if (!cancelled) setScene(() => m.default);
      });
    const id = 'requestIdleCallback' in window ? requestIdleCallback(load, { timeout: 2500 }) : setTimeout(load, 1200);
    return () => {
      cancelled = true;
      'cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id);
    };
  }, [desktop, reduced]);

  const show3D = Scene && desktop && !reduced;
  const expect3D = useMemo(() => desktop && !reduced && hasWebGL(), [desktop, reduced]);

  // Most visitors won't press the button, so run one demo burst the first time the
  // figure is properly in view (after the 3D scene is up, where it will load).
  const touchedRef = useRef(false);
  const autoRef = useRef(false);
  useEffect(() => {
    if (reduced || prefersReducedMotion() || autoRef.current || (expect3D && !sceneReady)) return;
    let timer;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(() => {
          if (touchedRef.current || autoRef.current || sim.bursting) return;
          autoRef.current = true;
          sim.burst();
        }, 2500);
      },
      { threshold: 0.5 },
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [sim, reduced, expect3D, sceneReady]);

  // Spoken status for screen readers: only on burst start and once the fleet settles.
  const [status, setStatus] = useState('');
  const settledRef = useRef(true);
  useEffect(() => {
    if (snap.bursting && settledRef.current) {
      settledRef.current = false;
      setStatus(
        touchedRef.current
          ? 'Burst sent. Queue filling, workers scaling out.'
          : 'Demo burst started automatically. Queue filling, workers scaling out.',
      );
    } else if (!settledRef.current && !snap.bursting && snap.depth === 0 && snap.running <= 2 && !snap.booting) {
      settledRef.current = true;
      setStatus(`Queue drained. Fleet scaled back in to ${snap.running} worker${snap.running === 1 ? '' : 's'}.`);
    }
  }, [snap]);

  const renderNode = (id, n) => {
    if (id === 'sqs') return <QueueNode key={id} n={n} depth={snap.depth} />;
    if (id === 'workers') return <WorkersNode key={id} n={n} snap={snap} />;
    return null;
  };

  return (
    <div className={`sf${show3D && sceneReady ? ' sf--3d' : ''}`} ref={ref}>
      <div className="sf-stage">
        <div className="sf-2d">
          <Diagram spec={system} renderNode={renderNode} />
        </div>
        {show3D && (
          <div className="sf-3d">
            <Scene sim={sim} onReady={() => setSceneReady(true)} />
          </div>
        )}
      </div>

      <div className="sf-console">
        <dl className="sf-readouts">
          <div>
            <dt className="label">Queue depth</dt>
            <dd>{snap.depth}</dd>
          </div>
          <div>
            <dt className="label">Workers</dt>
            <dd>
              {snap.running}
              <span className="sf-unit">/{MAX_WORKERS}</span>
              {snap.booting > 0 && <span className="sf-boot">+{snap.booting}</span>}
            </dd>
          </div>
          <div>
            <dt className="label">p50 latency</dt>
            <dd>
              {snap.p50 == null ? '—' : snap.p50.toFixed(2)}
              {snap.p50 != null && <span className="sf-unit">s</span>}
            </dd>
          </div>
          <div>
            <dt className="label">Processed</dt>
            <dd>{snap.done}</dd>
          </div>
        </dl>
        <button
          className="btn btn--primary sf-burst"
          onClick={() => {
            touchedRef.current = true;
            if (!sim.bursting) sim.burst();
          }}
          aria-disabled={snap.bursting}
        >
          {snap.bursting ? 'Burst in progress…' : 'Send burst traffic'}
        </button>
        <p className="sf-note">Sends ~150 requests over 4 seconds.</p>
        <p className="sr-only" aria-live="polite">
          {status}
        </p>
      </div>

      <p className="sf-caption">
        <span className="label">Fig. 1</span>
        <span>
          Elastic Face Recognition, simulated live in your browser. Requests enter SQS; EC2 workers pull from the
          queue and the fleet scales on queue depth, from zero up to fifteen, then back in after a cooldown.
        </span>
      </p>
    </div>
  );
}
