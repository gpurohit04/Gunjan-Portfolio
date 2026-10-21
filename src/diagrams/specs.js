// Hand-placed layouts for every architecture diagram. Each has a wide layout
// (desktop) and a tall one (mobile) sharing the same labels and edges.
// Edge sides: l r t b; ff/tf = position along that side (0..1).

export const system = {
  alt: 'Client sends requests into an SQS queue; up to fifteen EC2 workers pull from the queue and write results to S3. The worker count scales with queue depth.',
  labels: {
    client: { title: 'Client', sub: 'image requests', kind: 'external' },
    s3: { title: 'S3', sub: 'results', kind: 'store' },
  },
  wide: {
    w: 960,
    h: 300,
    nodes: {
      client: { x: 0, y: 112, w: 130, h: 56 },
      sqs: { x: 180, y: 100, w: 230, h: 80 },
      workers: { x: 470, y: 45, w: 290, h: 190 },
      s3: { x: 820, y: 112, w: 140, h: 56 },
    },
    edges: [
      { from: 'client', to: 'sqs', signal: true },
      { from: 'sqs', to: 'workers', signal: true },
      { from: 'workers', to: 's3', signal: true },
      { from: 'sqs', fs: 'b', to: 'workers', ts: 'b', via: [[295, 285], [615, 285]], dashed: true, flow: false, label: 'scale on queue depth', at: [455, 285] },
    ],
  },
  tall: {
    w: 360,
    h: 520,
    nodes: {
      client: { x: 110, y: 0, w: 140, h: 52 },
      sqs: { x: 30, y: 92, w: 300, h: 80 },
      workers: { x: 30, y: 212, w: 300, h: 200 },
      s3: { x: 110, y: 462, w: 140, h: 56 },
    },
    edges: [
      { from: 'client', fs: 'b', to: 'sqs', ts: 't', signal: true },
      { from: 'sqs', fs: 'b', to: 'workers', ts: 't', signal: true },
      { from: 'workers', fs: 'b', to: 's3', ts: 't', signal: true },
      { from: 'sqs', fs: 'r', to: 'workers', ts: 'r', via: [[352, 132], [352, 312]], dashed: true, flow: false },
    ],
  },
};

