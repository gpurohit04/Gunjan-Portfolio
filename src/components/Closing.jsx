import { education, intro, person, skills, work } from '../content';
import './Closing.css';

export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="exp-title">
      <div className="wrap">
        <h2 className="h2" id="exp-title" data-reveal>
          Experience
        </h2>

        <article className="xp-work" data-reveal aria-labelledby="xp-work-title">
          <header className="xp-work__head">
            <h3 className="xp-what" id="xp-work-title">
              {work.what}
            </h3>
            <p className="xp-where">
              {work.where} <span className="data xp-when">· {work.when}</span>
            </p>
          </header>
          <dl className="xp-metrics">
            {work.metrics.map(([v, k]) => (
              <div key={k}>
                <dt>{v}</dt>
                <dd>{k}</dd>
              </div>
            ))}
          </dl>
          <p className="prose xp-note">{work.note}</p>
        </article>

        <div className="xp-edu" data-reveal>
          <h3 className="label">Education</h3>
          <ul>
            {education.map((e) => (
              <li key={e.what}>
                <p className="data xp-when">{e.when}</p>
                <p className="xp-edu__what">{e.what}</p>
                <p className="xp-where">{e.where}</p>
                <p className="xp-edu__note">{e.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// About and skills in one short section: a statement, then the toolset as plain text.
export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="wrap grid" data-reveal>
        <h2 className="margin label" id="about-title">
          About
        </h2>
        <div className="content">
          <p className="about-lead">{intro[0]}</p>
          <p className="about-rule">{intro[1]}</p>
          <dl className="skills" aria-label="Skills">
            {skills.map(([k, v]) => (
              <div key={k}>
                <dt className="label">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

const contacts = [
  ['Email', person.email, `mailto:${person.email}`],
  ['LinkedIn', 'linkedin.com/in/gunjan-purohit-42115b306', person.linkedin],
  ['GitHub', 'github.com/gpurohit04', person.github],
];

export function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap grid" data-reveal>
        <p className="margin label">Contact</p>
        <div className="content">
          <h2 className="h2 contact__title" id="contact-title">
            Hiring for DevOps, SRE or cloud infrastructure? I’d like to hear about it.
          </h2>
          <p className="lead contact__avail">Available for {person.availability.replace('Summer', 'summer')}.</p>
          <ul className="contact__list">
            {contacts.map(([label, text, href]) => (
              <li key={label}>
                <span className="label">{label}</span>
                <a
                  className="link contact__link"
                  href={href}
                  {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {text}
                  <span aria-hidden="true">{href.startsWith('mailto') ? ' →' : ' ↗'}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap">
        <footer className="footer data">
          <span>
            © {new Date().getFullYear()} {person.name}
          </span>
          <span>Set in Instrument Sans and IBM Plex Mono. Built with React and three.js.</span>
        </footer>
      </div>
    </section>
  );
}
