module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  coverageThreshold: {
    global: {
      lines: 80
    }
  },
  collectCoverageFrom: ['src/services/**/*.ts']
};
