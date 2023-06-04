import { version } from 'hookage';

/**
 * Creates files using the provided package data and package JSON path.
 *
 * @param {Object} pkg - The package data object.
 * @param {Object} pkg.devDependencies - The devDependencies object.
 * @param {Object} pkg.scripts - The scripts object.
 * @param {Object} pkg.hookage - The hookage object.
 * @param {string} packageJsonPath - The path to the package.json file.
 */
export function createFiles(pkg, packageJsonPath) {
  pkg.devDependencies = {
    ...pkg.devDependencies,
    hookage: `^${version()}`,
  };
  pkg.scripts = {
    ...pkg.scripts,
    prepare: 'hookage install',
  };
  pkg.hookage = {
    'pre-commit': ['npm run lint'],
    'pre-push': ['npm run test'],
  };
  return [
    {
      file: './.hookage/pre-commit',
      content: 'npx hookage pre-commit',
    },
    {
      file: './.hookage/pre-push',
      content: 'npx hookage pre-push',
    },
    {
      file: packageJsonPath,
      content: JSON.stringify(pkg, null, 2),
    },
  ];
}
