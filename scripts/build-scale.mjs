import { appendFile, readFile } from 'node:fs/promises';
import path from 'node:path';

await import('./build-release.mjs');

const root = process.cwd();
const scaleLayer = await readFile(path.join(root, 'src', 'scale.css'), 'utf8');

await appendFile(
  path.join(root, 'dist', 'styles.css'),
  `\n${scaleLayer.trim()}\n`,
  'utf8',
);

console.log('Applied the large-screen typography and layout scale layer.');
