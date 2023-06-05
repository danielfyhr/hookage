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
    hookage: `^0.0.4`,
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
      mode: 0o0755,
    },
    {
      file: './.hookage/pre-push',
      content: 'npx hookage pre-push',
      mode: 0o0755,
    },
    {
      file: packageJsonPath,
      content: JSON.stringify(pkg, null, 2),
    },
  ];
}
