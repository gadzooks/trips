// jest.setup.js
require('isomorphic-fetch');
const { TextEncoder, TextDecoder } = require('util');

Object.assign(global, {
  TextDecoder,
  TextEncoder
});

// We don't need to explicitly set these as isomorphic-fetch handles them
// Headers, Request, and Response are automatically added to global