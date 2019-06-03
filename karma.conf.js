module.exports = function (config) {
    config.set({
        plugins: [
            'karma-jasmine',
            'karma-mocha-reporter',
            'karma-phantomjs-launcher',
            'karma-typescript'
        ],
        frameworks: ['jasmine', 'karma-typescript'],
        files: [
            'test/**/*.ts',
            'src/**/*.ts'
        ],
        exclude: [
            "./**/*.d.ts"
        ],
        preprocessors: {
            'src/**/*.ts': ['karma-typescript'],
            'test/**/*.ts': ['karma-typescript']
        },
        reporters: ['mocha', 'karma-typescript'],
        browsers: ['PhantomJS'],
        singleRun: true,
        colors: true,
        karmaTypescriptConfig: {
            coverageOptions: {
                exclude: /test\/.*/
            },
            reports: {
                'text': '',
                'html': 'coverage'
            }
        },
        browserConsoleLogOptions: {
            terminal: true,
            level: 'log'
        }
    })
};