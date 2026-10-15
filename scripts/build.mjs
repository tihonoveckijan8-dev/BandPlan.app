import { build } from 'esbuild';
import { cp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');

await rm(out, {recursive:true, force:true});
await mkdir(out, {recursive:true});

const staticFiles = [
  'index.html',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png'
];

for (const file of staticFiles) {
  const source = path.join(root, file);
  if (existsSync(source)) await cp(source, path.join(out, file));
}

for (const dir of ['assets', 'fonts', 'vendor']) {
  const source = path.join(root, dir);
  if (existsSync(source)) await cp(source, path.join(out, dir), {recursive:true});
}

for (const file of ['bandplan.js','bandplan-core.js','config.js','supabase.js','sw.js','bandplan.css']) {
  // WHY: compile the small TypeScript loader into the existing public filename; HTML and SW URLs stay unchanged.
  // WHY: keep the deployed URL config.js while promoting its typed source to the production artifact.
  const entryFile = file === 'bandplan.js' ? 'bandplan-entry.ts' : file === 'config.js' ? 'config.ts' : file;
  // WHY: generate a fresh shell cache namespace on every build instead of relying on manual SW edits.
  if (file === 'sw.js') {
    const source = await readFile(path.join(root, file), 'utf8');
    const version = `${new Date().toISOString().slice(0,10).replaceAll('-', '')}-${Date.now()}`;
    await build({
      stdin: { contents: source.replaceAll('__BANDPLAN_CACHE_VERSION__', version), resolveDir: root, sourcefile: file, loader: 'js' },
      outfile: path.join(out, file), bundle: false, minify: true,
      target: ['es2020', 'safari15'], legalComments: 'none', charset: 'utf8'
    });
    continue;
  }
  await build({
    entryPoints:[path.join(root,entryFile)],
    outfile:path.join(out,file),
    bundle:false,
    // WHY: config.js is loaded as a classic script; do not emit an ES-module export marker.
    format: file === 'config.js' ? 'iife' : undefined,
    minify:true,
    target:['es2020','safari15'],
    legalComments:'none',
    charset:'utf8'
  });
}

// WHY: emit the isolated TypeScript date helpers as a standalone ES module so browser smoke tests can exercise their runtime behavior without wiring them into the legacy core.
const typedCoreDir = path.join(out, 'core');
await mkdir(typedCoreDir, {recursive:true});
await build({
  entryPoints:[path.join(root, 'core/date-utils.ts')],
  outfile:path.join(typedCoreDir, 'date-utils.js'),
  bundle:false,
  format:'esm',
  minify:true,
  target:['es2020','safari15'],
  legalComments:'none',
  charset:'utf8'
});

// WHY: emit typed duration helpers as a standalone module; the classic core can consume them without bundling the whole app.
await build({
  entryPoints:[path.join(root, 'core/format-utils.ts')],
  outfile:path.join(typedCoreDir, 'format-utils.js'),
  bundle:false,
  format:'esm',
  minify:true,
  target:['es2020','safari15'],
  legalComments:'none',
  charset:'utf8'
});

await writeFile(path.join(out, '.nojekyll'), '');
console.log('BandPlan production build complete:', out);
