import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, Server, Cloud, Database, Shield, Cpu, GitBranch, Layout } from 'lucide-react';
import ArchitectureModal from './ArchitectureModal';
import './Projects.css';

const projects = [
  {
    title: 'Elastic Cloud Face Recognition System',
    description:
      'A three-tier distributed face recognition system with decoupled workers pulling requests from Amazon SQS and storing results in S3 — enabling resilient asynchronous processing during burst traffic.',
    metrics: [
      { value: '0→15', label: 'Auto-scaled EC2 instances via queue depth' },
      { value: '99.9%', label: 'Uptime with systemd health checks' },
      { value: 'IMDSv2', label: 'Least-privilege IAM + security controls' },
    ],
    tags: ['AWS EC2', 'SQS', 'S3', 'IAM', 'Python', 'Linux'],
    github: null,
    live: null,
    color: 'var(--accent)',
    featured: true,
    archImage: '/arch-face-recognition.png',
    flowNodes: [
      { icon: 'client', label: 'Client' },
      { icon: 'queue', label: 'SQS' },
      { icon: 'server', label: 'EC2 Workers' },
      { icon: 'database', label: 'S3 Store' },
    ],
  },
  {
    title: 'Hybrid Cloud & Edge AI Pipeline',
    description:
      'Hybrid edge-cloud inference with IoT Greengrass, MQTT, and SQS decoupling for reliable message flow under heavy load.',
    metrics: [
      { value: '<1.5s', label: 'End-to-end latency (100 concurrent reqs)' },
      { value: '35%', label: 'Fewer cloud invocations via edge filtering' },
      { value: 'X.509', label: 'Certificate-based device security' },
    ],
    tags: ['IoT Greengrass', 'Lambda', 'Docker', 'ECR', 'MQTT'],
    github: null,
    live: null,
    color: 'var(--accent-secondary)',
    featured: false,
    archImage: '/arch-hybrid-pipeline.png',
    flowNodes: [
      { icon: 'cpu', label: 'Edge' },
      { icon: 'cloud', label: 'IoT Core' },
      { icon: 'queue', label: 'SQS' },
      { icon: 'server', label: 'Lambda' },
    ],
  },
  {
    title: 'Role-Based Scrum Simulation Tool',
    description:
      'Full-stack Scrum tool with role-based auth, team workflows, duplicate-join prevention, and immediate UI refresh.',
    metrics: [
      { value: 'RBAC', label: 'Role-based auth with real-time permissions' },
      { value: 'Agile', label: 'Sprint planning → Demo → Retrospective' },
      { value: 'CI/CD', label: 'Small PRs, live task board, standups' },
    ],
    tags: ['Java', 'Swing', 'Auth', 'Agile', 'Scrum'],
    github: 'https://github.com/viraj091/G3_SER515_Agile_Avengers',
    live: null,
    color: '#fd79a8',
    featured: false,
    archImage: null,
    flowNodes: [
      { icon: 'git', label: 'Git PR' },
      { icon: 'server', label: 'CI/CD' },
      { icon: 'shield', label: 'Auth' },
      { icon: 'client', label: 'UI' },
    ],
  },
];

function FlowNode({ icon, label, color, delay }) {
  const icons = {
    client: <Cpu size={16} />,
    queue: <Database size={16} />,
    server: <Server size={16} />,
    database: <Cloud size={16} />,
    cloud: <Cloud size={16} />,
    cpu: <Cpu size={16} />,
    shield: <Shield size={16} />,
    git: <GitBranch size={16} />,
  };

  return (
    <motion.div
      className="flow-node"
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false }}
      transition={{ duration: 0.35, delay: delay * 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flow-node__icon" style={{ borderColor: color, color }}>
        {icons[icon]}
      </div>
      <span className="flow-node__label">{label}</span>
    </motion.div>
  );
}

function FlowArrow({ delay }) {
  return (
    <motion.div
      className="flow-arrow"
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: false }}
      transition={{ duration: 0.25, delay: delay * 0.5, ease: [0.25, 0.1, 0, 1] }}
    >
      <ArrowRight size={14} />
    </motion.div>
  );
}

