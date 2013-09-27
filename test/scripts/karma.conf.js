module.exports = function(config){
    config.set({
        basePath : '../..',
        // frameworks: ['jasmine', 'requirejs'],
        frameworks: ['jasmine', 'requirejs'],
        files : [
            {pattern : 'app/js/*.js', included: false},
            {pattern : 'app/js/**/*.js', included: false},
            {pattern : 'app/libs/**/*.js', included: false},
            {pattern : 'test/libs/**/*.js', included: false},
            {pattern : 'test/unit/**/*Spec.js', included: false},
            // {pattern : 'test/e2e/**/*.js', included: false},
            'test/scripts/test.build.js'
        ],
        exclude: [
            'app/js/app.build.js'
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],


        // web server port
        port: 81,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false

        // plugins : [
        //     'karma-junit-reporter',
        //     'karma-chrome-launcher',
        //     'karma-firefox-launcher',
        //     'karma-jasmine'
        // ]

        // junitReporter : {
        //     outputFile: 'test_out/unit.xml',
        //     suite: 'unit'
        // }

    });
};
