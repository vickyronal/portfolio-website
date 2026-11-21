// Builds the ATS-friendly resume PDF from resume/resume.html.
// Usage: npm run resume   (needs Google Chrome installed)
import { chromium } from 'playwright-core';
import { resolve } from 'node:path';
const out = 'public/assets/Vignesh-G-Senior-Visual-Designer-Resume.pdf';
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await browser.newPage();
await page.goto('file://' + resolve('resume/resume.html'));
await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('Resume written to', out);
