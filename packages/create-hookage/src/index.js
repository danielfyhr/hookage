#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname } from 'node:path';
import { createFiles } from './lib/create-hookage.js';

const packageJsonPath = process.env['npm_package_json'];
const pkg = JSON.parse(readFileSync(packageJsonPath ?? '').toString());
if (!pkg) {
  throw Error(
    `Could not find or parse package.json. packageJsonPath: ${packageJsonPath}`
  );
}
const git = existsSync('.git');
if (!git) {
  throw Error(
    'Hookage must be installed in a git repository, there is no .git here.'
  );
}
const files = createFiles(pkg, packageJsonPath ?? '');

console.log('Installing hookage...');
console.log('Creating files...');
files.forEach((f) => console.log('📋', f.file));
files.map(({ file, content }) => writeFile(file, content));
console.log('Configuring git to use hookage...');
execSync('git config core.hooksPath .hookage');

console.log('Done!');
console.log(`Inspect your package.json (${packageJsonPath})`);
console.log('Run npm install (or yarn or pnpm)');

/**
 *
 * @param {string} path path to the file to write
 * @param {string} content content of the file
 * @returns {void}
 */
function writeFile(path, content) {
  const folderPath = dirname(path);
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath, { recursive: true });
  }
  writeFileSync(path, content);
}
