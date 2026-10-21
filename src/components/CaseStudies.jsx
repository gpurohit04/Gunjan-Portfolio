import { useId, useState } from 'react';
import { caseStudies } from '../content';
import Diagram, { Layout } from '../diagrams/Diagram';
import { specs } from '../diagrams/specs';
import './CaseStudies.css';

const KICKER_KEYS = ['Role', 'Team', 'Scope'];

// Narrow no-break spaces keep figures like "0 → 15" tight in a monospace face.
const tight = (v) => v.replace(/ /g, '\u202f');

function Screenshot({ shot }) {
  const [missing, setMissing] = useState(false);
  if (missing && !import.meta.env.DEV) return null;
  return (
    <figure className="cs-shot" data-reveal>
      {missing ? (
        <div className="cs-shot__placeholder data">
          <span>
            Add a dashboard screenshot at <code>public{shot.src}</code>, using seeded, fake candidate data only.
          </span>
        </div>
      ) : (
        <a href={shot.src} target="_blank" rel="noreferrer" className="cs-shot__link">
          <img
            src={shot.src}
            alt={shot.alt}
            width="1900"
            height="817"
            loading="lazy"
            decoding="async"
            onError={() => setMissing(true)}
          />
          <span className="sr-only">(opens full size)</span>
        </a>
      )}
      <figcaption className="dg-caption">
        <span className="label">Screen</span>
        <span>{shot.caption}</span>
      </figcaption>
    </figure>
  );
}

function Thumb({ cs }) {
  const uid = useId().replace(/:/g, '');
  if (cs.screenshot) return <img src={cs.screenshot.src} alt="" width="1900" height="817" loading="lazy" decoding="async" />;
  const spec = specs[cs.diagram];
  return <Layout layout={spec.wide} labels={spec.labels} className="wi-svg" uid={`th${uid}`} crop={spec.thumb} flows />;
}

// A visual table of contents: one tile per case study.
function WorkIndex() {
  return (
    <ol className="wi">
      {caseStudies.map((cs, i) => (
        <li key={cs.id} data-reveal style={{ '--reveal-delay': `${i * 60}ms` }}>
          <a className="wi-tile" href={`#${cs.id}`}>
            <span className="wi-thumb" aria-hidden="true">
              <Thumb cs={cs} />
            </span>
            <span className="wi-title">{cs.title}</span>
            {cs.results ? (
              <span className="wi-metric">
                <span className="wi-metric__value">{tight(cs.results[0][0])}</span>
                <span className="wi-metric__label">{cs.results[0][1]}</span>
              </span>
            ) : (
              <span className="wi-metric">
                <span className="wi-metric__role">{cs.roleShort}</span>
                <span className="wi-metric__label">Team project, {cs.stack.slice(0, 2).join(' and ')}</span>
              </span>
            )}
          </a>
        </li>
      ))}
    </ol>
  );
}

function Story({ cs }) {
  const count = cs.incidents?.length;
  return (
    <details className="cs-story">
      <summary>
        <span className="cs-story__open">
          Read the full story{count ? `: ${count} things that broke, and how I fixed them` : ''}
        </span>
        <span className="cs-story__close">Close the story</span>
      </summary>
      <div className="cs-story__body">
        <section>
          <h4 className="label">Problem</h4>
          <p className="prose">{cs.problem}</p>
        </section>
        <section>
          <h4 className="label">{cs.hardPartTitle}</h4>
          {cs.incidents ? (
            <ol className="cs-incidents">
              {cs.incidents.map((inc) => (
                <li key={inc.title}>
                  <h5 className="cs-incidents__title">{inc.title}</h5>
                  <p className="prose">{inc.text}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="prose">
              {cs.hardPart.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          )}
          {cs.resultsNote && <p className="prose cs-story__note">{cs.resultsNote}</p>}
        </section>
      </div>
    </details>
  );
}

function CaseStudy({ cs, fig, dark }) {
  const kicker = cs.meta.filter(([k]) => KICKER_KEYS.includes(k)).map(([, v]) => v);
  const [headline, ...rest] = cs.results || [];
  const mine = Object.values(specs[cs.diagram].labels).some((l) => l.mine);
  return (
    <article className={`cs-band${dark ? ' theme-ink' : ''}`} id={cs.id} aria-labelledby={`${cs.id}-title`}>
      <div className="wrap">
        <header className="grid cs-top" data-reveal>
          <div className="cs-top__text">
            <p className="label">{kicker.join(' · ')}</p>
            <h3 className="cs-title" id={`${cs.id}-title`}>
              {cs.title}
            </h3>
            <p className="lead cs-problem">{cs.problemShort}</p>
          </div>
          <div className="cs-top__numbers">
            {headline ? (
              <>
                <p className="cs-headline">
                  <span className="cs-headline__value">{tight(headline[0])}</span>
                  <span className="cs-headline__label">{headline[1]}</span>
                </p>
                {rest.map(([v, k]) => (
                  <p key={k} className="cs-minor">
                    <span className="cs-minor__value">{v}</span>
                    <span className="cs-minor__label">{k}</span>
                  </p>
                ))}
              </>
            ) : (
              <>
                {cs.role && (
                  <p className="cs-role">
                    <span className="label">My part</span>
                    <span className="cs-role__text">{cs.role}</span>
                  </p>
                )}
                {cs.repo && (
                  <a className="btn" href={cs.repo} target="_blank" rel="noreferrer">
                    Read the code ↗
                  </a>
                )}
              </>
            )}
          </div>
        </header>

        <div className="cs-figure" data-reveal>
          <Diagram
            spec={specs[cs.diagram]}
            fig={fig}
            caption={
              mine ? (
                <>
                  {cs.caption} <span className="cs-mine" aria-hidden="true" /> marks the part I owned.
                </>
              ) : (
                cs.caption
              )
            }
          />
        </div>

        {cs.screenshot && <Screenshot shot={cs.screenshot} />}

        <div className="cs-foot" data-reveal>
          <p className="cs-stack">
            <span className="label">Built with</span>
            <span className="data">{cs.stack.join('  ·  ')}</span>
          </p>
          <Story cs={cs} />
        </div>
      </div>
    </article>
  );
}

export default function CaseStudies() {
  return (
    <>
      <section className="section work" id="work" aria-labelledby="work-title">
        <div className="wrap">
          <div className="work__head" data-reveal>
            <h2 className="h2" id="work-title">
              Projects
            </h2>
            <p className="lead work__dek">Four systems, from the problem to the numbers it hit.</p>
          </div>
          <WorkIndex />
        </div>
      </section>
      {caseStudies.map((cs, i) => (
        <CaseStudy key={cs.id} cs={cs} fig={i + 2} dark={i === 0} />
      ))}
    </>
  );
}
