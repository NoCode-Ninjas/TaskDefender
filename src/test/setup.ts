import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock crypto.randomUUID
global.crypto = {
  ...global.crypto,
  randomUUID: () => Math.random().toString(36).substring(2, 15),
} as any;