// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['mocha','chai'],

        // list of files / patterns to load in the browser
        files: [
            // bower:js
            // endbower
            './Test.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 9001,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        reporters: ['progress', 'jenkins', 'coverage'],

        jenkinsReporter: {
            outputFile: 'report.xml'
        },

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            '*.js': ['coverage']
        },

        coverageReporter: {
            reporters: [
                { type: "html", dir: '../coverage', subdir: '.' },
                { type: "cobertura", dir: '../coverage', subdir: '.' },
            ]
        },


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
