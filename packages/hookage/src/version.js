import { readFileSync } from 'fs';

/**
 * @returns {string}
 */
export function version() {
  const pkg = JSON.parse(readFileSync('./package.json').toString());
  return pkg.version;
}
