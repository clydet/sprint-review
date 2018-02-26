module.exports = {
  rootDir: '..',
  verbose: true,
  collectCoverage: true,
  globalSetup: './.jest/setup.js',
  globalTeardown: './.jest/teardown.js',
  testEnvironment: './.jest/mongo-environment.js'
};
