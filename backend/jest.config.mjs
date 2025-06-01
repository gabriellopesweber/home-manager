const isCI = process.env.CI === 'true'

export default {
  transform: {},
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.mjs'],
  preset: "@shelf/jest-mongodb",
  ...(isCI ? {} : { preset: '@shelf/jest-mongodb' }),
}
