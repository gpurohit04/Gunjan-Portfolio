import { motion } from 'framer-motion';
import { Cloud, Code2, Zap } from 'lucide-react';
import './About.css';

const highlights = [
  {
    icon: <Code2 size={20} />,
    title: 'Full-Stack Development',
    text: 'Feature-rich applications with role-based authentication, persistent data handling, and real-time UI updates.',
  },
  {
    icon: <Cloud size={20} />,
    title: 'Cloud & DevOps',
    text: 'Scalable, queue-driven AWS services with automated CI/CD pipelines, Docker, and infrastructure designed for reliability.',
  },
  {
    icon: <Zap size={20} />,
    title: 'Problem Solving',
    text: 'Deep passion for CS fundamentals — regularly sharpening skills with algorithmic challenges for efficient, clean logic.',
  },
];

const vp = { once: false, margin: '-100px' };
const ease = [0.22, 1, 0.36, 1];

const burstContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const burstItem = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease },
  },
};

export default function About() {
  return (
    <section className="section about" id="about">
      <motion.div
        className="section-label"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={vp}
        transition={{ duration: 0.35, ease }}
      >
        <span className="dot" />
        About Me
      </motion.div>

      <div className="about__grid">
        <motion.div
          className="about__text"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.45, ease }}
        >
          <h2 className="section-title">
            Engineering software that <span className="gradient-text">scales</span>
          </h2>
          <p className="section-subtitle">
            I am a Software Engineer who loves building the whole picture — from
            developing feature-rich applications to designing the robust cloud
            infrastructure that keeps them running. Currently pursuing my
            <strong> M.S. in Software Engineering at Arizona State University</strong>,
            I enjoy tackling complex technical challenges across the entire stack.
          </p>
          <p className="about__detail">
            My experience ranges from improving pipeline throughput by 40% and
            automating workflows to save 15+ hours per week, to building highly
            scalable, queue-driven cloud services designed for operational reliability.
            Whether I'm writing clean application code, refining Agile Scrum practices,
            or automating DevOps pipelines, my goal is to deliver seamless,
            reliable, and user-centric software.
          </p>
        </motion.div>

        <motion.div
          className="about__highlights"
          variants={burstContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-80px' }}
        >
          {highlights.map((item) => (
            <motion.div
              key={item.title}
              className="glass-card about__card"
              variants={burstItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="about__card-icon">{item.icon}</div>
              <div>
                <h3 className="about__card-title">{item.title}</h3>
                <p className="about__card-text">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
