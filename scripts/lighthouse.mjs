// Lighthouse (mobile) against `vite preview` on :4173, using Playwright's Chromium.
// usage: npx vite build && npx vite preview --port 4173, then node scripts/lighthouse.mjs [out.json]
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';

const out = process.argv[2] || 'lighthouse-mobile.json';
const browser = await chromium.launch({ channel: process.env.LH_CHANNEL || 'chrome', args: ['--remote-debugging-port=9333'] });
try {
  const { lhr } = await lighthouse('http://localhost:4173/', { port: 9333, output: 'json', logLevel: 'error', formFactor: 'mobile' });
  writeFileSync(out, JSON.stringify(lhr));
  for (const [k, c] of Object.entries(lhr.categories)) console.log(k.padEnd(16), Math.round(c.score * 100));
  for (const id of ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'])
    console.log(id.padEnd(26), lhr.audits[id].displayValue);
  for (const a of Object.values(lhr.audits))
    if (a.score !== null && a.score < 0.9 && !['informative', 'manual', 'notApplicable'].includes(a.scoreDisplayMode))
      console.log('below 0.9:', a.id, a.score, a.displayValue || '');
} finally {
  await browser.close();
}
