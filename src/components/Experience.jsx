import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import './Experience.css';

const timeline = [
  {
    type: 'education',
    title: 'M.S. Software Engineering',
    org: 'Arizona State University, Tempe, AZ',
    period: 'Aug 2025 – May 2027 (Expected)',
    bullets: [
      'Focused coursework in distributed systems, cloud computing, DevOps automation, and site reliability engineering.',
    ],
  },
  {
    type: 'work',
    title: 'AI & Machine Learning Intern',
    org: 'YBI Foundation, Remote',
    period: 'May 2024 – Jun 2024',
    bullets: [
      'Processed & validated 10,000+ records with Python, Pandas, and NumPy — increasing pipeline throughput by 40%.',
      'Automated validation & reporting workflows, reducing manual effort by 15+ hours per week.',
      'Built supervised learning baselines achieving 92% test accuracy with cross-validation techniques.',
      'Maintained versioned notebooks and structured outputs for reproducible, audit-ready workflows.',
    ],
  },
  {
    type: 'education',
    title: 'B.E. Computer Engineering',
    org: 'Vidush Somany Institute of Technology and Research, Gujarat, India',
    period: 'Oct 2021 – Jun 2025',
    bullets: [
      'Solid foundation in data structures, algorithms, operating systems, and computer networks.',
    ],
  },
];

const ease = [0.22, 1, 0.36, 1];
const vp = { once: false, margin: '-80px' };

const burstContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const burstItem = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
};

export default function Experience() {
  return (
    <section className="section experience" id="experience">
      <motion.div
        className="section-label"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={vp}
        transition={{ duration: 0.35, ease }}
      >
        <span className="dot" />
        Experience
      </motion.div>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={vp}
        transition={{ duration: 0.4, delay: 0.05, ease }}
      >
        Where I've <span className="gradient-text">been</span>
      </motion.h2>

      <motion.div
        className="experience__timeline"
        variants={burstContainer}
        initial="hidden"
        whileInView="visible"
        viewport={vp}
      >
        {timeline.map((item) => (
          <motion.div
            key={item.title + item.org}
            className="glass-card experience__item"
            variants={burstItem}
            whileHover={{ y: -4, x: 6, transition: { duration: 0.2 } }}
          >
            <div className="experience__icon" data-type={item.type}>
              {item.type === 'education' ? <GraduationCap size={20} /> : <Briefcase size={20} />}
            </div>
            <div className="experience__content">
              <span className="experience__period">{item.period}</span>
              <h3 className="experience__title">{item.title}</h3>
              <span className="experience__org">{item.org}</span>
              <ul className="experience__bullets">
                {item.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
