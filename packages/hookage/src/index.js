#!/usr/bin/env node

import { readFileSync } from 'fs';
import { run } from './lib/run-tasks.js';

const pkg = JSON.parse(readFileSync(process.env.npm_package_json).toString());

const command = process.argv[2] ?? '';
const instructions = pkg.hookage[command] ?? [];
try {
  await run(command, instructions);
} catch (e) {
  console.error(e);
  process.exit(1);
}
