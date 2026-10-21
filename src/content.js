// All copy and data for the site. Metrics here are the real, reported numbers;
// anything that isn't a number is written as prose in the case study instead.

export const person = {
  name: 'Gunjan Purohit',
  role: 'DevOps · SRE · Cloud engineering',
  school: 'M.S. Software Engineering, Arizona State University',
  graduation: 'May 2027',
  availability: 'Summer 2027 internships / full-time from 2027',
  location: 'Tempe, AZ',
  email: 'purohitgunjan666@gmail.com',
  linkedin: 'https://www.linkedin.com/in/gunjan-purohit-42115b306',
  github: 'https://github.com/gpurohit04',
  resume: '/resume.pdf',
};

export const intro = [
  'I work on the parts of a system that keep it up: queues that absorb a burst, fleets that size themselves from load, pipelines that test and deploy every change, and alerts that fire only when someone needs to act.',
  'My rule of thumb: if a step can fail, it gets a check; if a check repeats, it gets automated.',
];

export const caseStudies = [
  {
    id: 'hiring-pipeline',
    title: 'Hiring Pipeline',
    summary:
      'Resumes arrive by email and land on a recruiter dashboard already parsed and scored against the job description, with no one opening an attachment.',
    meta: [
      ['Role', 'n8n workflows'],
      ['Team', '4 engineers'],
      ['Ships to', 'Vercel, via GitHub Actions CI'],
    ],
    problemShort: 'Recruiters read every resume by hand against the job description: slow, and two reviewers scored the same person differently.',
    problem:
      'Recruiters were screening resumes by hand: open the email, download the file, read it against the job description, copy details into a sheet. It was slow, and two people would score the same candidate differently. We wanted intake to run on its own and hand recruiters a consistent, structured view of every applicant.',
    diagram: 'hiring',
    caption:
      'Mail is polled over IMAP. n8n validates each attachment; valid files go to storage and processing, invalid ones get an auto-reply and a log entry. A separate health check runs every five minutes.',
    hardPartTitle: 'What broke, and what I fixed',
    // Drafted from the incident list; wording of each fix to be confirmed by Gunjan.
    incidents: [
      {
        title: 'Duplicate submissions',
        text: 'The same resume could arrive twice, from a candidate re-sending or from a message being picked up again, and it showed up as two candidates. I gave each submission an idempotency key (sender plus a hash of the file) and checked it before anything was stored, so a repeat is logged instead of processed.',
      },
      {
        title: 'Timestamp mismatch in file URLs',
        text: 'The storage path and the URL handed to the processing service were each built from their own timestamp, and when they landed in different seconds the service fetched a file that wasn’t there. I now generate the object key once, at upload, and pass that key through every later step.',
      },
      {
        title: 'Alert flapping',
        text: 'One slow health check would page ops, and the next run five minutes later would clear it. I changed the rule to alert only after consecutive failures and to send a single recovery message, so an alert means the service is actually down.',
      },
    ],
    results: [
      ['91%', 'backend test coverage'],
      ['40+', 'automated tests'],
    ],
    resultsNote: 'The test suite runs in GitHub Actions CI, and the app deploys to Vercel.',
    screenshot: {
      src: '/hiring-dashboard.png',
      alt: 'Recruiter dashboard listing seeded, fictional candidates with match scores and status',
      caption: 'Recruiter dashboard. All candidate data shown is fake, seeded for the demo.',
    },
    stack: ['n8n', 'IMAP', 'Supabase Storage', 'Gemini (structured JSON)', 'Next.js', 'GitHub Actions', 'Vercel'],
  },
  {
    id: 'face-recognition',
    title: 'Elastic Face Recognition',
    summary:
      'A three-tier face recognition service on AWS that grows from zero to fifteen workers under burst traffic and shrinks back when the queue drains.',
    meta: [
      ['Scope', 'Design and build, end to end'],
      ['Load', 'Course auto-grader traffic'],
    ],
    problemShort: 'Recognition is slow per request and traffic arrives in bursts, so the service had to accept everything at once and scale to finish it.',
    problem:
      'Image recognition is slow per request, and traffic arrives in bursts. A web server doing the work inline either drops requests at the peak or pays for idle machines the rest of the time. The service had to accept every request immediately and finish them as fast as capacity allowed.',
    diagram: 'face',
    caption:
      'The web tier writes images to S3 and requests to SQS. App-tier EC2 workers pull from the request queue, store results, and reply on a response queue. The controller sizes the app tier from queue depth.',
    hardPartTitle: 'The hard part',
    hardPart: [
      'Scaling on the right signal. CPU lags behind a burst, so the controller reads SQS queue depth and launches instances until the backlog per worker is back under target, from zero up to fifteen. Scale-in waits for the queue to stay empty, so the fleet doesn’t thrash between bursts.',
      'Workers had to be disposable. Each one runs under systemd with health checks, so a crashed worker restarts on its own and a terminated one leaves no work behind: a message only leaves the queue once its result is stored. Instances use IMDSv2 and a least-privilege IAM role scoped to the two queues and two buckets.',
    ],
    results: [
      ['0 → 15', 'EC2 workers, scaled on queue depth'],
      ['99.9%', 'uptime under the course auto-grader'],
    ],
    stack: ['EC2', 'SQS', 'S3', 'IAM', 'Python', 'Linux / systemd'],
  },
  {
    id: 'edge-pipeline',
    title: 'Hybrid Edge–Cloud Inference',
    summary:
      'Face detection runs on the edge device; only the faces go to the cloud for recognition, which cuts cloud work and keeps responses under 1.5 seconds.',
    meta: [['Scope', 'Edge and cloud, end to end']],
    problemShort: 'Streaming every camera frame to the cloud is slow and expensive when most frames have no face in them.',
    problem:
      'Sending every video frame to the cloud is expensive and slow, and most frames don’t contain anything worth recognising. The pipeline needed to do the cheap filtering close to the camera and reserve cloud compute for the frames that matter, while staying reliable under concurrent load.',
    diagram: 'edge',
    caption:
      'The client device publishes frames over MQTT to a Greengrass core device, which runs face detection. Detected faces go to an SQS request queue for recognition in Lambda; names return on a response queue.',
    hardPartTitle: 'The hard part',
    hardPart: [
      'Splitting the work in the right place. Detection on the core device drops frames with no face before they cost a cloud invocation, and SQS sits between edge and cloud so a spike in camera traffic queues up instead of overwhelming Lambda.',
      'Trusting the devices. Every device authenticates to AWS IoT with its own X.509 certificate rather than shared credentials, and the recognition function ships as a Docker image from ECR.',
    ],
    results: [
      ['< 1.5 s', 'end-to-end latency at 100 concurrent requests'],
      ['35%', 'fewer cloud invocations from edge filtering'],
    ],
    stack: ['AWS IoT Greengrass', 'MQTT', 'IoT Core', 'SQS', 'Lambda', 'Docker', 'ECR'],
  },
  {
    id: 'scrum-tool',
    title: 'Scrum Simulation Tool',
    summary:
      'A desktop tool for practising Scrum as a team, where what you can do depends on the role you hold.',
    meta: [
      ['Role', 'Backlog and sprint planning'],
      ['Team', 'Course team project, SER 515'],
      ['Code', 'github.com/viraj091/G3_SER515_Agile_Avengers'],
    ],
    repo: 'https://github.com/viraj091/G3_SER515_Agile_Avengers',
    // No metric for this one: the headline slot states the role instead.
    role: 'I turned the requirements into a prioritised backlog and led sprint planning with Planning Poker and value scoring.',
    roleShort: 'Led backlog and sprint planning',
    problemShort: 'Students read about Scrum roles but rarely practise them. This tool runs a whole sprint, with permissions that follow each person’s role.',
    problem:
      'Students learning Scrum read about roles and ceremonies but rarely run them. The tool walks a team through a sprint, from planning to demo to retrospective, with each person acting as Product Owner, Scrum Master or developer.',
    diagram: 'scrum',
    caption:
      'Every action passes a role check before it touches team or sprint state; state is persisted and the views refresh as soon as it changes.',
    hardPartTitle: 'The hard part',
    hardPart: [
      'Turning requirements into work the team could estimate. Each backlog item got acceptance criteria, and sprint planning used Planning Poker for effort and value scoring for priority, so the order came from the team’s estimates rather than from whoever spoke first.',
      'Permissions that follow the role, not the screen. Sign-in sets each person’s role; creating and joining teams is guarded against duplicate joins and bad assignments, and data persists between sessions. Testing turned up usability problems we then fixed, including login visibility issues and a role-selection step nobody needed. Permission changes now apply in real time, and the product and sprint backlogs have separate views.',
      'We ran the project the way the tool teaches: small reviewed pull requests, a live task board, twice-weekly stand-ups, short demos, and written conventions for branching and estimation.',
    ],
    results: null,
    stack: ['Java', 'Swing', 'Git', 'GitHub pull requests'],
  },
];