export const hiring = {
  alt: 'Email inbox polled over IMAP feeds an n8n validation step that checks MIME type and size. Valid files go to Supabase Storage, then a processing service that extracts text and asks Gemini for structured JSON, then a Next.js dashboard. Invalid files trigger an auto-reply and a rejection log entry. Separately, a health check runs every five minutes and alerts ops on failure.',
  labels: {
    inbox: { title: 'Email inbox', sub: 'IMAP', kind: 'external' },
    n8n: { title: 'n8n validation', sub: 'MIME type · size', mine: true },
    storage: { title: 'Supabase Storage', sub: 'resume files', kind: 'store' },
    proc: { title: 'Processing service', sub: ['text extraction', 'Gemini → JSON'] },
    dash: { title: 'Dashboard', sub: 'Next.js' },
    reply: { title: 'Auto-reply', sub: 'to sender' },
    log: { title: 'Rejection log', sub: 'invalid submissions', kind: 'store' },
    health: { title: 'Health check', sub: 'every 5 min' },
    alert: { title: 'Ops alert', sub: 'on failure' },
  },
  wide: {
    w: 1000,
    h: 410,
    groups: [{ label: 'SEPARATE LOOP', x: 160, y: 290, w: 470, h: 116 }],
    nodes: {
      inbox: { x: 0, y: 122, w: 130, h: 56 },
      n8n: { x: 180, y: 122, w: 160, h: 56 },
      storage: { x: 440, y: 40, w: 170, h: 56 },
      proc: { x: 660, y: 34, w: 190, h: 68 },
      dash: { x: 885, y: 40, w: 115, h: 56 },
      reply: { x: 440, y: 186, w: 170, h: 56 },
      log: { x: 660, y: 186, w: 190, h: 56 },
      health: { x: 180, y: 326, w: 160, h: 56 },
      alert: { x: 440, y: 326, w: 170, h: 56 },
    },
    edges: [
      { from: 'inbox', to: 'n8n', label: 'poll' },
      { from: 'n8n', to: 'storage', ff: 0.3, signal: true, label: 'valid', at: [415, 62] },
      { from: 'storage', to: 'proc', signal: true },
      { from: 'proc', to: 'dash', signal: true },
      { from: 'n8n', to: 'reply', ff: 0.7, label: 'invalid', at: [415, 208] },
      { from: 'reply', to: 'log' },
      { from: 'health', to: 'alert', dashed: true },
    ],
  },
  tall: {
    w: 360,
    h: 640,
    groups: [{ label: 'SEPARATE LOOP', x: 0, y: 520, w: 360, h: 116 }],
    nodes: {
      inbox: { x: 100, y: 0, w: 160, h: 52 },
      n8n: { x: 100, y: 92, w: 160, h: 56 },
      storage: { x: 0, y: 206, w: 170, h: 56 },
      proc: { x: 0, y: 302, w: 170, h: 82 },
      dash: { x: 0, y: 424, w: 170, h: 56 },
      reply: { x: 190, y: 206, w: 170, h: 56 },
      log: { x: 190, y: 302, w: 170, h: 56 },
      health: { x: 16, y: 556, w: 154, h: 56 },
      alert: { x: 190, y: 556, w: 154, h: 56 },
    },
    edges: [
      { from: 'inbox', fs: 'b', to: 'n8n', ts: 't', label: 'poll' },
      { from: 'n8n', fs: 'b', ff: 0.3, to: 'storage', ts: 't', signal: true, label: 'valid', at: [85, 177], anchor: 'middle' },
      { from: 'n8n', fs: 'b', ff: 0.7, to: 'reply', ts: 't', label: 'invalid', at: [275, 177], anchor: 'middle' },
      { from: 'storage', fs: 'b', to: 'proc', ts: 't', signal: true },
      { from: 'proc', fs: 'b', to: 'dash', ts: 't', signal: true },
      { from: 'reply', fs: 'b', to: 'log', ts: 't' },
      { from: 'health', to: 'alert', dashed: true },
    ],
  },
};

