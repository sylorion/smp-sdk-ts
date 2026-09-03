/** Configuration Jest (ESM + TypeScript). Lancer : `npm test`. */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  transform: { '^.+\\.ts$': ['ts-jest', { useESM: true, tsconfig: { module: 'ESNext', moduleResolution: 'node10', isolatedModules: true } }] },
  testMatch: ['**/tests/**/*.test.ts'],
};
