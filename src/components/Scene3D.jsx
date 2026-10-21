// The hero's 3D model of the Elastic Face Recognition system.
// Lazy-loaded on desktop only; renders from the shared AutoscaleSim.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MAX_WORKERS } from '../sim/autoscale';
import './Scene3D.css';

const C = {
  plate: '#f1efe9',
  model: '#fbfaf7',
  pad: '#e2ded5',
  edge: '#a9a499',
  guide: '#d8d4ca',
  signal: '#b93d0b',
  tint: '#f0c9b3',
};

const CLIENT = new THREE.Vector3(-11, 0, 0);
const TROUGH = { x0: -7.6, x1: -2.4, z: 1.05 };
const S3 = new THREE.Vector3(11, 0, 0);
const CUBE = 0.36;
const CUBE_GAP = 0.42;
const COLS_Z = 4;
const PER_LAYER = 12 * COLS_Z;
const QUEUE_CAP = PER_LAYER * 3;
const POOL = 220;

const workerPos = (i) => new THREE.Vector3(1.3 + (i % 5) * 1.55, 0, (Math.floor(i / 5) - 1) * 1.55);

function queueSlot(i, out) {
  const layer = Math.floor(i / PER_LAYER);
  const idx = i % PER_LAYER;
  const col = Math.floor(idx / COLS_Z);
  const row = idx % COLS_Z;
  return out.set(TROUGH.x1 - 0.32 - col * CUBE_GAP, 0.42 + CUBE / 2 + layer * CUBE_GAP, (row - (COLS_Z - 1) / 2) * CUBE_GAP);
}

// A box with crisp hairline edges, the basic unit of the model.
function Block({ size, position, color = C.model, edges = true }) {
  const geo = useMemo(() => new THREE.BoxGeometry(...size), [size]);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  return (
    <group position={position}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.92} />
      </mesh>
      {edges && (
        <lineSegments geometry={edgeGeo}>
          <lineBasicMaterial color={C.edge} />
        </lineSegments>
      )}
    </group>
  );
}

function Guides() {
  // Engraved paths on the plate showing the request flow.
  const strips = [
    [-9.9, -7.6],
    [-2.4, 0.5],
    [8.2, 9.8],
  ];
  return strips.map(([a, b]) => (
    <mesh key={a} position={[(a + b) / 2, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[b - a, 0.07]} />
      <meshBasicMaterial color={C.guide} />
    </mesh>
  ));
}

function Trough() {
  const len = TROUGH.x1 - TROUGH.x0;
  const cx = (TROUGH.x0 + TROUGH.x1) / 2;
  const wall = 0.12;
  const h = 0.75;
  return (
    <group>
      <Block size={[len, 0.4, TROUGH.z * 2]} position={[cx, 0.2, 0]} />
      <Block size={[len, h, wall]} position={[cx, h / 2, TROUGH.z]} />
      <Block size={[len, h, wall]} position={[cx, h / 2, -TROUGH.z]} />
      <Block size={[wall, h, TROUGH.z * 2]} position={[TROUGH.x0, h / 2, 0]} />
      <Block size={[wall, h * 0.6, TROUGH.z * 2]} position={[TROUGH.x1, (h * 0.6) / 2, 0]} />
    </group>
  );
}

function Bucket() {
  const geo = useMemo(() => new THREE.CylinderGeometry(1.2, 1.2, 1.3, 48), []);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.CylinderGeometry(1.2, 1.2, 1.3, 48), 30), []);
  return (
    <group position={[S3.x, 0.65, 0]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color={C.model} roughness={0.92} />
      </mesh>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color={C.edge} />
      </lineSegments>
    </group>
  );
}

