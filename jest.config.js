/* eslint-disable max-len */

module.exports = {
  cacheDirectory: '/tmp/jest_rs',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/', 'src/index.local.js', 'src/bin/index.js',
  ],
  coverageReporters: [
    'text-summary',
    'lcov',
  ],
  coverageThreshold: {
    global: {
      branches: 97,
      functions: 97,
      lines: 97,
      statements: 97,
    },
  },
  setupFilesAfterEnv: ['jest-extended'],
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/?(*.)+test.js?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
};
