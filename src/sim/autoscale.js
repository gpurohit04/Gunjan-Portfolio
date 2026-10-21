// A small discrete-event model of the Elastic Face Recognition system:
// requests arrive into SQS, EC2 workers pull one at a time, and a controller
// sizes the fleet from queue depth (0 → 15), with a cooldown before scale-in.
// Both the 3D scene and the 2D fallback render from this one source of truth.

export const MAX_WORKERS = 15;

const DEFAULTS = {
  baseRate: 1.4, // requests / second at rest
  burstRate: 38, // requests / second during a burst
  burstSeconds: 4,
  serviceTime: 0.55, // seconds per image on one worker
  backlogPerWorker: 3, // controller target: queued requests per running worker
  bootTime: 1.4, // seconds for a new instance to come up
  cooldown: 3.5, // seconds the fleet must be oversized before scale-in starts
  scaleInEvery: 0.45, // seconds between terminations
};

export class AutoscaleSim {
  constructor(opts = {}) {
    this.o = { ...DEFAULTS, ...opts };
    this.t = 0;
    this.nextId = 1;
    this.queue = [];
    this.workers = Array.from({ length: MAX_WORKERS }, (_, i) => ({ i, state: 'off', timer: 0, job: null }));
    this.latencies = []; // [completedAt, seconds]
    this.done = 0;
    this.burstLeft = 0;
    this.nextArrival = 0.2;
    this.oversizedFor = 0;
    this.sinceScaleIn = 0;
    this.listeners = new Set();
  }

  on(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit(type, data) {
    for (const fn of this.listeners) fn(type, data);
  }

  burst() {
    this.burstLeft = this.o.burstSeconds;
    this.nextArrival = 0;
  }

  get bursting() {
    return this.burstLeft > 0;
  }

  alive() {
    return this.workers.filter((w) => w.state !== 'off');
  }

  step(dt) {
    dt = Math.min(dt, 0.1); // a backgrounded tab shouldn't replay seconds at once
    const o = this.o;
    this.t += dt;
    if (this.burstLeft > 0) this.burstLeft = Math.max(0, this.burstLeft - dt);

    // Arrivals (Poisson process at the current rate)
    const rate = this.burstLeft > 0 ? o.burstRate : o.baseRate;
    this.nextArrival -= dt;
    while (this.nextArrival <= 0) {
      const job = { id: this.nextId++, enq: this.t };
      this.queue.push(job);
      this.emit('arrive', job);
      this.nextArrival += -Math.log(1 - Math.random()) / rate;
    }

    // Workers
    for (const w of this.workers) {
      if (w.state === 'booting') {
        w.timer -= dt;
        if (w.timer <= 0) {
          w.state = 'idle';
          this.emit('ready', w);
        }
      } else if (w.state === 'busy') {
        w.timer -= dt;
        if (w.timer <= 0) {
          const job = w.job;
          w.state = 'idle';
          w.job = null;
          this.done++;
          this.latencies.push([this.t, this.t - job.enq]);
          this.emit('complete', { worker: w, job });
        }
      }
      if (w.state === 'idle' && this.queue.length) {
        const job = this.queue.shift();
        w.state = 'busy';
        w.job = job;
        w.timer = o.serviceTime * (0.75 + Math.random() * 0.5);
        this.emit('dequeue', { worker: w, job });
      }
    }

    // Controller: desired capacity from backlog
    const alive = this.alive();
    const busy = alive.filter((w) => w.state === 'busy').length;
    const backlog = this.queue.length;
    let desired = Math.ceil(backlog / o.backlogPerWorker);
    if (backlog > 0 || busy > 0) desired = Math.max(desired, 1);
    desired = Math.min(MAX_WORKERS, Math.max(desired, busy));

    if (desired > alive.length) {
      let need = desired - alive.length;
      for (const w of this.workers) {
        if (!need) break;
        if (w.state === 'off') {
          w.state = 'booting';
          w.timer = o.bootTime * (0.85 + Math.random() * 0.3);
          this.emit('launch', w);
          need--;
        }
      }
      this.oversizedFor = 0;
    } else if (desired < alive.length) {
      this.oversizedFor += dt;
      this.sinceScaleIn += dt;
      if (this.oversizedFor >= o.cooldown && this.sinceScaleIn >= o.scaleInEvery) {
        const victim = [...this.workers].reverse().find((w) => w.state === 'idle');
        if (victim) {
          victim.state = 'off';
          this.sinceScaleIn = 0;
          this.emit('terminate', victim);
        }
      }
    } else {
      this.oversizedFor = 0;
    }

    // Keep a few seconds of latency history
    while (this.latencies.length && this.t - this.latencies[0][0] > 3) this.latencies.shift();
  }

  snapshot() {
    const alive = this.alive();
    const lat = this.latencies.map((l) => l[1]).sort((a, b) => a - b);
    const p50 = lat.length ? lat[Math.floor(lat.length / 2)] : null;
    return {
      depth: this.queue.length,
      running: alive.filter((w) => w.state !== 'booting').length,
      booting: alive.filter((w) => w.state === 'booting').length,
      p50,
      done: this.done,
      bursting: this.bursting,
      workers: this.workers.map((w) => w.state),
    };
  }
}
