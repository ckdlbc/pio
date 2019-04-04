module.exports = {
    transform: {
        '^.+\\.(t|j)sx?$': 'ts-jest'
    },
    testEnvironment: 'node',
    testRegex: '(/test/.*|(\\.|/)(test|spec))\\.(js?|ts?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: true,
    coverageDirectory: './tmp/coverage',
    testPathIgnorePatterns: ['./test/data/']
}
