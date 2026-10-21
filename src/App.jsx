import Nav from './components/Nav';
import Hero from './components/Hero';
import CaseStudies from './components/CaseStudies';
import { About, Contact, Experience } from './components/Closing';
import { useReveal, useSmoothScroll } from './lib/motion';

export default function App() {
  useReveal();
  useSmoothScroll();
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <CaseStudies />
        <Experience />
        <About />
        <Contact />
      </main>
    </>
  );
}
