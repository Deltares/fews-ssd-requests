module.exports = {
    roots: ['<rootDir>'],
    transform: {'^.+\\.ts?$': 'ts-jest'},
    testRegex: "\.spec\.(ts|tsx|js)$",
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
      'ts-jest': {
        useESM: true,
      },
    },
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    reporters: [ "default", "jest-junit" ],
    testResultsProcessor: "jest-teamcity-reporter",
    setupFiles: ["./.env.test"],
    coverageReporters: ["lcov", "text", "teamcity"],
    testEnvironment: "jsdom"
}