export const face = {
  thumb: [300, 40, 480, 360],
  alt: 'Inside AWS: the client uploads images to the web tier, which stores images in an S3 input bucket and sends requests to an SQS request queue. App-tier EC2 workers, scaled from zero to fifteen on queue depth by the controller, read the image from S3, write results to an S3 output bucket and reply through an SQS response queue back to the web tier and client.',
  labels: {
    client: { title: 'Client', sub: 'images', kind: 'external' },
    web: { title: 'Web tier', sub: 'controller · EC2' },
    reqq: { title: 'Request queue', sub: 'SQS', kind: 'queue' },
    respq: { title: 'Response queue', sub: 'SQS', kind: 'queue' },
    app: { title: 'App tier', sub: ['EC2 workers', '0 → 15 instances'] },
    inb: { title: 'Input bucket', sub: 'S3', kind: 'store' },
    outb: { title: 'Output bucket', sub: 'S3', kind: 'store' },
  },
  wide: {
    w: 960,
    h: 350,
    groups: [{ label: 'AWS', x: 130, y: 0, w: 830, h: 346 }],
    nodes: {
      client: { x: 0, y: 140, w: 100, h: 56 },
      web: { x: 160, y: 140, w: 150, h: 56 },
      reqq: { x: 370, y: 90, w: 170, h: 56 },
      respq: { x: 370, y: 196, w: 170, h: 56 },
      app: { x: 600, y: 130, w: 160, h: 76 },
      inb: { x: 810, y: 46, w: 140, h: 56 },
      outb: { x: 810, y: 234, w: 140, h: 56 },
    },
    edges: [
      { from: 'client', ff: 0.3, to: 'web', tf: 0.3, signal: true },
      { from: 'web', fs: 'l', ff: 0.7, to: 'client', ts: 'r', tf: 0.7 },
      { from: 'web', fs: 't', to: 'inb', ts: 't', via: [[235, 28], [880, 28]], label: 'image', at: [560, 28] },
      { from: 'web', ff: 0.3, to: 'reqq', signal: true },
      { from: 'reqq', to: 'app', tf: 0.25, signal: true },
      { from: 'inb', fs: 'l', to: 'app', ts: 't', tf: 0.65 },
      { from: 'app', ff: 0.75, to: 'outb', signal: true },
      { from: 'app', fs: 'l', ff: 0.8, to: 'respq', ts: 'r' },
      { from: 'respq', fs: 'l', to: 'web', ts: 'r', tf: 0.7 },
      { from: 'web', fs: 'b', to: 'app', ts: 'b', tf: 0.7, via: [[235, 310], [712, 310]], dashed: true, flow: false, label: 'scale on queue depth', at: [470, 310] },
    ],
  },
  tall: {
    w: 360,
    h: 640,
    groups: [{ label: 'AWS', x: 0, y: 84, w: 360, h: 552 }],
    nodes: {
      client: { x: 100, y: 0, w: 160, h: 52 },
      web: { x: 100, y: 120, w: 160, h: 56 },
      reqq: { x: 16, y: 236, w: 150, h: 56 },
      respq: { x: 194, y: 236, w: 150, h: 56 },
      app: { x: 100, y: 356, w: 160, h: 76 },
      inb: { x: 16, y: 520, w: 150, h: 56 },
      outb: { x: 194, y: 520, w: 150, h: 56 },
    },
    edges: [
      { from: 'client', fs: 'b', ff: 0.35, to: 'web', ts: 't', tf: 0.35, signal: true },
      { from: 'web', fs: 't', ff: 0.65, to: 'client', ts: 'b', tf: 0.65 },
      { from: 'web', fs: 'b', ff: 0.2, to: 'reqq', ts: 't', signal: true },
      { from: 'reqq', fs: 'b', to: 'app', ts: 't', tf: 0.25, signal: true },
      { from: 'app', fs: 't', ff: 0.75, to: 'respq', ts: 'b' },
      { from: 'respq', fs: 't', to: 'web', ts: 'b', tf: 0.8 },
      { from: 'inb', fs: 't', to: 'app', ts: 'b', tf: 0.25, label: 'image', at: [70, 482], anchor: 'middle' },
      { from: 'app', fs: 'b', ff: 0.75, to: 'outb', ts: 't', signal: true, label: 'result', at: [290, 482], anchor: 'middle' },
      { from: 'web', fs: 'r', to: 'app', ts: 'r', via: [[352, 148], [352, 394]], dashed: true, flow: false },
    ],
  },
};

