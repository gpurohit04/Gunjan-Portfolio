import { useEffect, useId, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';
import './Diagram.css';

// Point on a node's side. f = 0..1 along that side.
function anchor(n, side, f = 0.5) {
  if (side === 'r') return [n.x + n.w, n.y + n.h * f];
  if (side === 'l') return [n.x, n.y + n.h * f];
  if (side === 't') return [n.x + n.w * f, n.y];
  return [n.x + n.w * f, n.y + n.h];
}

const horizontal = (s) => s === 'l' || s === 'r';

// Orthogonal route between two anchors, unless explicit waypoints are given.
function route(a, b, fs, ts, via) {
  if (via) return [a, ...via, b];
  if (a[0] === b[0] || a[1] === b[1]) return [a, b];
  if (horizontal(fs) && horizontal(ts)) {
    const mx = (a[0] + b[0]) / 2;
    return [a, [mx, a[1]], [mx, b[1]], b];
  }
  if (!horizontal(fs) && !horizontal(ts)) {
    const my = (a[1] + b[1]) / 2;
    return [a, [a[0], my], [b[0], my], b];
  }
  return horizontal(fs) ? [a, [b[0], a[1]], b] : [a, [a[0], b[1]], b];
}

function longestSegmentMid(pts) {
  let best = 0;
  let mid = pts[0];
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const len = Math.abs(x2 - x1) + Math.abs(y2 - y1);
    if (len > best) {
      best = len;
      mid = [(x1 + x2) / 2, (y1 + y2) / 2, y1 === y2];
    }
  }
  return mid;
}

const pathLength = (pts) =>
  pts.slice(1).reduce((sum, p, i) => sum + Math.abs(p[0] - pts[i][0]) + Math.abs(p[1] - pts[i][1]), 0);

// Requests in flight: dots that travel an edge, rest, and go again. SMIL, so no JS per frame.
function Flow({ href, len, count, signal }) {
  const travel = Math.max(len / 150, 0.5);
  const cycle = travel / 0.6;
  return Array.from({ length: count }, (_, k) => (
    <circle key={k} r={signal ? 3.5 : 3} className={`dg-dot${signal ? ' dg-dot--signal' : ''}`} opacity="0">
      <animateMotion
        dur={`${cycle}s`}
        begin={`-${(k * cycle) / count}s`}
        repeatCount="indefinite"
        keyPoints="0;1;1"
        keyTimes="0;0.6;1"
        calcMode="linear"
      >
        <mpath href={`#${href}`} />
      </animateMotion>
      <animate
        attributeName="opacity"
        dur={`${cycle}s`}
        begin={`-${(k * cycle) / count}s`}
        repeatCount="indefinite"
        values="1;1;0;0"
        keyTimes="0;0.58;0.6;1"
      />
    </circle>
  ));
}

export function Node({ n, title, sub, kind, mine }) {
  const subs = sub ? [].concat(sub) : [];
  const titleY = n.y + n.h / 2 - (subs.length ? 7 * subs.length - 1 : -5);
  return (
    <g className={`dg-node dg-node--${kind || 'service'}`}>
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="2" />
      {kind === 'store' && <line className="dg-detail" x1={n.x} x2={n.x + n.w} y1={n.y + 6} y2={n.y + 6} />}
      {kind === 'queue' && n.w >= 165 &&
        [0, 1, 2].map((i) => (
          <line
            key={i}
            className="dg-detail"
            x1={n.x + n.w - 12 - i * 6}
            x2={n.x + n.w - 12 - i * 6}
            y1={n.y + n.h / 2 - 8}
            y2={n.y + n.h / 2 + 8}
          />
        ))}
      {mine && <rect className="dg-mine" x={n.x + n.w - 9} y={n.y + 4} width="5" height="5" />}
      <text className="dg-title" x={n.x + 12} y={titleY}>
        {title}
      </text>
      {subs.map((s, i) => (
        <text key={s} className="dg-sub" x={n.x + 12} y={titleY + 16 + i * 14}>
          {s}
        </text>
      ))}
    </g>
  );
}

