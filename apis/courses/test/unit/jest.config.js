const options = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/*.spec.ts'],
  testEnvironment: 'node',
  silent: true,
  collectCoverage: false,
  setupFilesAfterEnv: ['./setup.ts'],
};
// eslint-disable-next-line no-undef
module.exports = options;