export const work = {
  when: 'May – Jun 2024',
  what: 'AI & Machine Learning Intern',
  where: 'YBI Foundation, remote',
  metrics: [
    ['40%', 'higher pipeline throughput'],
    ['15+ h', 'of manual checking automated away each week'],
    ['92%', 'test accuracy, cross-validated baselines'],
    ['10,000+', 'records processed and validated'],
  ],
  note: 'Python, Pandas and NumPy. Notebooks were versioned and outputs structured, so every run could be reproduced and audited.',
};

export const education = [
  {
    when: 'Aug 2025 – May 2027',
    what: 'M.S. Software Engineering',
    where: 'Arizona State University, Tempe, AZ',
    note: 'Distributed systems, cloud computing, DevOps automation, site reliability engineering.',
  },
  {
    when: 'Oct 2021 – Jun 2025',
    what: 'B.E. Computer Engineering',
    where: 'Vidush Somany Institute of Technology and Research, Gujarat, India',
    note: 'Data structures, algorithms, operating systems, computer networks.',
  },
];

export const skills = [
  ['Cloud', 'AWS: EC2, S3, SQS, Lambda, IAM, ECR, IoT Core, IoT Greengrass. Supabase, Vercel.'],
  ['Delivery', 'Docker, Git, GitHub Actions, CI/CD, automated testing, structured logging.'],
  ['Automation', 'n8n workflows, IMAP intake, health checks and alerting.'],
  ['Systems', 'Linux, systemd, MQTT, queue-based and event-driven design.'],
  ['Languages', 'Python, Java, SQL. Pandas and NumPy for data work.'],
];