export function Layout({ layout, labels, className, uid, renderNode, flows, crop }) {
  const routes = (layout.edges || []).map((e) =>
    route(anchor(layout.nodes[e.from], e.fs || 'r', e.ff), anchor(layout.nodes[e.to], e.ts || 'l', e.tf), e.fs || 'r', e.ts || 'l', e.via),
  );
  const { w, h, nodes, groups = [], edges = [] } = layout;
  return (
    <svg
      className={`dg-svg ${className}`}
      viewBox={crop ? crop.join(' ') : `-2 -2 ${w + 4} ${h + 4}`}
      preserveAspectRatio={crop ? 'xMidYMid slice' : undefined}
      aria-hidden="true"
    >
      <defs>
        <marker id={`${uid}-a`} viewBox="0 0 8 8" refX="7.5" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0.5 L8 4 L0 7.5 z" className="dg-arrowhead" />
        </marker>
        <marker id={`${uid}-s`} viewBox="0 0 8 8" refX="7.5" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0.5 L8 4 L0 7.5 z" className="dg-arrowhead dg-arrowhead--signal" />
        </marker>
      </defs>

      {groups.map((g) => (
        <g key={g.label} className="dg-group">
          <rect x={g.x} y={g.y} width={g.w} height={g.h} rx="2" />
          <text x={g.x + 10} y={g.y + 18}>
            {g.label}
          </text>
        </g>
      ))}

      {edges.map((e, i) => {
        const pts = routes[i];
        const d = pts.map((p, j) => `${j ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
        const mid = e.at || longestSegmentMid(pts);
        return (
          <g key={i} className={`dg-edge${e.signal ? ' dg-edge--signal' : ''}${e.dashed ? ' dg-edge--dashed' : ''}`}>
            <path id={`${uid}-p${i}`} d={d} pathLength={e.dashed ? undefined : 1} markerEnd={`url(#${uid}-${e.signal ? 's' : 'a'})`} />
            {e.label && (
              <text
                x={mid[0] + (e.dx ?? (mid[2] === false ? 8 : 0))}
                y={mid[1] + (e.dy ?? (mid[2] === false ? 4 : -7))}
                textAnchor={e.anchor || (mid[2] === false ? 'start' : 'middle')}
              >
                {e.label}
              </text>
            )}
          </g>
        );
      })}

      {flows &&
        edges.map(
          (e, i) =>
            e.flow !== false && (
              <Flow key={i} href={`${uid}-p${i}`} len={pathLength(routes[i])} count={e.signal ? 2 : 1} signal={e.signal} />
            ),
        )}

      {Object.entries(nodes).map(([id, n]) =>
        renderNode?.(id, n) ?? <Node key={id} n={n} {...labels[id]} />,
      )}
    </svg>
  );
}

// A numbered, captioned figure that swaps between a wide and a tall layout.
export default function Diagram({ spec, fig, caption, renderNode, children, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const ref = useRef(null);
  const [live, setLive] = useState(false);

  // Draw edges in once on first view; flows run only while the figure is on screen.
  useEffect(() => {
    const el = ref.current;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      el.classList.add('is-drawn');
      return;
    }
    const svgs = () => el.querySelectorAll('svg');
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-drawn');
          setLive(true);
          svgs().forEach((s) => s.unpauseAnimations?.());
        } else {
          svgs().forEach((s) => s.pauseAnimations?.());
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={`dg ${className}`} ref={ref}>
      <div className="dg-plate" role="img" aria-label={spec.alt}>
        <Layout layout={spec.wide} labels={spec.labels} className="dg-svg--wide" uid={`${uid}w`} renderNode={renderNode} flows={live} />
        <Layout layout={spec.tall} labels={spec.labels} className="dg-svg--tall" uid={`${uid}t`} renderNode={renderNode} flows={live} />
        {children}
      </div>
      {caption && (
        <figcaption className="dg-caption">
          {fig && <span className="label">Fig. {fig}</span>}
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
