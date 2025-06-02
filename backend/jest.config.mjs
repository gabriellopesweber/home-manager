const isCI = process.env.CI === "true"

const preset = isCI ? {} : { preset: '@shelf/jest-mongodb' }

export default {
  transform: {},
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.mjs'],
  ...preset
}
