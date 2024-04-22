/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  clearMocks: true,
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
};
