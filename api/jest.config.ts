import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',        // ignore listener
    '!src/**/index.ts',
    '!src/**/types.ts'
  ],
  verbose: true
};

export default config;
