const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  transformIgnorePatterns: [
    // Transform ESM modules that Jest otherwise can't handle
    'node_modules/(?!(openid-client|jose|next-auth)/)',
  ],
};

module.exports = createJestConfig(customJestConfig);