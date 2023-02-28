const options = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/*.spec.ts'],
  testEnvironment: 'node',
  silent: true,
  collectCoverage: true,
};
// eslint-disable-next-line no-undef
module.exports = options;