export const edge = {
  thumb: [170, 10, 440, 330],
  alt: 'On premises, a client device sends video frames over MQTT to a Greengrass core device that runs face detection. Detected faces cross into AWS through an SQS request queue to a Lambda face-recognition function packaged as a container image in ECR. Names come back on a response queue and the results return to the client device.',
  labels: {
    client: { title: 'Client device', sub: 'camera', kind: 'external' },
    core: { title: 'Core device', sub: ['IoT Greengrass', 'face detection'] },
    reqq: { title: 'Request queue', sub: 'SQS', kind: 'queue' },
    respq: { title: 'Response queue', sub: 'SQS', kind: 'queue' },
    lambda: { title: 'Face recognition', sub: ['Lambda', 'container image · ECR'] },
  },
  wide: {
    w: 960,
    h: 330,
    groups: [
      { label: 'ON PREMISES', x: 0, y: 0, w: 390, h: 250 },
      { label: 'AWS', x: 450, y: 0, w: 510, h: 250 },
    ],
    nodes: {
      client: { x: 24, y: 96, w: 130, h: 56 },
      core: { x: 214, y: 88, w: 150, h: 72 },
      reqq: { x: 490, y: 50, w: 170, h: 56 },
      respq: { x: 490, y: 150, w: 170, h: 56 },
      lambda: { x: 730, y: 88, w: 200, h: 72 },
    },
    edges: [
      { from: 'client', to: 'core', signal: true, label: 'MQTT', at: [184, 117] },
      { from: 'core', ff: 0.3, to: 'reqq', signal: true, label: 'faces', at: [427, 70] },
      { from: 'reqq', to: 'lambda', tf: 0.3, signal: true },
      { from: 'lambda', fs: 'l', ff: 0.75, to: 'respq', ts: 'r', label: 'names', at: [702, 175], anchor: 'start' },
      { from: 'respq', fs: 'b', to: 'client', ts: 'b', via: [[575, 290], [89, 290]], label: 'results', at: [330, 290] },
    ],
  },
  tall: {
    w: 360,
    h: 476,
    groups: [
      { label: 'ON PREMISES', x: 0, y: 0, w: 360, h: 136 },
      { label: 'AWS', x: 0, y: 184, w: 360, h: 290 },
    ],
    nodes: {
      client: { x: 16, y: 48, w: 150, h: 56 },
      core: { x: 194, y: 40, w: 150, h: 72 },
      respq: { x: 16, y: 226, w: 150, h: 56 },
      reqq: { x: 194, y: 226, w: 150, h: 56 },
      lambda: { x: 90, y: 376, w: 200, h: 72 },
    },
    edges: [
      { from: 'client', to: 'core', signal: true },
      { from: 'core', fs: 'b', to: 'reqq', ts: 't', signal: true, label: 'faces', at: [277, 160], anchor: 'start' },
      { from: 'reqq', fs: 'b', to: 'lambda', ts: 't', tf: 0.8, signal: true },
      { from: 'lambda', fs: 't', ff: 0.2, to: 'respq', ts: 'b', label: 'names', at: [138, 336], anchor: 'start' },
      { from: 'respq', fs: 't', to: 'client', ts: 'b', label: 'results', at: [99, 160], anchor: 'start' },
    ],
  },
};

export const scrum = {
  thumb: [200, -40, 440, 330],
  alt: 'A team member signs in, which sets their role. Every action passes a role check before it changes team and sprint state; state changes refresh the Swing views the team member sees.',
  labels: {
    user: { title: 'Team member', sub: 'PO · SM · developer', kind: 'external' },
    signin: { title: 'Sign-in', sub: 'sets role' },
    check: { title: 'Role check', sub: 'every action' },
    state: { title: 'Team & sprint state', sub: 'persisted', kind: 'store' },
    views: { title: 'Swing views', sub: 'refresh on change' },
  },
  wide: {
    w: 960,
    h: 230,
    nodes: {
      user: { x: 0, y: 30, w: 170, h: 56 },
      signin: { x: 230, y: 30, w: 150, h: 56 },
      check: { x: 440, y: 30, w: 160, h: 56 },
      state: { x: 660, y: 30, w: 220, h: 56 },
      views: { x: 440, y: 160, w: 160, h: 56 },
    },
    edges: [
      { from: 'user', to: 'signin' },
      { from: 'signin', to: 'check' },
      { from: 'check', to: 'state', signal: true },
      { from: 'state', fs: 'b', to: 'views', ts: 'r', label: 'change', at: [778, 160], anchor: 'start' },
      { from: 'views', fs: 'l', to: 'user', ts: 'b' },
    ],
  },
  tall: {
    w: 360,
    h: 470,
    nodes: {
      user: { x: 90, y: 0, w: 200, h: 56 },
      signin: { x: 90, y: 100, w: 200, h: 56 },
      check: { x: 90, y: 200, w: 200, h: 56 },
      state: { x: 90, y: 300, w: 200, h: 56 },
      views: { x: 90, y: 400, w: 200, h: 56 },
    },
    edges: [
      { from: 'user', fs: 'b', to: 'signin', ts: 't' },
      { from: 'signin', fs: 'b', to: 'check', ts: 't' },
      { from: 'check', fs: 'b', to: 'state', ts: 't', signal: true },
      { from: 'state', fs: 'b', to: 'views', ts: 't', label: 'change' },
      { from: 'views', fs: 'l', to: 'user', ts: 'l', via: [[30, 428], [30, 28]] },
    ],
  },
};

export const specs = { hiring, face, edge, scrum };
