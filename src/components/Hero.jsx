import { motion } from 'framer-motion';
import { ArrowDown, FileText } from 'lucide-react';
import WireframeTerrain from './WireframeTerrain';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      {/* Animated background orbs */}
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />

      {/* 3D Wireframe Terrain */}
      <WireframeTerrain />

      <div className="hero__content">
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        >
          <span className="hero__badge-dot" />
          Available for Summer 2026 Internship
        </motion.div>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          Hi, I'm <span className="gradient-text">Gunjan Purohit</span>
        </motion.h1>

        <motion.p
          className="hero__role"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <span className="hero__role-item">DevOps Automation</span>
          <span className="hero__role-divider">·</span>
          <span className="hero__role-item">Site Reliability</span>
          <span className="hero__role-divider">·</span>
          <span className="hero__role-item">Cloud Engineering</span>
        </motion.p>

        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          M.S. Software Engineering @ Arizona State University.
          Building scalable cloud infrastructure and automating everything in between.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <a href="/resume.pdf" download="Gunjan_Purohit_Resume.pdf" className="btn btn-primary btn-glow">
            <FileText size={18} />
            Download Resume
          </a>
          <a href="#projects" className="btn btn-secondary">
            View Projects
            <ArrowDown size={16} />
          </a>
        </motion.div>

        <motion.div
          className="hero__scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="hero__scroll-line" />
        </motion.div>
      </div>
    </section>
  );
}
