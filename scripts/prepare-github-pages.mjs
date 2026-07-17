import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const outputDirectory = 'dist';
const basePath = '/DFDV2';
const textExtensions = new Set(['.html', '.js', '.css', '.json']);

async function rewrite(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      await rewrite(path);
      continue;
    }

    if (!textExtensions.has(extname(entry.name))) continue;

    const source = await readFile(path, 'utf8');
    const updated = source
      .replaceAll('"/_expo/', `"${basePath}/_expo/`)
      .replaceAll('"/assets/', `"${basePath}/assets/`)
      .replaceAll('"/favicon.ico', `"${basePath}/favicon.ico`);

    if (updated !== source) await writeFile(path, updated);
  }
}

await rewrite(outputDirectory);
await writeFile(join(outputDirectory, '.nojekyll'), '');
