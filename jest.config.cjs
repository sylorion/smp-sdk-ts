/** Configuration Jest (ESM + TypeScript). Lancer : `npm test`. */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  transform: { '^.+\\.ts$': ['ts-jest', { useESM: true, tsconfig: { module: 'ESNext', moduleResolution: 'node10', isolatedModules: true } }] },
  // Les gardes d'alignement avec les contrats partagés (ex. src/types/plan/*.spec.ts)
  // vivent à côté du code : sans ce motif, `npm test` ne les exécutait jamais.
  testMatch: ['**/tests/**/*.test.ts', '**/src/**/*.spec.ts'],
};
