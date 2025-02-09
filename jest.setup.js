// jest.setup.js
require('isomorphic-fetch');
const { TextEncoder, TextDecoder } = require('util');

Object.assign(global, {
  TextDecoder,
  TextEncoder
});

// Mock ResizeObserver before rendering
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// We don't need to explicitly set these as isomorphic-fetch handles them
// Headers, Request, and Response are automatically added to global