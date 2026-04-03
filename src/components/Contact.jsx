import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, ArrowUpRight, MapPin, Phone } from 'lucide-react';
import './Contact.css';

const links = [
  {
    icon: <Mail size={22} />,
    label: 'Email',
    value: 'purohitgunjan666@gmail.com',
    href: 'mailto:purohitgunjan666@gmail.com',
  },
  {
    icon: <Linkedin size={22} />,
    label: 'LinkedIn',
    value: 'gunjan-purohit',
    href: 'https://linkedin.com/in/gunjan-purohit-42115b306',
  },
  {
    icon: <Github size={22} />,
    label: 'GitHub',
    value: 'github.com/gunjan',
    href: 'https://github.com/gpurohit04',
  },
  {
    icon: <Phone size={22} />,
    label: 'Phone',
    value: '+1 (480) 410-2779',
    href: 'tel:+14804102779',
  },
];

const ease = [0.22, 1, 0.36, 1];
const vp = { once: false, margin: '-80px' };

const burstContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const burstItem = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease } },
};

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <motion.div
        className="section-label"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={vp}
        transition={{ duration: 0.35, ease }}
      >
        <span className="dot" />
        Contact
      </motion.div>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={vp}
        transition={{ duration: 0.4, delay: 0.05, ease }}
      >
        Let's <span className="gradient-text">connect</span>
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={vp}
        transition={{ duration: 0.35, delay: 0.1, ease }}
      >
        I'm actively looking for summer 2026 internship opportunities in DevOps, SRE, and Cloud Engineering. Let's chat!
      </motion.p>

      <motion.div
        className="contact__location"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.3, delay: 0.15, ease }}
      >
        <MapPin size={16} />
        Tempe, AZ
      </motion.div>

      <motion.div
        className="contact__links"
        variants={burstContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: '-40px' }}
      >
        {links.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="glass-card contact__card"
            variants={burstItem}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="contact__card-icon">{link.icon}</div>
            <div className="contact__card-info">
              <span className="contact__card-label">{link.label}</span>
              <span className="contact__card-value">{link.value}</span>
            </div>
            <ArrowUpRight size={18} className="contact__card-arrow" />
          </motion.a>
        ))}
      </motion.div>

      <footer className="footer">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.35, ease }}
        >
          Designed & Built by <span style={{ color: 'var(--accent-light)' }}>Gunjan Purohit</span>
        </motion.p>
        <p className="footer__copy">&copy; {new Date().getFullYear()} · All rights reserved.</p>
      </footer>
    </section>
  );
}
