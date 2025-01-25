// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    moduleDirectories: ['./node_modules', 'src'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
      '^.+\\.(t|j)sx?$': ['@swc/jest'],
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
      '^@jest/globals$': require.resolve('@jest/globals')
    },
    testMatch: ['**/*.test.tsx', '**/*.test.ts'],
    setupFiles: ['./jest.setup.js']
  };