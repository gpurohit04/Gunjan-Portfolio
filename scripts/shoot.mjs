// Screenshot a section at desktop and mobile widths.
// usage: node scripts/shoot.mjs <outDir> <name> [selector] [--full] [--reduced] [--click=<selector>] [--wait=<ms>]
import { chromium } from 'playwright';

const [outDir, name, selector = 'body', ...flags] = process.argv.slice(2);
const has = (f) => flags.includes(f);
const opt = (k) => flags.find((f) => f.startsWith(`--${k}=`))?.split('=').slice(1).join('=');
const url = process.env.URL || 'http://localhost:5173/';

const viewports = [
  { tag: 'desktop', width: 1440, height: 900, scale: 1 },
  { tag: 'mobile', width: 390, height: 844, scale: 2, mobile: true },
];

const browser = await chromium.launch({ args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist'] });
for (const vp of viewports) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.scale,
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
    reducedMotion: has('--reduced') ? 'reduce' : 'no-preference',
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(url, { waitUntil: 'networkidle' });
  // Reveal animations run once on intersection; force them so off-screen sections render.
  await page.addStyleTag({ content: '[data-reveal]{opacity:1!important;transform:none!important}' + (selector !== 'body' && !has('--full') ? '.nav{position:relative!important}' : '') });
  await page.evaluate(() => document.querySelectorAll('.dg').forEach((d) => d.classList.add('is-drawn')));
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  if (opt('click')) await page.locator(opt('click')).first().click();
  await page.waitForTimeout(Number(opt('wait') || 600));
  const file = `${outDir}/${name}-${vp.tag}.png`;
  if (has('--full') || selector === 'body') await page.screenshot({ path: file, fullPage: true });
  else await el.screenshot({ path: file });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`${file}  hOverflow=${overflow}px${errors.length ? '  ERRORS: ' + errors.join(' | ') : ''}`);
  await page.close();
}
await browser.close();