function Workers({ sim }) {
  const refs = useRef([]);
  const jobs = useRef([]);
  const mats = useRef([]);
  const h = useRef(new Float32Array(MAX_WORKERS).fill(0.03));
  const model = useMemo(() => new THREE.Color(C.model), []);
  const tint = useMemo(() => new THREE.Color(C.tint), []);
  const geo = useMemo(() => new THREE.BoxGeometry(1.1, 1.5, 1.1).translate(0, 0.75, 0), []);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 7);
    sim.workers.forEach((w, i) => {
      const target = w.state === 'off' ? 0.03 : w.state === 'booting' ? 0.45 : 1;
      h.current[i] += (target - h.current[i]) * k;
      const g = refs.current[i];
      if (!g) return;
      g.scale.y = h.current[i];
      g.visible = h.current[i] > 0.035 || w.state !== 'off';
      mats.current[i].color.lerp(w.state === 'booting' ? tint : model, k);
      jobs.current[i].visible = w.state === 'busy';
      jobs.current[i].position.y = 1.5 * h.current[i] + 0.2;
    });
  });

  return Array.from({ length: MAX_WORKERS }, (_, i) => {
    const p = workerPos(i);
    return (
      <group key={i} position={p}>
        {/* footprint pad: shows an empty slot the fleet can grow into */}
        <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial color={C.pad} />
        </mesh>
        <group ref={(el) => (refs.current[i] = el)}>
          <mesh geometry={geo} castShadow receiveShadow>
            <meshStandardMaterial ref={(m) => (mats.current[i] = m)} color={C.model} roughness={0.92} />
          </mesh>
          <lineSegments geometry={edgeGeo}>
            <lineBasicMaterial color={C.edge} />
          </lineSegments>
        </group>
        <mesh ref={(el) => (jobs.current[i] = el)} visible={false} castShadow>
          <boxGeometry args={[CUBE, CUBE, CUBE]} />
          <meshStandardMaterial color={C.signal} roughness={0.7} />
        </mesh>
      </group>
    );
  });
}

// Queue contents (instanced cubes) and requests in flight (instanced beads).
function Traffic({ sim }) {
  const queueRef = useRef();
  const beadRef = useRef();
  const pool = useRef(Array.from({ length: POOL }, () => ({ on: false, t: 0, dur: 1, a: new THREE.Vector3(), c: new THREE.Vector3(), b: new THREE.Vector3(), done: null })));
  const landing = useRef(0); // arrivals still in the air; not yet shown in the trough
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const v = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const launch = (from, to, lift, dur, done) => {
      const p = pool.current.find((q) => !q.on);
      if (!p) {
        done?.();
        return;
      }
      p.on = true;
      p.t = 0;
      p.dur = dur;
      p.a.copy(from);
      p.b.copy(to);
      p.c.copy(from).add(to).multiplyScalar(0.5);
      p.c.y += lift;
      p.done = done;
    };
    return sim.on((type, d) => {
      if (type === 'arrive') {
        landing.current++;
        launch(v.set(CLIENT.x + 1, 1.7, 0), new THREE.Vector3(TROUGH.x0 + 0.8, 1.0, 0), 2.2, 0.7, () => landing.current--);
      } else if (type === 'dequeue') {
        const w = workerPos(d.worker.i);
        launch(new THREE.Vector3(TROUGH.x1 - 0.3, 0.9, 0), w.setY(1.75), 1.6, 0.45);
      } else if (type === 'complete') {
        const w = workerPos(d.worker.i).setY(1.75);
        launch(w, new THREE.Vector3(S3.x, 1.4, 0), 2.4, 0.75);
      }
    });
  }, [sim, v]);

  useFrame((_, dt) => {
    // Queue: show what has actually landed
    const shown = Math.min(QUEUE_CAP, Math.max(0, sim.queue.length - landing.current));
    const q = queueRef.current;
    for (let i = 0; i < QUEUE_CAP; i++) {
      if (i < shown) {
        queueSlot(i, tmp.position);
        tmp.scale.setScalar(1);
      } else {
        tmp.scale.setScalar(0);
      }
      tmp.updateMatrix();
      q.setMatrixAt(i, tmp.matrix);
    }
    q.instanceMatrix.needsUpdate = true;

    // Beads along quadratic arcs
    const beads = beadRef.current;
    pool.current.forEach((p, i) => {
      if (p.on) {
        p.t += dt / p.dur;
        if (p.t >= 1) {
          p.on = false;
          p.done?.();
        }
      }
      if (p.on) {
        const t = p.t;
        const u = 1 - t;
        tmp.position.set(
          u * u * p.a.x + 2 * u * t * p.c.x + t * t * p.b.x,
          u * u * p.a.y + 2 * u * t * p.c.y + t * t * p.b.y,
          u * u * p.a.z + 2 * u * t * p.c.z + t * t * p.b.z,
        );
        tmp.scale.setScalar(1);
      } else {
        tmp.scale.setScalar(0);
      }
      tmp.updateMatrix();
      beads.setMatrixAt(i, tmp.matrix);
    });
    beads.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={queueRef} args={[null, null, QUEUE_CAP]} castShadow frustumCulled={false}>
        <boxGeometry args={[CUBE, CUBE, CUBE]} />
        <meshStandardMaterial color={C.signal} roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={beadRef} args={[null, null, POOL]} frustumCulled={false}>
        <sphereGeometry args={[0.13, 12, 8]} />
        <meshBasicMaterial color={C.signal} />
      </instancedMesh>
    </>
  );
}

