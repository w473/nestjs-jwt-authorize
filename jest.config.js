module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '\\.(component-)?test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts', '!**/bin/**', '!**/src/types/**'],
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  clearMocks: true,
  coveragePathIgnorePatterns: ['src/decorators/*', 'src/index.ts'],
};
