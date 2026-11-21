// Creates the case-study page for a new project.
// Usage: npm run new-project <slug> "<Title>"
// The project's content goes in src/data/content.js (same slug).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const [slug, title] = process.argv.slice(2);
if (!slug || !title) { console.error('Usage: npm run new-project <slug> "<Title>"'); process.exit(1); }
const out = `work/${slug}.html`;
if (existsSync(out)) { console.error(`${out} already exists`); process.exit(1); }
const tpl = readFileSync('scripts/case-template.html', 'utf8');
writeFileSync(out, tpl.replaceAll('__SLUG__', slug).replaceAll('__TITLE__', title));
console.log(`Created ${out}. Now add a project with slug '${slug}' to src/data/content.js`);
