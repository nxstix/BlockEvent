module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  reporters: ["default", "jest-junit"],
  testMatch: ["**/*.test.js"]
};