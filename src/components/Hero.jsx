import { Fragment } from 'react';
import { person } from '../content';
import SystemFigure from './SystemFigure';
import './Hero.css';

// Letters as spans so they can rise in one after another; words stay unbreakable.
function splitName(name) {
  let i = 0;
  return name.split(' ').map((word, w) => (
    <Fragment key={word}>
      {w > 0 && ' '}
      <span className="hero__word">
        {[...word].map((ch) => (
          <span key={i} className="hero__char" style={{ '--i': i++ }}>
            {ch}
          </span>
        ))}
      </span>
    </Fragment>
  ));
}

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <div className="wrap">
        <div className="grid hero__head">
          <div className="hero__intro">
            {/* The name is drawn like a part on a technical drawing: dimensioned, and marked as mine */}
            <div className="hero__nameblock">
              <h1 className="hero__name" id="hero-name" aria-label={person.name}>
                <span aria-hidden="true">
                  {splitName(person.name)}
                  <span className="hero__mark" />
                </span>
              </h1>
              <p className="hero__dim">
                <span className="hero__dim-line" aria-hidden="true" />
                <span className="label hero__dim-label">{person.role}</span>
                <span className="hero__dim-line" aria-hidden="true" />
              </p>
            </div>
            <p className="lead hero__lead">
              I build cloud systems that take a burst of traffic, scale to meet it, and tell someone when they can’t.
            </p>
            <div className="hero__actions">
              <a className="btn btn--ink" href="#work">
                Projects ↓
              </a>
              <a className="btn" href={person.resume} download="Gunjan_Purohit_Resume.pdf">
                Résumé, PDF
              </a>
            </div>
          </div>
          <dl className="hero__meta">
            <div>
              <dt className="label">Now</dt>
              <dd>
                {person.school}, graduating {person.graduation}
              </dd>
            </div>
            <div>
              <dt className="label">Available</dt>
              <dd>{person.availability}</dd>
            </div>
            <div>
              <dt className="label">Based in</dt>
              <dd>{person.location}</dd>
            </div>
          </dl>
        </div>
        <SystemFigure />
      </div>
    </section>
  );
}
