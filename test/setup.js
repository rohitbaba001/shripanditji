// Test setup file for vitest
// Add global test utilities and mocks here

// Mock service worker API if needed
if (typeof global.navigator === 'undefined') {
  global.navigator = {};
}

if (typeof global.caches === 'undefined') {
  global.caches = {
    open: () => Promise.resolve({}),
    match: () => Promise.resolve(undefined),
    keys: () => Promise.resolve([]),
  };
}
