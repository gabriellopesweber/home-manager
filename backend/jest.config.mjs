const isCI = process.env.CI === "true"

const teste = isCI ? {} : { preset: '@shelf/jest-mongodb' }
console.log('CI?', isCI, teste)

export default {
  transform: {},
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.mjs'],
  preset: "@shelf/jest-mongodb",
  ...teste
}
