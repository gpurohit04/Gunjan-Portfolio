import { motion } from 'framer-motion';
import './Skills.css';

/* Skill icon URLs from Simple Icons CDN (monochrome white) */
const icons = {
  'Python': 'https://cdn.simpleicons.org/python/a9b1d6',
  'Java': 'https://cdn.simpleicons.org/openjdk/a9b1d6',
  'SQL': 'https://cdn.simpleicons.org/postgresql/a9b1d6',
  'Pandas': 'https://cdn.simpleicons.org/pandas/a9b1d6',
  'NumPy': 'https://cdn.simpleicons.org/numpy/a9b1d6',
  'Data Validation': null,
  'Analytics & Reporting': null,
  'Data Quality Controls': null,
  'AWS EC2': 'https://cdn.simpleicons.org/amazonec2/a9b1d6',
  'S3': 'https://cdn.simpleicons.org/amazons3/a9b1d6',
  'SQS': 'https://cdn.simpleicons.org/amazonsqs/a9b1d6',
  'Lambda': 'https://cdn.simpleicons.org/awslambda/a9b1d6',
  'IAM': 'https://cdn.simpleicons.org/amazoniam/a9b1d6',
  'ECR': 'https://cdn.simpleicons.org/amazonaws/a9b1d6',
  'IoT Core': 'https://cdn.simpleicons.org/amazonaws/a9b1d6',
  'IoT Greengrass': 'https://cdn.simpleicons.org/amazonaws/a9b1d6',
  'Linux CLI': 'https://cdn.simpleicons.org/linux/a9b1d6',
  'System Design': null,
  'Docker': 'https://cdn.simpleicons.org/docker/a9b1d6',
  'Git': 'https://cdn.simpleicons.org/git/a9b1d6',
  'GitHub': 'https://cdn.simpleicons.org/github/a9b1d6',
  'CI/CD': 'https://cdn.simpleicons.org/githubactions/a9b1d6',
  'GitHub Actions': 'https://cdn.simpleicons.org/githubactions/a9b1d6',
  'Testing Automation': null,
  'Structured Logging': null,
  'Agile / Scrum': null,
};

const skillCategories = [
  {
    title: 'Programming & Data',
    color: 'var(--accent)',
    skills: ['Python', 'Java', 'SQL', 'Pandas', 'NumPy', 'Data Validation', 'Analytics & Reporting', 'Data Quality Controls'],
  },
  {
    title: 'Cloud & DevOps',
    color: 'var(--accent-secondary)',
    skills: ['AWS EC2', 'S3', 'SQS', 'Lambda', 'IAM', 'ECR', 'IoT Core', 'IoT Greengrass', 'Linux CLI', 'System Design'],
  },
  {
    title: 'Containers & Delivery',
    color: '#fd79a8',
    skills: ['Docker', 'Git', 'GitHub', 'CI/CD', 'GitHub Actions', 'Testing Automation', 'Structured Logging', 'Agile / Scrum'],
  },
];

const vp = { once: false, margin: '-80px' };
const ease = [0.22, 1, 0.36, 1];

const burstContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const burstCard = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
};

const tagContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025 } },
};

const tagItem = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease } },
};

export default function Skills() {
  return (
    <section className="section skills" id="skills">
      <motion.div
        className="section-label"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={vp}
        transition={{ duration: 0.35, ease }}
      >
        <span className="dot" />
        Skills
      </motion.div>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={vp}
        transition={{ duration: 0.4, delay: 0.05, ease }}
      >
        My <span className="gradient-text">tech stack</span>
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={vp}
        transition={{ duration: 0.35, delay: 0.1, ease }}
      >
        Technologies and tools I use to build, ship, and scale.
      </motion.p>

      <motion.div
        className="skills__categories"
        variants={burstContainer}
        initial="hidden"
        whileInView="visible"
        viewport={vp}
      >
        {skillCategories.map((category) => (
          <motion.div
            className="skills__category glass-card"
            key={category.title}
            variants={burstCard}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <h3 className="skills__category-title">
              <span className="skills__category-dot" style={{ background: category.color, boxShadow: `0 0 10px ${category.color}` }} />
              {category.title}
            </h3>
            <motion.div
              className="skills__tags"
              variants={tagContainer}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
            >
              {category.skills.map((skill) => (
                <motion.span
                  className="skill-tag"
                  key={skill}
                  variants={tagItem}
                >
                  {icons[skill] && (
                    <img
                      src={icons[skill]}
                      alt=""
                      className="skill-tag__icon"
                      loading="lazy"
                      width="14"
                      height="14"
                    />
                  )}
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
