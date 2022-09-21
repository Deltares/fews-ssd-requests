module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testRegex: "\.spec\.(ts|tsx|js)$",
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    reporters: [ "default", "jest-junit" ],
    "testResultsProcessor": "jest-teamcity-reporter",
    "coverageReporters": ["lcov", "text", "teamcity"]
}