// Fit the orthographic camera to the model's width.
function Framing() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    camera.zoom = Math.min(size.width / 29, size.height / 12.5);
    camera.lookAt(0.2, 0.3, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

// Projects 3D anchor points to the DOM labels laid over the canvas.
function LabelProjector({ anchors, labels }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    anchors.forEach((a, i) => {
      const el = labels.current[i];
      if (!el) return;
      v.copy(a).project(camera);
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px)`;
    });
  });
  return null;
}

const LABELS = [
  { at: new THREE.Vector3(CLIENT.x, 0, 1.6), title: 'Client', sub: 'image requests' },
  { at: new THREE.Vector3((TROUGH.x0 + TROUGH.x1) / 2, 0, 1.75), title: 'Request queue', sub: 'SQS' },
  { at: new THREE.Vector3(4.4, 0, 2.6), title: 'App tier', sub: 'EC2 workers · 0 → 15' },
  { at: new THREE.Vector3(S3.x, 0, 1.75), title: 'Output bucket', sub: 'S3' },
];

export default function Scene3D({ sim, onReady }) {
  const wrap = useRef(null);
  const labels = useRef([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div className="s3d" ref={wrap} aria-hidden="true">
      <Canvas
        orthographic
        shadows
        flat
        dpr={[1, 1.75]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [3.5, 15, 21], zoom: 40, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={() => requestAnimationFrame(() => onReady?.())}
      >
        <Framing />
        <hemisphereLight args={['#ffffff', '#ddd8ce', 1.9]} />
        <directionalLight
          position={[-9, 18, 11]}
          intensity={1.35}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-16}
          shadow-camera-right={16}
          shadow-camera-top={9}
          shadow-camera-bottom={-9}
          shadow-bias={-0.0004}
          shadow-radius={4}
        />
        <Block size={[26.5, 0.5, 8.4]} position={[0, -0.25, 0]} color={C.plate} />
        <Guides />
        <Block size={[2.1, 1.7, 2.1]} position={[CLIENT.x, 0.85, 0]} />
        <Trough />
        <Workers sim={sim} />
        <Bucket />
        <Traffic sim={sim} />
        <LabelProjector anchors={LABELS.map((l) => l.at)} labels={labels} />
      </Canvas>
      {LABELS.map((l, i) => (
        <div key={l.title} className="s3d-label" ref={(el) => (labels.current[i] = el)}>
          <span className="s3d-label__title">{l.title}</span>
          <span className="s3d-label__sub">{l.sub}</span>
        </div>
      ))}
    </div>
  );
}