function MetricItem({ value, label, delay, color }) {
  return (
    <motion.div
      className="metric-item"
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false }}
      transition={{ duration: 0.3, delay: delay * 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="metric-item__value" style={{ color }}>{value}</span>
      <span className="metric-item__label">{label}</span>
    </motion.div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Projects() {
  const featured = projects.find((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', imageSrc: '' });

  const openArch = (title, imageSrc) => {
    setModalData({ title, imageSrc });
    setModalOpen(true);
  };

  return (
    <section className="section projects" id="projects">

      <ArchitectureModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalData.title}
        imageSrc={modalData.imageSrc}
      />

      <motion.div
        className="section-label"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: '-80px' }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
      >
        <span className="dot" />
        Projects
      </motion.div>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-80px' }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.25, 0.1, 0, 1] }}
      >
        Things I've <span className="gradient-text">built</span>
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-80px' }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
        style={{ marginBottom: 'var(--space-3xl)' }}
      >
        Real systems designed for scale, reliability, and measurable impact.
      </motion.p>

      {/* Featured Project - Full Width */}
      {featured && (
        <motion.article
          className="project-terminal project-terminal--featured"
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-40px' }}
          variants={cardVariants}
        >
          <div className="terminal__header">
            <div className="terminal__dots">
              <span className="terminal__dot terminal__dot--red" />
              <span className="terminal__dot terminal__dot--yellow" />
              <span className="terminal__dot terminal__dot--green" />
            </div>
            <span className="terminal__title terminal__title--typed">~/projects/{featured.title.toLowerCase().replace(/\s+/g, '-')}</span>
            <div className="terminal__actions">
              {featured.github && (
                <a href={featured.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github size={16} />
                </a>
              )}
            </div>
          </div>

          <div className="terminal__body">
            <div className="terminal__content">
              <div className="terminal__left">
                <span className="project-number">01</span>
                <h3 className="terminal__project-title">{featured.title}</h3>
                <p className="terminal__desc">{featured.description}</p>
                <div className="terminal__tags">
                  {featured.tags.map((tag) => (
                    <span key={tag} className="skill-tag">{tag}</span>
                  ))}
                </div>
                {featured.archImage && (
                  <motion.button
                    className="arch-btn"
                    onClick={() => openArch(featured.title, featured.archImage)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Layout size={16} />
                    View Architecture
                    <ArrowRight size={14} className="arch-btn__arrow" />
                  </motion.button>
                )}
              </div>

              <div className="terminal__right">
                {/* Architecture Flow */}
                <div className="terminal__flow">
                  <span className="terminal__flow-label">Architecture</span>
                  <div className="flow-diagram">
                    {featured.flowNodes.map((node, ni) => (
                      <div className="flow-step" key={node.label}>
                        <FlowNode icon={node.icon} label={node.label} color={featured.color} delay={0.3 + ni * 0.12} />
                        {ni < featured.flowNodes.length - 1 && <FlowArrow delay={0.4 + ni * 0.12} />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="terminal__metrics">
                  {featured.metrics.map((m, mi) => (
                    <MetricItem key={m.label} value={m.value} label={m.label} delay={0.5 + mi * 0.1} color={featured.color} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      )}

      {/* Other Projects - Side by Side */}
      <div className="projects__duo">
        {others.map((project, i) => (
          <motion.article
            key={project.title}
            className="project-terminal"
            custom={i + 1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-40px' }}
            variants={cardVariants}
          >
            <div className="terminal__header">
              <div className="terminal__dots">
                <span className="terminal__dot terminal__dot--red" />
                <span className="terminal__dot terminal__dot--yellow" />
                <span className="terminal__dot terminal__dot--green" />
              </div>
              <span className="terminal__title terminal__title--typed">~/{project.title.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}</span>
              <div className="terminal__actions">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github size={14} />
                  </a>
                )}
              </div>
            </div>

            <div className="terminal__body">
              <span className="project-number">0{i + 2}</span>
              <h3 className="terminal__project-title terminal__project-title--sm">{project.title}</h3>
              <p className="terminal__desc">{project.description}</p>

              {/* Compact Flow */}
              <div className="terminal__flow terminal__flow--compact">
                <div className="flow-diagram">
                  {project.flowNodes.map((node, ni) => (
                    <div className="flow-step" key={node.label}>
                      <FlowNode icon={node.icon} label={node.label} color={project.color} delay={0.3 + ni * 0.1} />
                      {ni < project.flowNodes.length - 1 && <FlowArrow delay={0.35 + ni * 0.1} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="terminal__metrics terminal__metrics--compact">
                {project.metrics.map((m, mi) => (
                  <MetricItem key={m.label} value={m.value} label={m.label} delay={0.4 + mi * 0.08} color={project.color} />
                ))}
              </div>

              <div className="terminal__bottom-row">
                <div className="terminal__tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="skill-tag">{tag}</span>
                  ))}
                </div>
                {project.archImage && (
                  <motion.button
                    className="arch-btn arch-btn--sm"
                    onClick={() => openArch(project.title, project.archImage)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Layout size={14} />
                    Architecture
                    <ArrowRight size={12} className="arch-btn__arrow" />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
